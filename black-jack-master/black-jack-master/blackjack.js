let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0; 
let yourAceCount = 0;

let hidden;
let deck;

let canHit = true; //allows the player (you) to draw while yourSum <= 21

// The first thing you need to do when the game loads is to build a deck so that you can play
window.onload = function(){
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck(){
    // capitalise and "" so it corresponds to image names
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i=0; i < types.length; i++){
        for (let j =0; j < values.length; j++){
            //fill the deck with all the cards in the game
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
   
}

function shuffleDeck(){
    for (let i=0; i< deck.length; i++){
        let j = Math.floor(Math.random()* deck.length); //(0-1) * 52 => (0-51.9999) It does not include 52 
        let temp = deck[i]; //each card name in order
        deck[i] = deck[j]; //each card name, but now random position
        deck[j] = temp; //check explanation pic

    console.log(deck[i]);
    }
}

function startGame(){
    hidden = deck.pop(); //remove a card from the end of the array
    dealerSum += getValue(hidden); //at the dealer sum, you add his value by revealing the new card
    dealerAceCount += checkAce(hidden); //check if the hidden card is ace
    // console.log(hidden);
    // console.log(dealerSum);
    while(dealerSum < 17){
        let cardImg = document.createElement("img"); // create an image tag -> <img = ">
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png"; //<img src ="./cards/4-C.png">
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg); //append our image tag to the dealer-cards tag
    }     
    console.log(dealerSum);

    for (let i = 0; i < 2; i++){
        let cardImg = document.createElement("img"); // create an image tag -> <img = ">
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png"; //<img src ="./cards/4-C.png">
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function hit(){
    if(!canHit){
        return;
    }
    let cardImg = document.createElement("img"); 
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png"; 
    yourSum += getValue(card);
    yourAceCount += checkAce(card); //add the number of Aces you have
    document.getElementById("your-cards").append(cardImg);

    if(reduceAce(yourSum, yourAceCount) > 21){ //A, J, K -> 11 + 10 + 10 change the Ace to 1
        canHit = false;
    }

}

function stay(){
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false; //because we don't want to add any more cards
    document.getElementById("hidden").src = "./cards/" + hidden + ".png"; //reveal the hidden card

    let message = "";
    if (yourSum > 21){
        message = "You Lose!"; //drawback of player. at the end, if your sum is greater than 21, you lose
    }
    else if (dealerSum > 21){
        message = "You win!";
    }
    else if (yourSum == dealerSum){
        message = "Tie";
    }
    else if (yourSum > dealerSum){
        message = "You Win!";
    }
    else if (yourSum < dealerSum){
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum; //the span element specifically to add text. It has different name than the div element inside the index.html
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message; //populate one of these messages into the results tag
}

function getValue(card){
    let data = card.split("-"); //"4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)){ //returns a boolean that indicates whether the value is numeric
        if (value == "A"){
            return 11;
        }
        return 10; //if J, Q or K
    }
    return parseInt(value);
}

function checkAce(card){
    if (card[0] == "A"){
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount){
    while(playerSum > 21 && playerAceCount > 0){
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}