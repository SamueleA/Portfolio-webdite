/*to do
-make icon go next to the text
-make button go to the right
-add a font
-add hover text*/

window.onload = function () {
  var http  = new XMLHttpRequest();
  retrieveQuote();
  
var response = null;
http.onreadystatechange = function() {
  
  if (http.status >=200 && http.status < 400 && http.readyState === 4) {
    response = JSON.parse(http.responseText);
    document.getElementById("quote").innerHTML = response.quoteText;
    document.getElementById("quote-author").innerHTML = "-" + response.quoteAuthor;
    randomizeColor();
  }
    
  else
    console.log("not received or error");
  
};

function retrieveQuote (){
  
  http.open("GET", "https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en", true); 
  http.send();
}
  
document.getElementById("newQuote").onclick = function () {
  retrieveQuote();
};

document.getElementById("twitter").onclick = function(){
  var baseUrl = "https://twitter.com/intent/tweet?text=";
   
  var text = '"'+ document.getElementById("quote").innerHTML +'"'+ " " +document.getElementById("quote-author").innerHTML + " #quote";
 
  var fullUrl = baseUrl + encodeURIComponent(text);
  window.open(fullUrl);
    
};
  
function randomizeColor () {
  var colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"];
  var color = colors [Math.floor(Math.random()*colors.length)];
  document.body.style.background = color;
  var buttons = document.getElementsByTagName("button");  
  buttons[0].style.background = color;
  buttons[1].style.background = color;
  document.getElementById("quote").style.color = color;
  document.getElementById("quote-author").style.color = color;
  document.getElementsByClassName("fa-quote-left")[0].style.color = color;
}  

  
  
};