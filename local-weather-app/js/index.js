
//loading animation....https://www.w3schools.com/howto/howto_css_loader.asp



//get user location...lat and longitude
//format an http request
window.onload = function () {
  var originalTemp = 0;
  var celcius = false;
  var http = new XMLHttpRequest();
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getWeather);
  } else { 
        console.log("Geolocation is not supported by this browser.");
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
    originalTemp = response.currently.temperature;
    document.getElementById("temperature").innerHTML = response.currently.temperature.toFixed(0);
    document.getElementById("description").innerHTML = response.currently.summary;
    var icon = response.currently.icon;
    icon = icon.replace(/-| /g, "_").toUpperCase();
    var skycons = new Skycons({"color": "#b2bab8"});
    skycons.add("icon1", Skycons[icon]);
    skycons.play();
    document.getElementsByClassName("loading")[0].style.display = "none";
    document.getElementsByClassName("to-load")[0].style.display = "block";
    
  }
    
    
  function getWeather (position) {
    var latitude = position.coords.latitude; 
    var longitude = position.coords.longitude;
    //var url = "https://crossorigin.me/https://api.darksky.net/forecast/3af6a955ef0e23fec61da9a0dc935df5/" + latitude + "," + longitude;
    var url = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/3af6a955ef0e23fec61da9a0dc935df5/" + latitude + "," + longitude; 
    http.open("GET", url, true); 
 
    http.send(); 
    
  }
  
  document.getElementsByClassName("switch-btn")[0].onclick = function() {
    
    var temperature = document.getElementById("temperature").innerHTML;
    if (celcius) {
      document.getElementById("sign").innerHTML = String.fromCharCode(176) + "F";
      temperature = originalTemp.toFixed(0);
      celcius = false;
      }
    else {
      document.getElementById("sign").innerHTML = String.fromCharCode(176) + "C"
      temperature = Math.round((originalTemp -32) * 5/9).toFixed(0);  
      celcius = true;
      }
    document.getElementById("temperature").innerHTML = temperature;
    
  };
 
    
};