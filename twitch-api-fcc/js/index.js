

window.onload = function() {
  //the default logo when the streamer has not uploaded one
  var defaultTwitchLogo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";
  var streams = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
  var http = new XMLHttpRequest();
  
  //fetch information about everystream...
  for (var i =0; i<streams.length;i++) {
    var streamURL = "https://wind-bow.glitch.me/twitch-api/streams/" + streams[i];
    var channelURL = "https://wind-bow.glitch.me/twitch-api/channels/" + streams[i];
    var promise1 = get(streamURL);
    var promise2 = get(channelURL);
    var promise3 = "https://www.twitch.tv/" + streams[i];
    Promise.all([promise1, promise2, promise3]).then(function(jsonVals){
      var status = jsonVals[0].stream != null ? "online": "offline";
      var description = jsonVals[0].stream != null ? jsonVals[0].stream.channel.status: "Tune in later!!";
      var thumbnailLink = jsonVals[1].logo || defaultTwitchLogo; 
      var streamLink = jsonVals[2];
      createCard(status, description, thumbnailLink, streamLink);
    }).catch(function(error) {
      console.error("Error, oh boy!", error);
    });
    
  }
  
  
  function get(url) {
    return new Promise(function(resolve, reject) {
      var http = new XMLHttpRequest();
      http.open("get", url, true);
      http.onload = function(){
        if (http.status == 200 ) {
          resolve(JSON.parse(http.response));
        }
          
        else
          reject(Error(http.statusText));
      }
      http.onerror =function() {
        (Error("Network Error"));
      };
      http.send();
    });
    
    
  }
  
  function createCard(status, description, imageLink, streamLink) {
    var card = document.createElement("a");
    card.setAttribute("class", "card");
    card.setAttribute("href", streamLink );
    card.setAttribute("target", "_blank");
    
    var thumbnail = document.createElement("img");
    thumbnail.setAttribute("class", "thumbnail");
    thumbnail.setAttribute("src", imageLink);
    
    var descriptionTag = document.createElement("div");
    descriptionTag.innerHTML = description;
    descriptionTag.setAttribute( "class", "description");
    
    var statusTag = document.createElement("div");
    statusTag.setAttribute("class", "status");
    
    card.appendChild(thumbnail);
    card.appendChild(descriptionTag);
    card.appendChild(statusTag);
    if (status == "online")
      document.getElementById("online").appendChild(card);
    else
      document.getElementById("offline").appendChild(card);
    
  }
  
  var leds = document.getElementsByClassName("select");
  for (var i =0; i<leds.length; i++) {
    leds[i].addEventListener("click", ledClick);    
    
  }
  
  function ledClick () {
    if( this.classList.contains("active") !== true) {
      document.getElementsByClassName("active")[0].classList.remove("active");
      this.classList.add("active");
      
      if (this.classList.contains("all-select")) {
        document.getElementById("online").style.display = "block";
        document.getElementById("offline").style.display = "block";      
        } else if (this.classList.contains("online-select")) {
          document.getElementById("online").style.display = "block";
          document.getElementById("offline").style.display = "none";   
        } else if (this.classList.contains("offline-select")) {
          document.getElementById("online").style.display = "none";
          document.getElementById("offline").style.display = "block";     
        }
    }
  
  }
  
  
};