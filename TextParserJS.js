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


//3 top level event listeners [ParseButton, ResetButton, Checkbox Listeners]
//Parse button click events.
parseButton.addEventListener("click", function(){
    // ** Breaking the regexes out into variables for readability / scalability
    const urlRegex = /^https:\/\/[^/]+/i;
    const customerNumberRegex = /^\#(\d+)/;

    //Splitting long string into array by first splitting new lines. 
    originArray = pasteBox.value.split("\n");
    resultArray = []; // Result array will contain escalation details. 
    resultArray.push('#### MWP 2.0 Assistance Request ####\n'); //Start of template

    originArray.forEach(function(element, index) {
       element = element.replace(/^\s+/i, '');
        
        if(element.match(urlRegex)) {
            resultArray.push(`${originArray[index - 1]}: ${element}\n`);

            // set domain values for site checks later.
            if (originArray[index - 1] === 'Default Domain') {
                defaultDomainValue = element;
            } else if (originArray[index - 1] === 'Primary Domain') {
                primaryDomainValue = element;
            }
        }

        if (element.match(/Site ID/i)){ //Using Increment to pull adjacent array value.
            resultArray.push(`Site ID: ${originArray[index + 1]} \n`);
        }

        if (element.match(customerNumberRegex)) { //Pull Customer number and remove the #
        resultArray.push(`Customer Number: ${element.substr(1)} \n`); //remove # character
        }
    });
    resultArray.push(`\nSituation: ${situationBox.value}\n`);//alter value to end of each array itteration.

    if (situationBox.value != '' && pasteBox.value != ''){//Confirm that values exist
        resultArray.forEach(function (element){ //Print to the results box. Increment through Result Array.
            resultBox.value = resultBox.value + element;//Iterate each key and value
        });
        resultBox.value = resultBox.value + ('\n');//Adding linebreaks for easy reading.
    }//End of values exist confirmation.

    //display only 3 or all 6 site check options.
    if (situationBox.value != '' && pasteBox.value != ''){//Confirm that values exist
        if (defaultDomainValue == primaryDomainValue && defaultDomainValue != '') {
            
            //If data is present we will allow the slack button to be clicked.
            ToggleSubmitToSlackButton();
            CleanSlackPosting();//To fill slack content box for issue tracker template

            if(defaultDomainValue != ''){//If to prevent strange results after reset.
                //Perform 3 site checks on default only.
                AutoApiChecker(defaultDomainValue + '/__mwp2_check__');
                AutoApiChecker(defaultDomainValue + '/__mwp2_httpd_check__');
                AutoApiChecker(defaultDomainValue + '/__mwp2_php_check__');
            }//Preventing strange results after reset. end
        } else if (defaultDomainValue != '') {
        
            //If data is present we will allow the slack button to be clicked.
            ToggleSubmitToSlackButton();
            CleanSlackPosting();//To fill slack content box for issue tracker template

            if(defaultDomainValue != '' && primaryDomainValue != ''){//If to prevent strange results    after reset.
                //Perform all 6 site checks.
                AutoApiChecker(defaultDomainValue + '/__mwp2_check__');
                AutoApiChecker(defaultDomainValue + '/__mwp2_httpd_check__');
                AutoApiChecker(defaultDomainValue + '/__mwp2_php_check__');
                AutoApiChecker(primaryDomainValue + '/__mwp2_check__');
                AutoApiChecker(primaryDomainValue + '/__mwp2_httpd_check__');
                AutoApiChecker(primaryDomainValue + '/__mwp2_php_check__');
               
                
            }//Preventing strange results after reset. end
        }//Close of else if statment for default domain value
        parseButton.setAttribute('disabled', 'disabled');//Must disable after content checks to prevent spam.
    }//End of if statement to confirm values are properly entered.



});//End of button click event.

//After existing content checks, this function will remove the hidden display tags and apply inline display.
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



//When reset button is clicked we should reset form to empty. 
//Elements to clear:
//PasteBox - ResultBox - situationBox.
//Reset arrays and DefaultDomain and PrimaryDomain variables.
resetButton.addEventListener('click', function() {
    resetFormValues();
});

//Function will take parsed information of Results Box and create into Array split on new lines.
//From there function will filter out only the needed information and inject Slack markup (`)
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
        if (element.match(/Request: [^]+/i)){
            arr[index] = arr[index].replace('Request:','Situation: \`');
            insensitiveSlackArray.push(arr[index] + ' \`\n');
        }
    });

    insensitiveSlackArray.forEach(function(element,index,arr){
        slackTextBox.value = slackTextBox.value += arr[index];
    });
}

function resetFormValues() {
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
    originArray = []; // Global Origin Array will have values set after parse button click.
    resultArray = []; // Result array will contain escalation details. 
    //Empty default and primary domains.
    DEFAULT_DOMAIN_VALUE = '';// Globals so that reset button will clear them.
    PRIMARY_DOMAIN_VALUE = '';// Globals so that reset button will clear them.
    
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

//Function is to be passed complete URL to Site Check locations. 
//Values are passed after Parse Button Click > and values are confirmed to be URLs.
function AutoApiChecker(SiteToCheck) {
    let url = SiteToCheck;
    fetch(url)
    .then(function(response) {
    console.log(response);
    return response.ok;
    
    })
    .then(function(respOK) {
        if(respOK == true){
            console.log("Site Checks Pass");
            resultBox.value = resultBox.value + SiteToCheck + ' Reports: OK \n';
            console.log("Response status: " + respOK);
        } else {
            resultBox.value = resultBox.value + SiteToCheck + ' Reports: FAIL \n';
            console.log("Response status: " + respOK);
        }
    })
    .catch(function(error) {
        console.log('Site Check Failed - Network Error', error);
        resultBox.value = resultBox.value + SiteToCheck + ' Reports: FAIL - Network Err \n';
    });
}


//Function for Slack Submit button. Propagated with demo API URL in this public code.
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


