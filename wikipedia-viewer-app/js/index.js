window.onload = function() {

  var searchItem = "";
  var http = new XMLHttpRequest();
  
  document.getElementById("search-button").onclick = doSearch;
  
  function doSearch(){ 
    searchItem = document.getElementById("search").value;
    
    var URL = "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&titles=Main+Page&srsearch=" + transformSearch(searchItem, "+");
    http.open("GET", URL, true);
    http.setRequestHeader("Api-User-Agent", "WikiViewer/1.0");
    http.send();
  
  }
 
  var response= null;
  http.onload = function () { 
      console.log(http.readyState, http.status);
      
      if (http.status >= 200 && http.status < 400 && http.readyState === 4)  {
        response = JSON.parse(http.responseText);
        showData (response);
      }
        else 
          console.log("no response yet or error");
    }
  
  function showData(response){
    var result = response.query.search;
    if (result.length == 0) {
      document.getElementById("data").innerHTML = "Nothing found!!";
    }
    else {
      document.getElementById("data").classList.remove("animate-bottom");
      document.getElementById("data").innerHTML = "";
      for(var i = 0; i<result.length; i++) {
        produceCard(result[i].title, result[i].snippet);
      } 
      //restarting the animation
      var element = document.getElementById("data");
      element.classList.remove("animate-bottom");
      void element.offsetWidth;
      element.classList.add("animate-bottom");
      
    }
    
    
    
  }

  function produceCard(title, snippet) {
    var card = document.createElement("a");
    card.setAttribute("class", "card");
    card.setAttribute("href", wikiLink(title));
    card.setAttribute("target", "_blank");
    
    var cardTitle = document.createElement("p");
    //var t = document.createTextNode(title);
    //cardTitle.appendChild(t);
    cardTitle.innerHTML = title;
    cardTitle.setAttribute("class", "cardTitle");
    
    var cardText = document.createElement("p");
    //var t  = document.createTextNode(snippet);
    //cardText.appendChild(t);
    cardText.innerHTML = snippet+"...";
    cardText.setAttribute("class", "cardText");
    
    card.appendChild(cardTitle);
    card.appendChild(cardText);
    document.getElementById("data").appendChild(card);
    
    //remove the footer
    document.getElementsByTagName("footer")[0].style.display = "none";

  }
  

  //+ symbol for space when search http requests, _when constructing a link 

  function transformSearch (item, symbolForSpace) {
    item = item.replace(/\s+/g, " ").split(" ");
    item = item.join( symbolForSpace);
    return item;
  } 
  
  
  //create wikipedia link
  function wikiLink (title) {
    return "https://en.wikipedia.org/wiki/" + transformSearch(title, "_");
  }
  
  //check if the user press ender
  document.getElementById("search").onkeypress = function (event) {
    var x =  event.which || event.keyCode;
    if (x == 13) 
      doSearch();
    
  }
  
  
};