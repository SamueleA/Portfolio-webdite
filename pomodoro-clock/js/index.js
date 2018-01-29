//style the button

$(function(){
  var defaultTime = 1200; //1200
  var time = defaultTime;
  var started = false; //can be stop, or start
  var audio = document.getElementById("sound");

  $(".digit").text(minutesSeconds(time));
  
  $(".header").click( function () {
    if (started == false) {
      started = true;
      $(".tomato").removeClass("changeColorToRed");
      setTimeout(function(){
        $(".tomato").css("transition", time-1 + "s");
        $(".tomato").addClass("changeColorToRed");
      }, 1000);
    } else if (started ==true) {
      started = false;
      $(".tomato").removeClass("changeColorToRed");
      $(".tomato").css("transition", "1s");
      time = defaultTime;
    }
    $(".digit").text(minutesSeconds(time));
  });
  
  
$(".plus").click( function(){
  if (time <= 5970) { //99 minutes and 30 secons 
    time += 30;
  }
  if (started == true) {
    started = false;
    $(".tomato").css("transition", "1s");
    $(".tomato").removeClass("changeColorToRed");
    time = defaultTime;
  }
  $(".digit").text(minutesSeconds(time));
});
  
$(".minus").click(function()  {
  if (time > 30) {//99 minutes and 30 secons
    time -= 30;
  }
  if (started == true) {
    started = false;
    $(".tomato").css("transition", "1s");
    $(".tomato").removeClass("changeColorToRed");
    time = defaultTime;
  }
  $(".digit").text(minutesSeconds(time));
});
  
  setInterval (function (){ 
    if (started == true) {
      time -= 1;
      if (time < 0) {
        started =false;
        time = defaultTime;
        audio.play();
        $(".tomato").css("transition", "1s");

      }
    }
    $(".digit").text(minutesSeconds(time));
  }, 1000);
  
  $(".volume").click(function(){
    audio.play();
  
  });
  
  function minutesSeconds (seconds) {
    var minutesAndSeconds = [];
    var amountMinutes = (seconds - (seconds % 60)) / 60;
    var remainderSeconds = seconds - amountMinutes *60;
    console.log(seconds, amountMinutes*60);
    if (remainderSeconds < 10) {
      remainderSeconds = "0" + remainderSeconds;
    }
    return (amountMinutes + ":" + remainderSeconds);
    
  }
      
});