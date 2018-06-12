//Variables Declared first to minimize DOM calls. 
let PASTE_BOX = document.getElementById('pasteBox');
let RESULT_BOX = document.getElementById('resultBox');
let PARSE_BUTTON = document.getElementById('parseButton');
let RESET_BUTTON = document.getElementById('resetButton');
let REQUEST_BOX = document.getElementById('requestBox');
let LINK_BOX = document.getElementById('linkBox');

//Variables to enable slack issue tracker.
let SUBMIT_SLACK_BUTTON = document.getElementById('SubmitSlack');
let SLACK_P_TAG = document.getElementById('slackPTag');
let SLACK_BOX = document.getElementById('slackBox');

let DEFAULT_OR_PRIMARY = 0; //Index 0 is default domian, Index 1 is Primary Domain. Top level for scope.
let DEFAULT_DOMAIN_VALUE = '';// Globals so that reset button will clear them.
let PRIMARY_DOMAIN_VALUE = '';// Globals so that reset button will clear them.

//These variables call the by-default hidden rows for site check confirmation
let DEFAULT_DOMAIN_HIDDEN_ROW = document.getElementById('DefaultDomainSiteChecks');
let PRIMARY_DOMAIN_HIDDEN_ROW = document.getElementById('PrimaryDomainSiteChecks');

//All tied to generation of Site Check links for manual testing. Default First. 
let DEFAULT_MWP2_CHECK = document.getElementById('DefaultMWP2Check');
let DEFAULT_HTTPD_CHECK = document.getElementById('DefaultHTTPDCheck');
let DEFAULT_PHP_CHECK = document.getElementById('DefaultPHPCheck');
//Primary Domain Site Checks.
let PRIMARY_MWP2_CHECK = document.getElementById('PrimaryMWP2Check');
let PRIMARY_HTTPD_CHECK = document.getElementById('PrimaryHTTPDCheck');
let PRIMARY_PHP_CHECK = document.getElementById('PrimaryPHPCheck');

//Declaring Varaibles to hold Links DOM elements. 1 = default domain & 2 = primary domain.
let MWP1_CHECK = document.getElementById('MWP1');
let HTTPD1_CHECK = document.getElementById('HTTPD1');
let PHP1_CHECK = document.getElementById('PHP1');
//primary domain now
let MWP2_CHECK = document.getElementById('MWP2');
let HTTPD2_CHECK = document.getElementById('HTTPD2');
let PHP2_CHECK = document.getElementById('PHP2');

let ORIGIN_ARRAY = []; // Global Origin Array will have values set after parse button click.
let RESULT_ARRAY = []; // Result array will contain escalation details. 
let INSENSITIVE_SLACK_ARRAY = []; //Slack escalation array - ready to push
let SENSITIVE_SLACK_ARRAY = []; //Escalation array which still contains sensitive infomration. 

//Defining API test call button.
let TEST_API_BUTTON = document.getElementById('TestAPI');

//3 top level event listeners [ParseButton, ResetButton, Checkbox Listeners]
//Parse button click events.
PARSE_BUTTON.addEventListener("click", function(){
    ORIGIN_ARRAY = []; // Clearing for recursive of more domains.
    //Splitting long string into array by first splitting new lines. 
    ORIGIN_ARRAY = PASTE_BOX.value.split("\n");
    RESULT_ARRAY = []; // Result array will contain escalation details. 
    console.log(RESULT_ARRAY);
    RESULT_ARRAY.push('#### MWP 2.0 Assistance Request ####\n'); //Start of template

    for(let x in ORIGIN_ARRAY){//First remove all white spaces and set results to ORIGIN_ARRAY.
        let WHITE_SPACE_REMOVER = ORIGIN_ARRAY[x].replace(/^\s+/i, '');
        ORIGIN_ARRAY[x] = WHITE_SPACE_REMOVER; //Setting origin array to match sanitized content
    }

    for(let x in ORIGIN_ARRAY){//Now that we have a clean array without whitespace we can pull out content.
        if (ORIGIN_ARRAY[x].match(/^https:\/\/[^/]+/i) != null){ //Urls Matching

            //The following will alternate default and primary domain names respectively.
            DEFAULT_OR_PRIMARY == 0 ? RESULT_ARRAY.push("Default Domain: " + ORIGIN_ARRAY[x] + '\n') : RESULT_ARRAY.push("Primary Domain: " + ORIGIN_ARRAY[x] + '\n');

            //The following will allow for proper recursion on a paste including several website domains. 
            DEFAULT_OR_PRIMARY == 0 ? DEFAULT_DOMAIN_VALUE = ORIGIN_ARRAY[x] : PRIMARY_DOMAIN_VALUE = ORIGIN_ARRAY[x]; //Setting the values of domain for use with site checks.
            DEFAULT_OR_PRIMARY == 0 ? DEFAULT_OR_PRIMARY = 1 : DEFAULT_OR_PRIMARY = 0;
        }

        if (ORIGIN_ARRAY[x].match(/Site ID/i) != null){ //Using Increment to pull adjacent array value.
            let INDEX = x;// Not able to increment x within for look so setting temporary index.
            INDEX++;
            RESULT_ARRAY.push("Site ID: " + ORIGIN_ARRAY[INDEX] + '\n');
        }

        if (ORIGIN_ARRAY[x].match(/^\#(\d+)/) != null) { //Pull Customer number and remove the #
            let CUSTOMER_NUM = ORIGIN_ARRAY[x];
            RESULT_ARRAY.push("Customer Number: " + CUSTOMER_NUM.substr(1) + '\n'); //remove # character

        }
    }
    //RESULT_ARRAY.push("\n");//
    RESULT_ARRAY.push("\nRequest: " + REQUEST_BOX.value + '\n');//alter value to end of each array itteration.
    DEFAULT_OR_PRIMARY = 0; //Reset to 0 for next toolkit paste.
    if (REQUEST_BOX.value != '' && PASTE_BOX.value != ''){//Confirm that values exist
        for(let x in RESULT_ARRAY) { //Print to the results box. Increment through Result Array.
            RESULT_BOX.value = RESULT_BOX.value + RESULT_ARRAY[x];//Iterate each key and value
            //RESULT_BOX.append('\n');//Adding linebreaks for easy reading.
        }
        RESULT_BOX.value = RESULT_BOX.value + ('\n');//Adding linebreaks for easy reading.
    }//End of values exist confirmation.
   
    //display only 3 or all 6 site check options.
    if (REQUEST_BOX.value != '' && PASTE_BOX.value != ''){//Confirm that values exist
        if (DEFAULT_DOMAIN_VALUE == PRIMARY_DOMAIN_VALUE && DEFAULT_DOMAIN_VALUE != '') {
            //The next 2 lines are to display hidden row for default domain site checks
            DEFAULT_DOMAIN_HIDDEN_ROW.removeAttribute("style")
            DEFAULT_DOMAIN_HIDDEN_ROW.setAttribute('style', 'display: inline;');

            //If data is present we will allow the slack button to be clicked.
            ToggleSubmitToSlackButton();
            CleanSlackPosting();//To fill slack content box for issue tracker template

            if(DEFAULT_DOMAIN_VALUE != ''){//If to prevent strange results after reset.
                //Creating only 3 links for site checks
                //MWP1 Pod Check
                MWP1_CHECK.setAttribute('href', DEFAULT_DOMAIN_VALUE + '/__mwp2_check__');
                MWP1_CHECK.text = MWP1_CHECK.href;
                //HTTPD1 Pod Check
                HTTPD1_CHECK.setAttribute('href', DEFAULT_DOMAIN_VALUE + '/__mwp2_httpd_check__');
                HTTPD1_CHECK.text = HTTPD1_CHECK.href;
                //PHP1 Pod Check
                PHP1_CHECK.setAttribute('href', DEFAULT_DOMAIN_VALUE + '/__mwp2_php_check__');
                PHP1_CHECK.text = PHP1_CHECK.href;
            }//Preventing strange results after reset. end
        } else if (DEFAULT_DOMAIN_VALUE != '') {
            //Next 4 lines are displaying the hidden rows for site check confirmation.
            DEFAULT_DOMAIN_HIDDEN_ROW.removeAttribute("style")
            PRIMARY_DOMAIN_HIDDEN_ROW.removeAttribute("style")
            DEFAULT_DOMAIN_HIDDEN_ROW.setAttribute('style', 'display: inline;');
            PRIMARY_DOMAIN_HIDDEN_ROW.setAttribute('style', 'display: inline;');

            //If data is present we will allow the slack button to be clicked.
            ToggleSubmitToSlackButton();
            CleanSlackPosting();//To fill slack content box for issue tracker template

            if(DEFAULT_DOMAIN_VALUE != '' && PRIMARY_DOMAIN_VALUE != ''){//If to prevent strange results    after reset.
                //Creating all 6 links for site Checks
                //MWP1 Pod Check
                MWP1_CHECK.setAttribute('href', DEFAULT_DOMAIN_VALUE + '/__mwp2_check__');
                MWP1_CHECK.text = MWP1_CHECK.href;
                //HTTPD1 Pod Check
                HTTPD1_CHECK.setAttribute('href', DEFAULT_DOMAIN_VALUE + '/__mwp2_httpd_check__');
                HTTPD1_CHECK.text = HTTPD1_CHECK.href;
                //PHP1 Pod Check
                PHP1_CHECK.setAttribute('href', DEFAULT_DOMAIN_VALUE + '/__mwp2_php_check__');
                PHP1_CHECK.text = PHP1_CHECK.href;
                //MWP2 Pod Check
                MWP2_CHECK.setAttribute('href', PRIMARY_DOMAIN_VALUE + '/__mwp2_check__');
                MWP2_CHECK.text = MWP2_CHECK.href;
                //HTTPD2 Pod Check
                HTTPD2_CHECK.setAttribute('href', PRIMARY_DOMAIN_VALUE + '/__mwp2_httpd_check__');
                HTTPD2_CHECK.text = HTTPD2_CHECK.href;
                //PHP2 Pod Check
                PHP2_CHECK.setAttribute('href', PRIMARY_DOMAIN_VALUE + '/__mwp2_php_check__');
                PHP2_CHECK.text = PHP2_CHECK.href;
            }//Preventing strange results after reset. end
        }//Close of else if statment.
    }//End of if statement to confirm values.
    PARSE_BUTTON.setAttribute('disabled', 'disabled');
});

//After existing content checks, this function will remove the hidden display tags and apply inline display.
function ToggleSubmitToSlackButton(){
    //Button Toggle
    SUBMIT_SLACK_BUTTON.removeAttribute("style");
    SUBMIT_SLACK_BUTTON.setAttribute("style", "display: inline;");
    //p tag toggle
    SLACK_P_TAG.removeAttribute("style");
    SLACK_P_TAG.setAttribute("style", "display: inline;");
    //result box toggle
    SLACK_BOX.removeAttribute("style");
    SLACK_BOX.setAttribute("style", "display: inline;");
}

//The following are all event listeners looking for box checks. When checked it will append to the parsing form. 
//Would like to make checkbox generation dynamic based on domain names.
//Also seems reasonable to capture end of template locations per site so that we can ->
//inject check passes directly into template at desired location. 
//Finally I should consider a single event listener for all checkboxes.
DEFAULT_MWP2_CHECK.addEventListener( 'change', function() {
    if(this.checked) {
        RESULT_BOX.value = RESULT_BOX.value + '\n' + DEFAULT_DOMAIN_VALUE + ' MWP2 Site Check Passed' + '\n';
        DEFAULT_MWP2_CHECK.setAttribute('disabled', 'disabled');

    }
}); //Redundant event listeners are redundant. 

DEFAULT_HTTPD_CHECK.addEventListener( 'change', function() {
    if(this.checked) {
        RESULT_BOX.value = RESULT_BOX.value + '\n' + DEFAULT_DOMAIN_VALUE + ' HTTPD Site Check Passed' + '\n';
        DEFAULT_HTTPD_CHECK.setAttribute('disabled', 'disabled');

    }
});

DEFAULT_PHP_CHECK.addEventListener( 'change', function() {
    if(this.checked) {
        RESULT_BOX.value = RESULT_BOX.value + '\n' + DEFAULT_DOMAIN_VALUE + ' PHP Site Check Passed' + '\n';
        DEFAULT_PHP_CHECK.setAttribute('disabled', 'disabled');

    }
});

PRIMARY_MWP2_CHECK.addEventListener( 'change', function() {
    if(this.checked) {
        RESULT_BOX.value = RESULT_BOX.value + '\n' + PRIMARY_DOMAIN_VALUE + ' MWP2 Site Check Passed' + '\n';
        PRIMARY_MWP2_CHECK.setAttribute('disabled', 'disabled');

    }
});

PRIMARY_HTTPD_CHECK.addEventListener( 'change', function() {
    if(this.checked) {
        RESULT_BOX.value = RESULT_BOX.value + '\n' + PRIMARY_DOMAIN_VALUE + ' HTTPD Site Check Passed' + '\n';
        PRIMARY_HTTPD_CHECK.setAttribute('disabled', 'disabled');

    }
});

PRIMARY_PHP_CHECK.addEventListener( 'change', function() {
    if(this.checked) {
        RESULT_BOX.value = RESULT_BOX.value + '\n' + PRIMARY_DOMAIN_VALUE + ' PHP Site Check Passed' + '\n';
        PRIMARY_PHP_CHECK.setAttribute('disabled', 'disabled');
    }
});

//When reset button is clicked we should reset form to empty. Final event listener in file
//Elements to clear:
//PasteBox - ResultBox - RequestBox - Link text and href - Checkbox hide and enable.
//Reset arrays and DefaultDomain and PrimaryDomain variables.
RESET_BUTTON.addEventListener('click', function() {
    //PasteBox
    PASTE_BOX.innerText = '';
    PASTE_BOX.textContent = '';
    PASTE_BOX.value = '';
    //Results Box
    RESULT_BOX.value = '';
    //Request Box
    REQUEST_BOX.innerText = '';
    REQUEST_BOX.textContent = '';
    REQUEST_BOX.value = '';
    //Link text and href
    MWP1_CHECK.removeAttribute('href');MWP1_CHECK.text = '';
    MWP2_CHECK.removeAttribute('href');MWP2_CHECK.text = '';
    HTTPD1_CHECK.removeAttribute('href');HTTPD1_CHECK.text = '';
    HTTPD2_CHECK.removeAttribute('href');HTTPD2_CHECK.text = '';
    PHP1_CHECK.removeAttribute('href');PHP1_CHECK.text = '';
    PHP2_CHECK.removeAttribute('href');PHP2_CHECK.text = '';
    //Redeclare empty parsing arrays
    ORIGIN_ARRAY = []; // Global Origin Array will have values set after parse button click.
    RESULT_ARRAY = []; // Result array will contain escalation details. 
    //Empty default and primary domains.
    DEFAULT_DOMAIN_VALUE = '';// Globals so that reset button will clear them.
    PRIMARY_DOMAIN_VALUE = '';// Globals so that reset button will clear them.
    //Checkbox Hide and Enable
    DEFAULT_DOMAIN_HIDDEN_ROW.removeAttribute("style")//Remove inline styles
    PRIMARY_DOMAIN_HIDDEN_ROW.removeAttribute("style")
    DEFAULT_DOMAIN_HIDDEN_ROW.setAttribute('style', 'display: none;');
    PRIMARY_DOMAIN_HIDDEN_ROW.setAttribute('style', 'display: none;');// RE-hiding the rows for proper reset.
    //Now we reset checkbox disabled status
    DEFAULT_MWP2_CHECK.removeAttribute('disabled');DEFAULT_MWP2_CHECK.checked = false;
    DEFAULT_HTTPD_CHECK.removeAttribute('disabled');DEFAULT_HTTPD_CHECK.checked = false;
    DEFAULT_PHP_CHECK.removeAttribute('disabled');DEFAULT_PHP_CHECK.checked = false;
    //Primary Domain Site Checks.
    PRIMARY_MWP2_CHECK.removeAttribute('disabled');PRIMARY_MWP2_CHECK.checked = false;
    PRIMARY_HTTPD_CHECK.removeAttribute('disabled');PRIMARY_HTTPD_CHECK.checked = false;
    PRIMARY_PHP_CHECK.removeAttribute('disabled');PRIMARY_PHP_CHECK.checked = false;
    //Hiding the Submit Slack Button
    SUBMIT_SLACK_BUTTON.removeAttribute("style");
    SUBMIT_SLACK_BUTTON.setAttribute("style", "display: none;");
    //p tag toggle
    SLACK_P_TAG.removeAttribute("style");
    SLACK_P_TAG.setAttribute("style", "display: none;");
    //result box toggle
    SLACK_BOX.removeAttribute("style");
    SLACK_BOX.setAttribute("style", "display: none;");
    SLACK_BOX.value = '';
    //Reset Slack arrays
    INSENSITIVE_SLACK_ARRAY = [];
    SENSITIVE_SLACK_ARRAY = [];
    //Finally re-enable parse button.
    PARSE_BUTTON.removeAttribute('disabled');
});

//Function will take parsed information of Results Box and create into Array split on new lines.
//From there function will filter out only the needed information and inject Slack markup (`)
function CleanSlackPosting(){
    INSENSITIVE_SLACK_ARRAY = [];
    SENSITIVE_SLACK_ARRAY = RESULT_BOX.value.split("\n");
    INSENSITIVE_SLACK_ARRAY.push("#### MWP 2.0 Issue Tracker ####\n");
    
    for(let x in SENSITIVE_SLACK_ARRAY){//Now that we have a clean array without whitespace we can pull out content.
        if (SENSITIVE_SLACK_ARRAY[x].match(/Site ID: [^/]+/i) != null){ //Pull the SiteID
            let y = SENSITIVE_SLACK_ARRAY[x];
            y = y.replace(':',': \`');
            INSENSITIVE_SLACK_ARRAY.push(y + ' `\n') 
        }
        if (SENSITIVE_SLACK_ARRAY[x].match(/Default Domain: [^]+/i) != null){ //Pull Default Domain
            let y = SENSITIVE_SLACK_ARRAY[x];
            y = y.replace(':',': \`');
            INSENSITIVE_SLACK_ARRAY.push(y + ' `\n');
        }
        if (SENSITIVE_SLACK_ARRAY[x].match(/Primary Domain: [^]+/) != null) { //Pull Primary Domain
            let y = SENSITIVE_SLACK_ARRAY[x];
            y = y.replace(':',': \`');
            INSENSITIVE_SLACK_ARRAY.push(y + ' `\n'); 
        }
        if (SENSITIVE_SLACK_ARRAY[x].match(/Request: [^]+/) != null) { //Pull the request
            let y = SENSITIVE_SLACK_ARRAY[x];
            y = y.replace('Request:','Situation: \`');
            INSENSITIVE_SLACK_ARRAY.push(y + ' `\n'); 
        }
    }
    for(let x in INSENSITIVE_SLACK_ARRAY){
        SLACK_BOX.value = SLACK_BOX.value += INSENSITIVE_SLACK_ARRAY[x];
    }
}

SUBMIT_SLACK_BUTTON.addEventListener( "click", function() {
    let url = "HTTPS://ThisIsAPlaceHolderURL.coms";
    let text = SLACK_BOX.value;
    $.ajax({data: 'payload=' + JSON.stringify({
        "text": text
    }),
    dataType: 'json',
    processData: false,
    type: 'POST',
    url: url
    });  
    SUBMIT_SLACK_BUTTON.setAttribute('disabled', 'disabled');
});  


// TEST_API_BUTTON.addEventListener('click', function() {
//     console.log('Test API Button Click');
//     let url = "HTTPS://ThisIsAPlaceHolderURL.coms";
//     let text = 'test text';
//     $.ajax({data: 'payload=' + JSON.stringify({
//         "text": text
//     }),
//     dataType: 'json',
//     processData: false,
//     type: 'POST',
//     url: url
//     }); 
// });