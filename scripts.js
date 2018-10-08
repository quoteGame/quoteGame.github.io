var optionContainer = document.getElementById("optionContainer");
var currentQuote = document.getElementById("currentQuote");
var optContChild = optionContainer.children
var modal = document.getElementById('myModal');
var scoreId = document.getElementById("score");
var modalScore = document.getElementById("theirScore");
var remarkScore = document.getElementById("remarkScore");
var containerBlock = document.getElementById("container-block");
var timer = document.getElementById("timer");
var retry = document.getElementById("retry");
var tweetThis = document.getElementById("tweetThis");
var correctOrigin;
var score = 0;
var nameOfRand = ""






var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       var response = JSON.parse(xhttp.responseText);
       var mainQuotes = response["Quotes"][1]["mainQuotes"];
       var regQuotes = response["Quotes"][1]["mainQuotes"][1]["regQuotes"];
       var badQuotes = response["Quotes"][1]["mainQuotes"][0]["badQuotes"];
       var theClock = 30;
       var scopeAmount;
       var timeStart = function(){
         timer.innerHTML = theClock;
         begin = setInterval(startTimer, 1000);
       }
       var stopTimer = function(){
        	window.clearInterval(begin);
          theClock = 30;
        }
       // Envoke on page reload
       timeStart();
       changeCurrentQuote();

       // Starts the timer
       function startTimer(){
         theClock--;
         //if they ran out of time
         if(theClock == -1){
           changeColors();
           stopTimer();
           timeoutModal();
         }else{
           timer.innerHTML = theClock;
         }
       }

       // Changes Current Quote And Answers
       function changeCurrentQuote(){
         var optionContArr = [optContChild[0],  optContChild[1], optContChild[2], optContChild[3]];
         var quoteArr = [];
         var amountOfQuotes = 0;
           function getRandIt(y){
             return y[Math.floor(Math.random() * y.length)];
           }

           // Chooses randomly which array of quotes to pick from - bad guys or regular guys
           var randBadReg = getRandIt(mainQuotes);

           // Index the correct object
           if(randBadReg == mainQuotes[0]){
             nameOfRand = "badQuotes";
           }else{
             nameOfRand = "regQuotes";
           }

           // Randomly chooses which origin
           var randArray = getRandIt(randBadReg[nameOfRand]);

           // Randomly chooses which quote from origin
           var randQ = getRandIt(randArray["said"]);

           for (var i = 0; i < badQuotes.length; i++) {
               amountOfQuotes += badQuotes[i]["said"].length
             }
           for (var i = 0; i < regQuotes.length; i++) {
             amountOfQuotes += regQuotes[i]["said"].length
           }
           scopeAmount = amountOfQuotes;
           if(randArray["said"].length == 0){
             if(amountOfQuotes == 0){
               timeoutModal();
               winner();
               return
             }else{
               do {
                 randBadReg = getRandIt(mainQuotes);
                 if(randBadReg == mainQuotes[0]){
                   nameOfRand = "badQuotes";
                 }else{
                   nameOfRand = "regQuotes";
                 }
                 randArray = getRandIt(randBadReg[nameOfRand]);
                 randQ = getRandIt(randArray["said"]);
               } while (randArray["said"].length == 0);
             }
           }
           correctOrigin = randArray["name"];
           currentQuote.innerHTML = randQ;



           var randBox = getRandIt(optionContArr);
           //  Displays the quotes origin randomly
           randBox.innerHTML = '<p>' + randArray["name"] + '</p>';

           switch (randBox) {
             case optContChild[0]:
              optionContArr.splice(0,1);
               break;
             case optContChild[1]:
              optionContArr.splice(1,1);
               break;
             case optContChild[2]:
              optionContArr.splice(2,1);
               break;
             case optContChild[3]:
              optionContArr.splice(3,1);
               break;
           }

           var initalOrigin = "<p>" + randArray["name"];
           quoteArr.push(initalOrigin);

           for (var i = 0; i < optionContArr.length; i++) {
             function retQuote(x){
               return '<p>' + x[Math.floor(Math.random() * x.length)]["name"]; + '</p>'
             }

             function validateUse(array, what){
               return array.includes(what);
             }

             function validateMultiple(x, y){
               do{
                 x = retQuote(y);
               }
               while(validateUse(quoteArr, x) == true);
               return x
             }

             if(nameOfRand == "badQuotes"){
               if(i <= 1){
                 var varValidate = validateMultiple(retQuote(regQuotes), regQuotes);
                 quoteArr.push(varValidate);
                 optionContArr[i].innerHTML = varValidate
               }else{
                 var varValidate = validateMultiple(retQuote(badQuotes), badQuotes);
                 quoteArr.push(varValidate);
                 optionContArr[i].innerHTML = varValidate;
               }
             }else{
               if(i <= 1){
                 var varValidate = validateMultiple(retQuote(badQuotes), badQuotes);
                 quoteArr.push(varValidate);
                 optionContArr[i].innerHTML = varValidate;
               }else{
                 var varValidate = validateMultiple(retQuote(regQuotes), regQuotes);
                 quoteArr.push(varValidate);
                 optionContArr[i].innerHTML = varValidate;
               }
             }
           }
           for (var i = 0; i < randQ.length; i++) {
             if(randQ == randArray["said"][i]){
               randArray["said"].splice(i, 1)
             }
           }

  // end of changeCurrentQuote()
  }

  for (var i = 0; i < optContChild.length; i++) {
    optContChild[i].onclick = function(e){
        stopTimer();
        answerSubmit(e);
    };

  }
  function winner(){
    setTimeout(function(){ stopTimer(); }, 1);
    currentQuote.innerHTML = "You win!"
  }


  function answerSubmit(e){
    changeColors();
    if(e.target.innerHTML == "<p>" + correctOrigin + "</p>" || e.target.innerHTML ==  correctOrigin){
      // Success
      correctAnswer();
    }else{
      // Failure
      timeoutModal();
    }
  }

  function changeColors(){
    for (var i = 0; i < optContChild.length; i++) {
      if(optContChild[i].firstChild.textContent == correctOrigin){
        optContChild[i].style.backgroundColor = "rgba(69, 216, 86, 0.3)";
      }else{
        optContChild[i].style.backgroundColor = "rgba(239, 43, 43, 0.3)";
      }
    }
  }

  function correctAnswer(){
    containerBlock.style.display = "block";
    score++;
    scoreId.innerHTML = score;
    setTimeout(function(){
      for (var i = 0; i < optContChild.length; i++) {
        optContChild[i].style.backgroundColor = "white";
      }
      containerBlock.style.display = "none";
      changeCurrentQuote();
      timeStart();
    }, 1000);
  }





  var totalScore = score + scopeAmount
  function timeoutModal() {
    modalScore.innerHTML = score;
    if(score == totalScore){
      remarkScore.innerHTML = "(You literally got every one right, dude we've run out of quotes wtf)";
      tweetThis.href = "https://twitter.com/home?status=holy,%20i%20just%20did%20it%20i%20literally%20got%20every%20quote%20right%20bro%20what%20https%3A//quotegame.github.io"
    }else if(score >= (totalScore / 16) && score < (totalScore / 9)){
      remarkScore.innerHTML = "(Eh... alright i guess)";
      tweetThis.href = "https://twitter.com/home?status=im%20pretty%20average%20at%20https%3A//quotegame.github.io"
    }else if(score >= (totalScore / 9) && score < (totalScore / 7)){
      remarkScore.innerHTML = "(Not bad)";
      tweetThis.href = "https://twitter.com/home?status=okay...%20this%20is%20epic%20https%3A//quotegame.github.io"
    }else if(score >= (totalScore / 7) && score < (totalScore / 5)){
      remarkScore.innerHTML = "(Thats pretty damn impressive)";
      tweetThis.href = "https://twitter.com/home?status=i%20surprisingly%20didnt%20do%20too%20bad%20on%20https%3A//quotegame.github.io"
    }else if(score >= (totalScore / 5) && score < (totalScore / 3)){
      remarkScore.innerHTML = "(THATS INSANE)";
      tweetThis.href = "https://twitter.com/home?status=WHAT%20I%20JUST%20SET%20AN%20INSANE%20SCORE%20ON%20https%3A//quotegame.github.io"
    }else if(score >= (totalScore / 3) && score < totalScore){
      remarkScore.innerHTML = "(okay you gotta be cheating)"
      tweetThis.href = "https://twitter.com/home?status=WHAT%20I%20JUST%20GOT%20LIKE%20BASICALLY%20ALL%20QUESTIONS%20RIGHT%20ON%20https%3A//quotegame.github.io"
    }
   setTimeout(function(){ modal.style.display = "block";}, 500);
  }

    // For longer messages
    if(currentQuote.innerHTML.length > 126){
      currentQuote.style.marginTop = "-30px";
    }else{
      currentQuote.style.marginTop = "0"
    }
    // Retry
    retry.onclick = function(){
      location.reload();
    }

}
};
xhttp.open("GET", "quoteList.json", true);
xhttp.send();
