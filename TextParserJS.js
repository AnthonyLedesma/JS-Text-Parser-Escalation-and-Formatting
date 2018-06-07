//Variables Declared first to minimize DOM calls. 
var PASTE_BOX = document.getElementById('pasteBox');
var RESULT_BOX = document.getElementById('resultBox');
var PARSE_BUTTON = document.getElementById('parseButton');
var REQUEST_BOX = document.getElementById('requestBox');

var DEFAULT_OR_PRIMARY = 0; //Index 0 is default domian, Index 1 is Primary Domain. Top level for scope.

let DEFAULT_MWP2_CHECK = document.getElementById('DefaultMWP2Check');
let DEFAULT_HTTPD_CHECK = document.getElementById('DefaultHTTPDCheck');
let DEFAULT_PHP_CHECK = document.getElementById('DefaultPHPCheck');
    
let PRIMARY_MWP2_CHECK = document.getElementById('PrimaryMWP2Check');
let PRIMARY_HTTPD_CHECK = document.getElementById('PrimaryHTTPDCheck');
let PRIMARY_PHP_CHECK = document.getElementById('PrimaryPHPCheck');

//All functionality tied to button click event at this time.
PARSE_BUTTON.addEventListener("click", function(){
    
    //Splitting long string into array by first splitting new lines. 
    let ORIGIN_ARRAY = PASTE_BOX.value.split("\n");
    let RESULT_ARRAY = []; // Result array will contain escalation details. 
    
    RESULT_ARRAY.push('#### MWP 2.0 Assistance Request ####'); //Start of template

    for(let x in ORIGIN_ARRAY){//First remove all white spaces and set results to ORIGIN_ARRAY.
        let WHITE_SPACE_REMOVER = ORIGIN_ARRAY[x].replace(/^\s+/i, '');
        ORIGIN_ARRAY[x] = WHITE_SPACE_REMOVER;
    }

    for(let x in ORIGIN_ARRAY){//Now that we have a clean array without whitespace we can pull out content.
        if (ORIGIN_ARRAY[x].match(/^https:\/\/[^/]+/i) != null){ //Urls Matching.
            //console.log('Mattched https://');
            //console.log('What was matched is : ' + ORIGIN_ARRAY[x] );
            //console.log('The current array value we are pushing to is : ');
            //console.log(RESULT_ARRAY);

            //The following will alternate default and primary domain names respectively.
            DEFAULT_OR_PRIMARY == 0 ? RESULT_ARRAY.push("Default Domain: " + ORIGIN_ARRAY[x]) : RESULT_ARRAY.push("Primary Domain: " + ORIGIN_ARRAY[x]);
            //The following will allow for proper recursion on a paste including several website domains. 
            DEFAULT_OR_PRIMARY == 0 ? DEFAULT_DOMAIN_VALUE = ORIGIN_ARRAY[x] : PRIMARY_DOMAIN_VALUE = ORIGIN_ARRAY[x];
            DEFAULT_OR_PRIMARY == 0 ? DEFAULT_OR_PRIMARY = 1 : DEFAULT_OR_PRIMARY = 0;
        }

        if (ORIGIN_ARRAY[x].match(/Site ID/i) != null){ //Using Increment to pull adjacent array value.
            let INDEX = x;
            INDEX++;
            RESULT_ARRAY.push("Site ID: " + ORIGIN_ARRAY[INDEX]);
        }

        if (ORIGIN_ARRAY[x].match(/^\#(\d+)/) != null) { //Pull Customer number and remove the #
            let CUSTOMER_NUM = ORIGIN_ARRAY[x];
            RESULT_ARRAY.push("Customer Number: " + CUSTOMER_NUM.substr(1)); //remove # character

        }
    }
    RESULT_ARRAY.push("Request: " + REQUEST_BOX.innerHTML);//Append request to end of each array itteration.
    DEFAULT_OR_PRIMARY = 0; //Reset to 0 for next toolkit paste.
    for(let x in RESULT_ARRAY) { //Print to the results box. Increment through Result Array.
        console.log(RESULT_ARRAY[x]);//Log for review.
        RESULT_BOX.append(RESULT_ARRAY[x]);//Iterate each key and value
        RESULT_BOX.append('\n');//Adding linebreaks for easy reading.
    }
    RESULT_BOX.append('\n');//Adding linebreaks for easy reading.
    if (DEFAULT_DOMAIN_VALUE == PRIMARY_DOMAIN_VALUE) {
        document.getElementById('DefaultDomainSiteChecks').removeAttribute("style")
        document.getElementById('DefaultDomainSiteChecks').setAttribute('style', 'display: inline;');
    } else {
        document.getElementById('DefaultDomainSiteChecks').removeAttribute("style")
        document.getElementById('PrimaryDomainSiteChecks').removeAttribute("style")
        document.getElementById('DefaultDomainSiteChecks').setAttribute('style', 'display: inline;');
        document.getElementById('PrimaryDomainSiteChecks').setAttribute('style', 'display: inline;');
    }

//The following are all event listeners looking for box checks. When checked it will append to the parsing form. 
//Would like to make checkbox generation dynamic based on domain names.
//Also seems reasonable to capture end of template locations per site so that we can ->
//inject check passes directly into template. 
//Finally I should consider a single event listener for all checkboxes.
    DEFAULT_MWP2_CHECK.addEventListener( 'change', function() {
        if(this.checked) {
            RESULT_BOX.append(DEFAULT_DOMAIN_VALUE + ' MWP2 Site Check Passed' + '\n');
            DEFAULT_MWP2_CHECK.setAttribute('disabled', 'disabled');
    
        }
    });
    
    DEFAULT_HTTPD_CHECK.addEventListener( 'change', function() {
        if(this.checked) {
            RESULT_BOX.append(DEFAULT_DOMAIN_VALUE + ' HTTPD Site Check Passed' + '\n');
            DEFAULT_HTTPD_CHECK.setAttribute('disabled', 'disabled');
    
        }
    });
    
    DEFAULT_PHP_CHECK.addEventListener( 'change', function() {
        if(this.checked) {
            RESULT_BOX.append(DEFAULT_DOMAIN_VALUE + ' PHP Site Check Passed' + '\n');
            DEFAULT_PHP_CHECK.setAttribute('disabled', 'disabled');
    
        }
    });
    
    PRIMARY_MWP2_CHECK.addEventListener( 'change', function() {
        if(this.checked) {
            RESULT_BOX.append(PRIMARY_DOMAIN_VALUE + ' MWP2 Site Check Passed' + '\n');
            PRIMARY_MWP2_CHECK.setAttribute('disabled', 'disabled');
    
        }
    });
    
    PRIMARY_HTTPD_CHECK.addEventListener( 'change', function() {
        if(this.checked) {
            RESULT_BOX.append(PRIMARY_DOMAIN_VALUE + ' HTTPD Site Check Passed' + '\n');
            PRIMARY_HTTPD_CHECK.setAttribute('disabled', 'disabled');
    
        }
    });
    
    PRIMARY_PHP_CHECK.addEventListener( 'change', function() {
        if(this.checked) {
            RESULT_BOX.append(PRIMARY_DOMAIN_VALUE + ' PHP Site Check Passed' + '\n');
            PRIMARY_PHP_CHECK.setAttribute('disabled', 'disabled');
    
        }
    });

});


//Contant Template For Reference 
//#### MWP 2.0 Assistance Request ####

//Customer Number:

//siteID:

//Default Domain:

//Primary Domain:

//Request: