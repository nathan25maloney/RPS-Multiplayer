var config = {
    apiKey: "AIzaSyASlIA85y9ExrfjojimM6R-bE-uW2H3_cY",
    authDomain: "rps-multiplayer-1fc71.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-1fc71.firebaseio.com",
    projectId: "rps-multiplayer-1fc71",
    storageBucket: "rps-multiplayer-1fc71.appspot.com",
    messagingSenderId: "314445837683"
  };

firebase.initializeApp(config);
var database = firebase.database();

var amPlayer1 = false;
var amPlayer2 = false;

var player1Choice;
var player2Choice;
var text;
var textHolder;
var player1wins = 0;
var player1loses = 0;
var player2wins = 0;
var player2loses = 0;
var player1name;
var player2name;
var nameHolder;


function newPlayer() {
	if (isPlayer1  && !amPlayer2) {
		nameHolder = $("#name-input").val().trim();
		console.log("should write new player", nameHolder);
		database.ref("player1").update({
			name: nameHolder,
			wins: 0,
			loses: 0		
		});
		amPlayer1 = true;
		


	} else if (isPlayer2 && !amPlayer1) {
		nameHolder = $("#name-input").val().trim();
		database.ref("player2").update({
			name: nameHolder,
			wins: 0,
			loses: 0
		});
		amPlayer2 = true;

		
	} else {
		console.log("you'll just have to wait");
	}

	if (isPlayer1  && !amPlayer2){
		database.ref("players").update({
			isPlayer1: false,
			
		})
	} else if(isPlayer2 && !amPlayer1){
		database.ref("players").update({
			
			isPlayer2: false
		})
	}
}




$(function () {
	var messagesRef = database.ref("chat");

	$("#new-player").on("click", function(e) {
	e.preventDefault();
	console.log("The button is working");
	newPlayer();
	});
	$("#name-input").keyup(function (e) {
    if (e.keyCode == 13) {	
      e.preventDefault();
      $("#new-player").click();  
    };
	});

	$("#Rock").on("click", function () {
		run("rock");
	});
	$("#Paper").on("click", function () {
		run("paper");
	});
	$("#Scissors").on("click", function () {
		run("scissors");
	});
	$("#Lizard").on("click", function () {
		run("lizard");
	});
	$("#Spock").on("click", function () {
		run("spock");
	});
	$("#submitmsg").on("click", function (e) {
		e.preventDefault();
		var name = nameHolder;
	    var text = $("#usermsg").val();
	    messagesRef.push({name:name, text:text});
	    $("#usermsg").val("");

	});

  $("#usermsg").keyup(function (e) {
    if (e.keyCode == 13) {	
      e.preventDefault();
      $("#submitmsg").click();
      
    }
  });


  messagesRef.limitToLast(10).on("child_added", function (snapshot) {
    var message = snapshot.val();
    $("<div/>").text(message.text).prepend($("<em/>")
      .text(message.name + ": ")).appendTo($("#chatbox"));
    $("#chatbox")[0].scrollTop = $("#chatbox")[0].scrollHeight;
  });

    database.ref("players").on("value", function(snapshot) {
		isPlayer1 = snapshot.val().isPlayer1;
		isPlayer2 = snapshot.val().isPlayer2;
	})

	database.ref("player1").on("value", function(snapshot) {
		player1name = snapshot.val().name;
		player1wins = snapshot.val().wins;
		player1loses = snapshot.val().loses;
		text = snapshot.val().text;
		$("#player-1-name").text(player1name);
		$("#player-1-wins").text(player1wins);
		$("#player-1-loses").text(player1loses);
		$("#winner").text(text);
	})

	database.ref("player2").on("value", function(snapshot) {
		player2name = snapshot.val().name;
		player2wins = snapshot.val().wins;
		player2loses = snapshot.val().loses;
		text = snapshot.val().text;
		$("#player-2-name").text(player2name);
		$("#player-2-wins").text(player2wins);
		$("#player-2-loses").text(player2loses);
		$("#winner").text(text);

	})



	
});

window.onbeforeunload = function (event) {
    
    if (typeof event == 'undefined') {
        event = window.event;
    }
    if (event) {
        
        if(amPlayer1){
        	database.ref("players").update({
			isPlayer1: true,
			});
        	database.ref("player1").set({
			name: "Waiting for Player 1",
			text: "",
			wins: 0,
			loses: 0,
			choice: ""
			});
			
        } else if(amPlayer2){
        	database.ref("players").update({
			isPlayer2: true,
			});
			database.ref("player2").set({
			name: "Waiting for Player 2",
			text: "",
			wins: 0,
			loses: 0,
			choice: ""
			});

        }
    }
    
};			   
			    



var choices  =  {rock : {name: "Rock", defeats: ["scissors","lizard"]},

	            paper: {name: "Paper", defeats: ["rock", "spock"]},

	            scissors: {name: "Scissors", defeats: ["paper", "lizard"]},

	            lizard: {name: "Lizard", defeats:["paper","spock"]},

	            spock: {name: "Spock", defeats:["scissors","rock"]}
	            };


function run(arg){
	
	if(amPlayer1){
		player1Choice = arg;
		database.ref("player1").update({
			choice: arg
		});
		database.ref("player2").on("value", function(snapshot) {
			player2Choice = snapshot.val().choice;
		});
		console.log(player1Choice);
		console.log(player2Choice);
		check(player1Choice, player2Choice);
	} else if (amPlayer2){
		
		player2Choice = arg;
		database.ref("player2").update({
			choice: arg
		});
		database.ref("player1").on("value", function(snapshot) {
			player1Choice = snapshot.val().choice;
		});
		console.log(player1Choice);
		console.log(player2Choice);
		check(player1Choice, player2Choice);
	};

	
	

}

function check(firstarg, secondarg) {
	if(firstarg == secondarg){ 
	      console.log("it's a tie");
	      
	      database.ref("player1").update({
	      	choice: "",
	      	text: "You both tied!  Make another choice"
	      });
	      database.ref("player2").update({
	      	choice: "",
	      	text: "You both tied!  Make another choice"
	      });
	
	}else if(choices[firstarg] === undefined || choices[secondarg] === undefined){
	    console.log("waiting on the other player");
	    
	    database.ref("player1").update({
	      	text: "Waiting on the other player"
	      });
	      database.ref("player2").update({
	      	text: "Waiting on the other player"
	      });
	}else{
	   
	    first = firstarg
	    firstarg = choices[firstarg];
	    
	    console.log(firstarg);
	    
	    
	    var victory = firstarg.defeats.indexOf(secondarg) > -1;
	    
	    if(victory) { 
	    	player1wins += 1;
	    	player2loses += 1;
	    	textHolder = player1name+" Won!  " + first + " beats "+ secondarg;
	    	database.ref("player1").update({
	    		wins: player1wins,
	    		choice: "",
	    		text: textHolder
	    	});
	    	database.ref("player2").update({
	    		loses: player2loses,
	    		choice: "",
	    		text: textHolder
	    	});     
	        

	    }else{  
	        player2wins += 1;
	    	player1loses += 1;
	    	textHolder = player2name+" Won!  "+ secondarg +" beats "+first
	    	database.ref("player2").update({
	    		wins: player2wins,
	    		choice: "",
	    		text: textHolder
	    	});
	    	database.ref("player1").update({
	    		loses: player1loses,
	    		choice: "",
	    		text: textHolder
	    	}); 
	    	

	    }   
	}
}




