/*
|--------------------------------------------------------------------------
| PACT - Escalation Tool and Issue tracker
|--------------------------------------------------------------------------
|
| Escalation Tool used by Pro Advanced Care Team is intented to save time,
| and allow for rapid escalations. Tool is responsible for automating 
| Site Checks for domains and formatting escalation text based on Agent
| Toolkit data. 
|
| For the brave souls who get this far: You are the chosen ones,
| the valiant knights of programming who toil away, without rest,
| fixing the most awful code. To you, true saviors, kings of men,
| I say this: never gonna give you up, never gonna let you down,
| never gonna run around and desert you. Never gonna make you cry,
| never gonna say goodbye. Never gonna tell a lie and hurt you.
*/

;(JSTextParser = () => {
 // Whole-script strict mode syntax
'use strict';

    //Variables Declared first to minimize DOM calls. 
const pasteBox = document.getElementById('pasteBox');
const resultBox = document.getElementById('resultBox');
const parseButton = document.getElementById('parseButton');
const resetButton = document.getElementById('resetButton');
const situationBox = document.getElementById('situationBox');

//Variables to enable slack issue tracker.
const slackSubmitButton = document.getElementById('SubmitSlack');
const slackPTag = document.getElementById('slackPTag');
const slackTextBox = document.getElementById('slackBox');

let insensitiveSlackArray = []; //Slack escalation array - ready to push
let sensitiveSlackArray = []; //Escalation array which still contains sensitive infomration. 


/* Majority of functionality is tied to click event for parse button.
We start with content checking, setting a few scoped variables then -
we begin parsing agent given content and set into arrays.
Also part of this event listener will be integrated logic to prevent 
obvious mis-use, spam, or buggy results. */
parseButton.addEventListener("click", function(originArray, resultArray){
    //The following will check for no values in form and will return click event if no values exist.
    if (!SafeToPrintResultsBox()){return;}
    resultBox.value = ''; //Setting to clear with each parse click. 
    // ** Breaking the regexes out into variables for readability / scalability
    const urlRegex = /^https:\/\/[^/]+/i;
    const customerNumberRegex = /^\#(\d+)/;
    let urlFound = 0; //Count should max at 2. Blocks parsing output.

    let defaultDomainValue = '';
    let primaryDomainValue = '';

    //Splitting long string into array by first splitting new lines. 
    originArray = pasteBox.value.split("\n");
    resultArray = []; // Result array will contain escalation details. 
    resultArray.push('#### MWP 2.0 Assistance Request ####\n'); //Start of template

    /* Within forEach we first remove WhiteSpace.
    We then parse for domains using urlRegex and count them. 
    urlFound count prevents more or less then two domains.
    Site ID match to pull out SiteID from parsing form and place into array.
    extract customer number and remove superflous characters.
    show visible error on results box and partially reset the form.
    SafeToPrintResultsBox(), NoEmptyValuesExist(), SubmissionEnabler
    call either DefaultDomainOnly() or DefaulyAndPrimaryDomains() based on content.
     */
    originArray.forEach(function(element, index, arr) {
       element = element.replace(/^\s+/i, '');
        if(element.match(urlRegex)) {
            resultArray.push(`${arr[index - 1]}: ${element}\n`);
            // set domain values for site checks later.
            if (arr[index - 1] === 'Default Domain') {
                defaultDomainValue = element;
                urlFound++;
            } else if (arr[index - 1] === 'Primary Domain') {
                primaryDomainValue = element;
                urlFound++;
            }
        }

        if (element.match(/Site ID/i)){ //Using Increment to pull adjacent array value.
            if(arr[index + 1] !== '') {
                resultArray.push(`Site ID: ${arr[index + 1]}\n`);
            }
        }
        
        if (element.match(customerNumberRegex)) { //Pull Customer number and remove the #
            if(element.substr(1) !== ''){
                resultArray.push(`Customer Number: ${element.substr(1)}\n`); //remove # character
            }
        
        }
    });
    if (urlFound !== 2) {
        resultBox.value = `Error Found : ${urlFound} URLs - (Should be 2)`;
        PartialReset(originArray, resultArray, insensitiveSlackArray,sensitiveSlackArray);
        return;
    }
    resultArray.push(`\nSituation: ${situationBox.value}\n`);//alter value to end of each array itteration.

    if (SafeToPrintResultsBox()){//Checks for empty form fields.
        resultArray.forEach(function (element){ 
            resultBox.value = resultBox.value + element;//Iterate each key and value
        });
        resultBox.value = resultBox.value + ('\n');//Ease of reading
    

    //display only 3 or all 6 site check options.
        if(NoEmptyValuesExist()){ //Checks for empty domain fields
            let submissionEnablerVariable = SubmissionEnabler(resultArray);
            if(submissionEnablerVariable === true){ //Submission Enabler function based on array values
                if (defaultDomainValue === primaryDomainValue) { //Do default and primary match?
                    DefaultDomainOnly(defaultDomainValue);
                    parseButton.setAttribute('disabled', 'disabled');//Must disable after  content checks to prevent spam.
                } else { //Do default and primary match?
                    DefaulyAndPrimaryDomains(defaultDomainValue, primaryDomainValue);
                    parseButton.setAttribute('disabled', 'disabled');//Must disable after  content checks to prevent spam.
                }
            } else { //Submission Enabler returned !true. Handle the output.
                resultBox.value = '';
                submissionEnablerVariable.forEach(function(element) {
                    resultBox.value = resultBox.value + `Missing: ${element} \n`;
                });
                PartialReset(originArray, resultArray, insensitiveSlackArray,sensitiveSlackArray);
            }  
        }//Checks for empty domain fields.
    }//Checks for empty form fields.
});//End of button click event.


/* If a parse is allowed and all values are not present then we will do a 
- PartialReset. By partially resetting we avoid having arrays containing
 more then a single set of parsed data. */
function PartialReset(origArray, resuArray, insensSlackArray, sensSlackArray){
    //Results Box is set with error for agent
    //resultBox.value = 'Text-To-Parse Missing Critical Values';
    //Re-declare empty parsing arrays
    origArray = []; // Global Origin Array will have values set after parse button click.
    resuArray = []; // Result array will contain escalation details. 
    insensSlackArray = []; //Reset Slack arrays
    sensSlackArray = []; //Reset Slack arrays
}

/* Function checks to make sure that both a paste from Agent Toolkit
as well as an explaination of the situation are present in the form. */
function SafeToPrintResultsBox() {
    if(situationBox.value != '' && pasteBox.value != ''){
        return true;
    }
}

/* DefaultDomainOnly is a function which is passed the default domain value.
Function will then run AutoApiChecker on the necessary domains with pre-set suffix.
Aslo toggling and creating the slack array within this function. */
function DefaultDomainOnly(defaultDomainValue){
    ToggleSubmitToSlackButton();
    CleanSlackPosting();//To fill slack content box for issue tracker template
    AutoApiChecker(defaultDomainValue + '/__mwp2_check__');
    AutoApiChecker(defaultDomainValue + '/__mwp2_httpd_check__');
    AutoApiChecker(defaultDomainValue + '/__mwp2_php_check__');
}

/* DefaultAndPrimaryDomains is a function which is passed the two domain values.
Function will then run AutoApiChecker on the necessary domains with pre-set suffix.
Aslo toggling and creating the slack array within this function. */
function DefaulyAndPrimaryDomains(defaultDomainValue, primaryDomainValue){
    ToggleSubmitToSlackButton();
    CleanSlackPosting();//To fill slack content box for issue tracker template
    AutoApiChecker(defaultDomainValue + '/__mwp2_check__');
    AutoApiChecker(defaultDomainValue + '/__mwp2_httpd_check__');
    AutoApiChecker(defaultDomainValue + '/__mwp2_php_check__');
    AutoApiChecker(primaryDomainValue + '/__mwp2_check__');
    AutoApiChecker(primaryDomainValue + '/__mwp2_httpd_check__');
    AutoApiChecker(primaryDomainValue + '/__mwp2_php_check__');
}

/* NoEmpryValuesExist is passed the default and primary domain names
and returns true if both are not empty values. */
function NoEmptyValuesExist(Def, Pri){
    if(Def != '' && Pri != ''){
        return true;
    }
}

/* SubmissionEnabler will take the resultsArray and check it for 
Mandatory values before allowing submission to Slack. */
function SubmissionEnabler(array){
    let x = 0; //x should equal 5 if it has the situation.
    let missing = ["Site ID", "Customer Number", "Primary Domain", "Default Domain", "Situation"];
    array.forEach(function(element,index,arr){
        if (element.match(/Site ID/i) !== null) {
            x++;let y = missing.indexOf("Site ID"); missing.splice(y,1);}
        if (element.match(/Customer Number/) !== null) {
            x++;let y = missing.indexOf("Customer Number"); missing.splice(y,1);}
        if (element.match(/Primary Domain:/) !== null) {
            x++;let y = missing.indexOf("Primary Domain"); missing.splice(y,1);}
        if (element.match(/Default Domain/) !== null) {
            x++;let y = missing.indexOf("Default Domain"); missing.splice(y,1);}
        if (element.match(/Situation/) !== null) {
            x++;let y = missing.indexOf("Situation"); missing.splice(y,1);}
    })
    if (x === 5){
        return true;
    } else {
        return missing;
    }
}

/* ToggleSubmitToSlackButton() should only execute when domain content has been confirmed.
Function will make visibile the slack submission preview, submit button and -
the <p> html tag/description */
function ToggleSubmitToSlackButton(){
    //Button Toggle
    slackSubmitButton.removeAttribute("style");
    slackSubmitButton.setAttribute("style", "display: inline;");
    //p tag toggle
    slackPTag.removeAttribute("style");
    slackPTag.setAttribute("style", "display: inline;");
    //result box toggle
    slackTextBox.removeAttribute("style");
    slackTextBox.setAttribute("style", "display: inline;");
}



/* Standard Event Listener. Calling a seperate function for modular code.
Also utilizing partialReset() */
resetButton.addEventListener('click', function(originArray, resultArray) {
    ResetFormValues(originArray, resultArray);
});

/* CleanSlackPosting() function will take the visible slack submission preview
and push into array elements split on new lines. forEach in this function will
pull out the insensitive information to be used for issue tracking in Slack */
function CleanSlackPosting(){
    insensitiveSlackArray = [];//Global Variable is reset at this point
    sensitiveSlackArray = resultBox.value.split("\n"); //Resetting global variable to use current results value.
    insensitiveSlackArray.push("#### MWP 2.0 Issue Tracker ####\n");
    
    sensitiveSlackArray.forEach(function(element, index, arr) {
        if (element.match(/Site ID: [^/]+/i)) {
            arr[index] = arr[index].replace(':',': \`');
            insensitiveSlackArray.push(arr[index] + ' \`\n');
        }
        if (element.match(/Default Domain: [^]+/i)){
            arr[index] = arr[index].replace(':',': \`');
            insensitiveSlackArray.push(arr[index] + ' \`\n');
        }
        if (element.match(/Primary Domain: [^]+/i)){
            arr[index] = arr[index].replace(':',': \`');
            insensitiveSlackArray.push(arr[index] + ' \`\n');
        }
        if (element.match(/Situation: [^]+/i)){
            arr[index] = arr[index].replace(':',': \`');
            insensitiveSlackArray.push(arr[index] + ' \`\n');
        }
    });
    //Print values for confirmation before submssion to slack.
    insensitiveSlackArray.forEach(function(element,index,arr){
        slackTextBox.value = slackTextBox.value += arr[index];
    });
}

/* ResetFormValues() will allow set-to-defaults feature for escalation form.
When reset, form should behave as if it were first load of page.
This function resets all form values. */
function ResetFormValues(origArray, resuArray) {
    //PasteBox
    pasteBox.innerText = '';
    pasteBox.textContent = '';
    pasteBox.value = '';
    //Results Box
    resultBox.value = '';
    //Request Box
    situationBox.innerText = '';
    situationBox.textContent = '';
    situationBox.value = '';
    //Redeclare empty parsing arrays
    origArray = []; // Global Origin Array will have values set after parse button click.
    resuArray = []; // Result array will contain escalation details. 
    
    
    slackSubmitButton.removeAttribute("style");//Hiding the Submit Slack Button
    slackSubmitButton.setAttribute("style", "display: none;");//Hiding the Submit Slack Button
    slackPTag.removeAttribute("style");//p tag toggle
    slackPTag.setAttribute("style", "display: none;");//p tag toggle
    //result box toggle
    slackTextBox.removeAttribute("style");
    slackTextBox.setAttribute("style", "display: none;");
    slackTextBox.value = '';
    //Reset Slack arrays
    insensitiveSlackArray = [];
    sensitiveSlackArray = [];
    //Finally re-enable parse button.
    parseButton.removeAttribute('disabled');
}

/* AutoApiChecker() should be passed the specific site to be checked IE. 
https://abc.xyz.godaddywp.com/__mwp2_check__ 
We see thus function being called after sucessful parse button click.
Function uses fetch functionality*/
function AutoApiChecker(SiteToCheck) {
    let url = SiteToCheck;
    fetch(url)
    .then(function(response) {
    return response.ok;
    
    })
    .then(function(respOK) {
        if(respOK == true){
            resultBox.value = resultBox.value + SiteToCheck + ' Reports: OK \n';
        } else {
            resultBox.value = resultBox.value + SiteToCheck + ' Reports: FAIL \n';
        }
    })
    .catch(function(error) {
        resultBox.value = resultBox.value + SiteToCheck + ' Reports: FAIL - Network Err \n';
    });
}


/* Event listener for the Slack Submission Button. 
Button should only allow click when content has been confirmed correct. 
*/
slackSubmitButton.addEventListener( "click", function() {
    let url = "https://ThisIsAPlaceHolder.Comz";
    let text = slackTextBox.value;
    $.ajax({data: 'payload=' + JSON.stringify({
        "text": text
    }),
    dataType: 'json',
    processData: false,
    type: 'POST',
    url: url
    });  
    slackSubmitButton.setAttribute('disabled', 'disabled');
});  
// For slack configuration please view the API documentation for Incoming Webhooks
// https://godaddy.slack.com/apps/A0F7XDUAZ-incoming-webhooks?page=1

})();

