//Variables Declared first to minimize DOM calls. 
var PASTE_BOX = document.getElementById('pasteBox');
var RESULT_BOX = document.getElementById('resultBox');
var PARSE_BUTTON = document.getElementById('parseButton')

var PASTE_BOX_VALUE = PASTE_BOX.innerHTML;


//All functionality tied to button click event at this time.
PARSE_BUTTON.addEventListener("click", function(){
    
    //Splitting long string into array by first splitting new lines. 
    let ORIGIN_ARRAY = PASTE_BOX_VALUE.split("\n");
    RESULT_ARRAY = []; // Result array will contain escalation details. 
    RESULT_ARRAY.push('#### MWP 2.0 Assistance Request ####'); //Start of template

    for(var x in ORIGIN_ARRAY){//First remove all white spaces and set results to ORIGIN_ARRAY.
        let WhiteSpaceRemover = ORIGIN_ARRAY[x].replace(/^\s+/i, '');
       // let SuperflousTextRemover = ORIGIN_ARRAY[x].replace(/overviewdiagnosticsTools/i, '');
       // let SuperflousTextRemover2 = ORIGIN_ARRAY[x].replace(/ACCOUNT/, '');
        ORIGIN_ARRAY[x] = WhiteSpaceRemover;
    }

    for(var x in ORIGIN_ARRAY){//Now that we have a clean array without whitespace we can pull out content.
        if (ORIGIN_ARRAY[x].match(/^https:\/\/[^/]+/i) != null){ //Urls Matching.
            //console.log('Mattched https://');
            //console.log('What was matched is : ' + ORIGIN_ARRAY[x] );
            //console.log('The current array value we are pushing to is : ');
            //console.log(RESULT_ARRAY);
            RESULT_ARRAY.push(ORIGIN_ARRAY[x]);
        }

        if (ORIGIN_ARRAY[x].match(/Site ID/i) != null){ //Using Increment to pull adjacent array value.
            let INDEX = x;
            INDEX++;
            RESULT_ARRAY.push(ORIGIN_ARRAY[INDEX]);
        }

        if (ORIGIN_ARRAY[x].match(/^\#(\d+)/) != null) {
            let CUSTOMER_NUM = ORIGIN_ARRAY[x];
            RESULT_ARRAY.push("Customer Number: " + CUSTOMER_NUM.substr(1));

        }
    }
    
    for(var x in RESULT_ARRAY) { //Print to the results box. Increment through Result Array.
        console.log(RESULT_ARRAY[x]);
        RESULT_BOX.append(RESULT_ARRAY[x]);
        RESULT_BOX.append('\n');
    }

});