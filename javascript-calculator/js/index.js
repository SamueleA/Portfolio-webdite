var inputString = "";
var blinkingUnderscore = setInterval(blink, 500);
var update = setInterval(update, 17);
var isUnderScore = true;
var underscore = "_";
var answer = 0;
var errorFound = false;
var inputStringMaxLength = 14;

//symbols
var symbols = document.getElementsByClassName("symbol");
Array.from(symbols).forEach(function(symbol) {
  symbol.addEventListener("click", addSymbol);  
});

var del = document.getElementsByClassName("del")[0].addEventListener("click", deleteSymbol);
var clear = document.getElementsByClassName("clear")[0].addEventListener("click", clearSymbols);
var equal = document.getElementsByClassName("equal")[0].addEventListener("click", equality);

function equality() {
  if (errorFound){
    clearSymbols();
    errorFound = false;
    return;
  }
  if (inputString == "") {
    answer = "0";
    return;
  }
  var stringCopy = inputString;
  answer = 0;
  //error if ending in a symbol
 //error if starts with multiplication or division
  var lastChar = stringCopy.charAt(stringCopy.length-1);
  var endsInSymbol = /[-x÷\+]/.test(lastChar); 
  var firstChar = stringCopy.charAt(0);
  var startsInSymbol = /[x÷]/.test(firstChar);
  if ( startsInSymbol|| endsInSymbol) {
    error("Starts in wrong symbol or ends in wrong symbol");
    return;
  }

  var firstChar = stringCopy.charAt(0);
  var startInSymbol = /[x÷]/.test(firstChar);
  
  //if the input string starts with a symbol, then either the previous answer or 0 (deafult) starts the equation 
  var firstChar = stringCopy.charAt(0);
  var startsInSymbol = /[-x÷\+]/.test(firstChar);
  if (startsInSymbol) {
    stringCopy = answer + stringCopy;
  } 
  //use map to create a new array where numbers are separated from symbols
  //stringCopy = stringCopy.split("");
  var stringGroups = [];
  var startsInNumberPatt = /^([0-9\.])+/;
  var startsInMultDivPatt =  /^[x÷]+/;
  var startsInAddMinusPatt = /^[-\+]+/;
  var startsInPercentagePatt = /^[%]+/;
  while (stringCopy.length != 0) {
    //test if the group is made of numbers
    var startsInNumber = startsInNumberPatt.test(stringCopy);
    //test if the group is made of division or multiplication
    var startsInMultDiv = startsInMultDivPatt.test(stringCopy);
    //test if the group is made of addition or substraction
    var startsInAddMinus = startsInAddMinusPatt.test(stringCopy);
    //test if group starts in /100
    var startsInPercentage = startsInPercentagePatt.test(stringCopy);
    
    if (startsInNumber) {
      stringGroups.push({
        value : startsInNumberPatt.exec(stringCopy)[0],
        type : "number",
        priority: "NA"
      });
      stringCopy = stringCopy.replace(startsInNumberPatt, "");
    } else if (startsInMultDiv) {
        stringGroups.push({
        value : startsInMultDivPatt.exec(stringCopy)[0],
        type : "MultDiv",
        priority: "2"
      });
      stringCopy = stringCopy.replace(startsInMultDivPatt, "");             
    } else if (startsInAddMinus) {
      stringGroups.push({
      value : startsInAddMinusPatt.exec(stringCopy)[0],
      type : "AddMinus",
      priority: "3"
      });
      stringCopy = stringCopy.replace(startsInAddMinusPatt, "");              
    } else if (startsInPercentage) {
      stringGroups.push({
      value : startsInPercentagePatt.exec(stringCopy)[0],
      type : "Percentage",
      priority: "1"
      });      
      stringCopy = stringCopy.replace(startsInPercentagePatt, "");        
    }
    

  }

  //errors to solve
  for( var i=0;i<=stringGroups.length -1;i++) {
     switch (stringGroups[i].type) {
      case "number":   
       var num = stringGroups[i].value;
        num  = num.split("");
        var periods = 0;
        for ( var j=0; j<num.length;j++) {
          if (num[j] == ".")
            periods++;
        }
        if (periods > 1) {
          error("impossible number; too many periods");
          return;
        }
        if (num.length == 1 && num[0] == ".") {
          num.push("0");
        }
         num = num.join("");
        stringGroups[i].value = num;
        break;
      case "MultDiv":
        var signs = stringGroups[i].value;
        if (signs.length > 1) {
          error("impossible combination of multiplication and division signs");
          return;
        }
        break;
      case "AddMinus":
        break;
      case "Percentage": 
        if (stringGroups[0].type == "Percentage") {
          error("percent sign in first position");
          return;
          }
        else if (stringGroups[i -1].type != "number") {
          error("misplaced percentage");
          return;
        } else if(i != stringGroups.length -1) {
          if (stringGroups[i+1].type == "number" ) {
            error("number after percentage");
            return;
          }
        }
        break;
    }
  }
  
  //resolve percentages and multiplications...
  for (var priority = 1; priority <= 3; priority++) {
      for( var i=0;i<=stringGroups.length -1;i++) {
        if (stringGroups[i].priority == priority) {

          if (priority == 1) {
            for( var j = 0; j< stringGroups[i].value.length ; j++) {
              stringGroups[i-1].value = parseFloat(stringGroups[i -1].value);
              stringGroups[i-1].value /= 100;
            }
            //console.log(stringGroups);
            if (stringGroups[i+1] == "number") {
              stringGroups[i].value = "+";
              stringGroups[i].type = "AddMinus";
              stringGroups[i].priority = 3;
            } else {
            stringGroups.splice(i, 1);
            i -=1;
            }
          } else if (priority ==2) {
            //moved all signs to the left
            if( stringGroups[i+1].type == "AddMinus") {
              stringGroups.splice(i-1, 0, stringGroups[i+1])
              i+=1;
              stringGroups.splice(i+1, 1);
            }
            if (stringGroups[i].value=="x") {
              stringGroups[i-1].value = parseFloat(stringGroups[i-1].value) * parseFloat(stringGroups[i+1].value);
            } else {
              if ( parseFloat(stringGroups[i+1].value) == 0) {
                error("Division by zero");
                return;
              }
              else {
                stringGroups[i-1].value = parseFloat(stringGroups[i-1].value / stringGroups[i+1].value);
              }
            }
            stringGroups.splice(i,2);
            i-=1;
          } else if( priority ==3) {
            //combine groups of signs
            for (var j=0; j<stringGroups.length ;j++){
              if (stringGroups[j].type == "AddMinus" && stringGroups[j+1].type == "AddMinus") {
                stringGroups[j].value += stringGroups[j+1].value;
                stringGroups.splice(j+1, 1);
              }
            }

            //simplify addition and substraction all signs
            for (var j=0; j<stringGroups.length;j++){ 
              if (stringGroups[j].type == "AddMinus") {
                var signs = stringGroups[j].value;
                signs = signs.split("");
                signs = signs.filter(sign => sign == "-");
                if (signs.length % 2 == 1) {
                  stringGroups[j].value = "-";
                }
                else {
                  stringGroups[j].value = "+";
                }
              }    
            }
            //do the operation
            for (var j=0; j<stringGroups.length ;j++) {
              if (j==0 && stringGroups[0].type == "AddMinus") {
                stringGroups[0].value = parseFloat( stringGroups[0].value + stringGroups[1].value );
              } else {
                if (stringGroups[i].type == "AddMinus") {
                  if (stringGroups[i].value == "+") {
                    stringGroups[i+1].value = parseFloat(stringGroups[i-1].value) + parseFloat(stringGroups[i+1].value);
                    stringGroups.splice(i-1, 2);
                    i-=1;
                  } else if (stringGroups[i].value == "-") { 
                    stringGroups[i+1].value = parseFloat(stringGroups[i-1].value) - parseFloat(stringGroups[i+1].value);
                    stringGroups.splice(i-1, 2);
                    i-=1;
                  }
                }
              }
            }
         }  
       }
     }
  }
  answer = stringGroups[0].value;
  answer = answer.toString();
  /*if (/e\+/.test(answer)) {
    if (/^-/.test(answer))
      answer = parseFloat(answer).toPrecision(6);
    else
      answer = parseFloat(answer).toPrecision(7);
  } else*/ if (/e-/.test(answer) ){
    if (/^-/.test(answer))
      answer = parseFloat(answer).toPrecision(6);
    else
      answer = parseFloat(answer).toPrecision(7);
  } else if (answer.length > 11)  {
    var precision = 11;
    console.log(precision);
    if (/\./.test(answer)) {
      precision -= 1;
      if ( /.0+/.test(answer)) {
        var zerosAfterDot = /.0+/.exec(answer)[0].length -1
        precision -= zerosAfterDot;
      }
    }
    else {
      precision =7;
      }
    if ( /-/.test(answer))
      precision -= 1;
    answer = parseFloat(answer).toPrecision(precision);
  }
  
  
}  

function error(errorMsg) {
  errorFound = true;
  inputString = "ERROR";
  answer = "0";  
  console.log(errorMsg);
}

function deleteSymbol() {
  if (inputString.length > 0) {
    //keep underscore from blinking when pressed
    blinkReset();
  }
  if (!errorFound) {
    inputString = inputString.slice(0, inputString.length -1);
  } else {
    clearSymbols();
    errorFound = false;
  }
}

function clearSymbols() {
  if (inputString.length > 0) {
    //keep underscore from blinking when pressed
    blinkReset();
  }
  inputString = "";
  answer = "0";
  errorFound = false;
}

function update() {
  document.getElementById("inputText").innerHTML = inputString + underscore; 
  document.getElementById("answerText").innerHTML = answer;
}

function blink () {
  if (isUnderScore == true) {
    underscore = ""; 
    isUnderScore = false;
  } else{
    underscore = "_";
    isUnderScore = true;
  }
  if (errorFound) {
    underscore = "";
    isUnderScore = false;
  }
}

function blinkReset() {
  clearTimeout(blinkingUnderscore);
  blinkingUnderscore = setInterval(blink, 500);
  underscore = "_";
  isUnderScore = true;
}

function addSymbol() {
  if (!(inputString.length >= inputStringMaxLength)) {
    //keep underscore from blinking when pressed
    blinkReset();
  }
  if (errorFound ) {
    clearSymbols();
    errorFound = false;
  }
  if (inputString.length <= inputStringMaxLength - 1) {
    inputString += this.getAttribute("data-symbol");    
  }
}