// Initialize personal firebase project
  var config = {
    apiKey: "AIzaSyBQe_qHJlfkvtfjrYTw__FxfxNdd6J7TNE",
    authDomain: "fir-trainassignment.firebaseapp.com",
    databaseURL: "https://fir-trainassignment.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "226263735211"
  };
  firebase.initializeApp(config);

//variables to be changed and pushed to storage and display
var trainName = "";
var destination = "";
var firstTime = "";
var frequency = 0;

//variables for connections to firebase
var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

//used to check if anyone is online
connectedRef.on("value", function(snap) {
	if(snap.val()) {
//when someone is online they are pushed to the connects list		
		var con = connectionsRef.push(true);
//when someone leaves, they are removed from the list		
		con.onDisconnect().remove();
	}
});

//displays the number of active users
connectionsRef.on("value", function(snap) {
	$("#activeUsers").text("There are currently: " + snap.numChildren() + " active users");
});

//waiting for the onclick of the submit button
 function storeInfo() {

 $("#submitButton").on("click", function(event) {
//prevents the page from refreshing 
      event.preventDefault();

//set variables to pull the values in the input value
      trainName = $("#trainName").val().trim();
      destination = $("#destination").val().trim();
      firstTime = $("#firstTime").val().trim();
      frequency = $("#frequency").val().trim();

//check to see if the values are getting pulled, they are
      console.log(trainName);
      console.log(destination);

//------------------------------------moment.js playground
// var currentTime = moment();

//     // Assumptions
//     var tFrequency = frequency;

//     // Time is 3:30 AM
//     var first = firstTime;

//     // First Time (pushed back 1 year to make sure it comes before current time)
//     var firstTimeConverted = moment(first, "hh:mm").subtract(1, "years");
  

//         // Difference between the times
//     var diffTime = moment().diff(firstTimeConverted, "minutes");

//         // Time apart (remainder)
//     var tRemainder = diffTime % tFrequency;

//         // Minute Until Train
//     var tMinutesTillTrain = tFrequency - tRemainder;

//     // Next Train
//     var nextTrain = moment().add(tMinutesTillTrain, "minutes");

//----------------------------------------------

//references the database and pushes the name and key to it
database.ref("trains").push({

        trainName: trainName,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

//resets the inputs, so previous inputs are not displayed
  $('#trainName').val("");
  $('#destination').val("");  
  $('#firstTime').val("");
  $('#frequency').val(0);
    });

//ends the onclick function
};


//function to pull previous trains from firebase database
function displayPrevious() {

database.ref("trains").orderByChild("dateAdded").on("child_added", function(snapshot) {

      // Change the HTML to reflect
      $("#trainDisplay").append('<div class="display">' + snapshot.val().trainName + '<br /></div>');
      $("#destinationDisplay").append('<div class="display">' + snapshot.val().destination + '<br /></div>');
      $("#firstDisplay").append('<div class="display">' + snapshot.val().firstTime + '<br /></div>');
      $("#frequencyDisplay").append('<div class="display">' + snapshot.val().frequency + 'mins<br /></div>' );
    });

}

//runs the onclick function
storeInfo();

//lets the firebase database load once at window onload to grab previous information
$(window).on("load", function() {
displayPrevious();


});