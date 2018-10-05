var currentRandQuote = document.getElementById("currentRandQuote");
var originQuote = document.getElementById("originQuote");

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       var response = JSON.parse(xhttp.responseText);
       var playQuotes = response["Quotes"][0]["playQuotes"];

       var randQuote = playQuotes[Math.floor(Math.random() * playQuotes.length)];
       currentRandQuote.innerHTML = randQuote["said"];
       originQuote.innerHTML += randQuote["name"];

    }
};
xhttp.open("GET", "quoteList.json", true);
xhttp.send();
