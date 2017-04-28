// global variables
var random = [ "twice", "aoa", "gfriend", "pristin", "running man", "knowing bros"]
var losses = 0;
var wins = 0;
var livesRemaining = 0;
var word = "";
var answer = [];
var underScoreArray = [];
var guessesArray = [];

function pickRandom() {
  word = random[Math.floor(Math.random() * random.length)];
  return word;
}

// word is the provided perameter from the pickRandom()
function generateUnderscore(word) {
// spliting word into individual characters in the underScoreArray
	underScoreArray = word.split('');
// setting the split word to var answer also, for comparison later on	
	answer = word.split('');
// creating a for loop to replace each index point with an underscore	
	for (i = 0; i < underScoreArray.length; i++) {
		underScoreArray.splice(i, 1, "_");
	}
// once the array is spliced I join the arrays with " " instead of ,'s
	// underScoreArray = underScoreArray.join(" ");
//console.logging to confirm changes	
	console.log(underScoreArray);
// messing around with javascript to identify the Id	
	document.getElementById("hangmanWord").innerHTML= underScoreArray.join(" ");
// adding classes to the Id section
	$("#hangmanWord").addClass("text-center h2");
		return underScoreArray;
	}

// checks the keypress and updates the info if the letter exists
function replacingDisplay(which) {	
	var check = false;
// set CharCode to variable AND also making it lowercase automatically 	
	var event = String.fromCharCode(which).toLowerCase();
	for (i = 0; i <answer.length; i++) {
		if (event === answer[i]) {
			console.log("yes it matches!");
			underScoreArray.splice(i, 1, event);
			document.getElementById("hangmanWord").innerHTML= underScoreArray.join(" ");
// if there is a match in the array, then check becomes true			
		check = true;
		} 
	}
// if check is TRUE then this will run	
	if (check) {
// comparing the answer.join with the updating underScoreArray.join		
		if (answer.join(" ") === underScoreArray.join(" ")) {
			wins++;
			$('#totalWins').html(wins);
			alert("You won! The answer was " + word + "!");
			$('#hangmanWord').addClass("text-success");
			thanksForPlay();
// setting it equal to 0 so that the keypress below will not work anymore			
			livesRemaining = 0;
		}
// if check is still FALSE, then this will run
	} else if (!check) {
// checks the guessesArray for the event variable, if it is not here then the result is -1 === -1		
		if ( $.inArray(event, guessesArray) === -1) {
			livesRemaining--;
			guessesArray.push(event);
			$('#answerDiv').html(guessesArray.join(", "));
			$('#answerDiv').addClass("text-danger h3");
			$('#livesLeft').html(livesRemaining);
// if they have no livesRemaining this will run			
			if (livesRemaining === 0 ) {
				alert("Game over! answer was " + word);
				$('#hangmanWord').html(answer.join(" "));
				$('#hangmanWord').addClass("text-danger");
				losses++;
				$('#totalLosses').html(losses);
				thanksForPlay();
		}
		}
	}
}


// restarts the game and updates the display
function RestartGame() {	
	pickRandom();
	generateUnderscore(word);
	livesRemaining = 10;
	$('#livesLeft').html(livesRemaining);
	$('#answerDiv').html("");
	guessesArray = [];

	$("#hangmanWord").removeClass("text-danger text-success");
	console.log(answer);
}

// button to start game and hide the button
$('#startBtn').on('click', function() {
	$('#startBtn').hide();
	RestartGame();
})

// restarts the game with lives refreshed, but total wins/losses remaining
$('#restartGame').on('click', function() {
	RestartGame();
});

// this runs the game key press and when there is no lives remainging, the keypress function will stop
$(window).keypress(function(event){
	if (livesRemaining === 0) {
		return false;
	} else {
// this is the function that will check and update the display		
	replacingDisplay(event.which); 
	}
});

function thanksForPlay() {
	$("#hangmanImg").html("</p>Thanks for playing my demo, please check out my other works on the links above.</p>");
	$("#hangmanImg").addClass("h2");
}
