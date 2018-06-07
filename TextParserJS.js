//Variables Declared first to minimize DOM calls. 
var PASTE_BOX = document.getElementById('pasteBox');
var RESULT_BOX = document.getElementById('resultBox');
var PARSE_BUTTON = document.getElementById('parseButton');
var REQUEST_BOX = document.getElementById('requestBox');
var LINK_BOX = document.getElementById('linkBox');

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

    //Declaring Varaibles to hold Links DOM elements. 1 = default domain & 2 = primary domain.
    let MWP1_CHECK = document.getElementById('MWP1');
    let HTTPD1_CHECK = document.getElementById('HTTPD1');
    let PHP1_CHECK = document.getElementById('PHP1');
    //primary domain now
    let MWP2_CHECK = document.getElementById('MWP2');
    let HTTPD2_CHECK = document.getElementById('HTTPD2');
    let PHP2_CHECK = document.getElementById('PHP2');
    //display only 3 or all 6 site check options.
    if (DEFAULT_DOMAIN_VALUE == PRIMARY_DOMAIN_VALUE) {
        document.getElementById('DefaultDomainSiteChecks').removeAttribute("style")
        document.getElementById('DefaultDomainSiteChecks').setAttribute('style', 'display: inline;');

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
    } else {
        document.getElementById('DefaultDomainSiteChecks').removeAttribute("style")
        document.getElementById('PrimaryDomainSiteChecks').removeAttribute("style")
        document.getElementById('DefaultDomainSiteChecks').setAttribute('style', 'display: inline;');
        document.getElementById('PrimaryDomainSiteChecks').setAttribute('style', 'display: inline;');

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
