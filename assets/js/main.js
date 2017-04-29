// Initialize firebase project
  // Initialize Firebase
var config = {
//personal api key for the firebase assignment project  
  apiKey: "AIzaSyBQe_qHJlfkvtfjrYTw__FxfxNdd6J7TNE",
// name of the auth domain location  
  authDomain: "fir-trainassignment.firebaseapp.com",
// realtime database tracking  
  databaseURL: "https://fir-trainassignment.firebaseio.com",
// id to reference the project 
  projectId: "fir-trainassignment",
// cloud storage for the project (optional)  
  storageBucket: "fir-trainassignment.appspot.com",
// cloud messaging, optional 
  messagingSenderId: "226263735211"
};

// connect to the database where config is the default firebase to run at startup.
// however if you wanted to have multiple databases running just imagine 
// the setup as variable "otherApp" = firebase.initializeApp(otherAppconfig, "name here")
firebase.initializeApp(config);

//variables to be changed and pushed to storage and display
var trainName = "";
var destination = "";
var trainTime = 0;
// var displayCurrentTime = currentTime.format('LT');
var nextArrival;

//variable reference for connections to firebase
var database = firebase.database();

//lets the firebase database load once at window onload to grab previous information
$(window).on("load", function() {
  displayPrevious();
});

// if the submit button is clicked, then it will save the data to the realtime database
 $("#submitButton").on("click", function(event) {
//prevents the page from refreshing 
  event.preventDefault();
  storeInfo(); 
}); 

// function that runs and sets the input values to variables then pushes them to a new child_added
// to whatever database you are referencing to, in this case "trains"
// push() gives each json branch a generated key, set would replace whatever you are referencing
function storeInfo() {
//set variables to pull the values in the input value
  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  trainTime = $("#firstTime").val().trim();
// creating an if statement to stop anything other than a 4 digit number  
    if (trainTime.length !== 4 || trainTime === NaN) {
      alert("The time needs to be in military format, sorry. (HHmm)");
// found online that will stop the function and give an error if this statement runs
      throw new Error ('This is not an error. This is just to abort javascript');
     }
// calculating new arrivial time     
  nextArrival = $("#nextArrival").val().trim();
// new variable to add the traintime and frequency together  
  newTime = parseInt(trainTime) + parseInt(nextArrival);

//check to see if the values are getting pulled, they are
  console.log("the information has been pushed to the database!");
//----------------------------------------------

//references the database and pushes the name and key to it
  database.ref("trains").push({
    trainName: trainName,
    destination: destination,
    firstTime: trainTime,
    nextArrival: newTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

//resets the inputs, so previous inputs are not displayed
  $('#trainName').val("");
  $('#destination').val("");  
  $('#firstTime').val("");
  $('#nextArrivalDisplay').val(0);
};
// end of the storeInfo function


//function to pull previous trains from firebase database
function displayPrevious() {
  database.ref("trains").orderByChild("dateAdded").on("child_added", function(snapshot) {

    // Change the HTML to reflect
    $("#trainDisplay").append('<div class="display">' + snapshot.val().trainName + '<br /></div>');
    $("#destinationDisplay").append('<div class="display">' + snapshot.val().destination + '<br /></div>');
    $("#firstDisplay").append('<div class="display">' + snapshot.val().firstTime + '<br /></div>');
    $("#nextArrivalDisplay").append('<div class="display">' + snapshot.val().nextArrival + '<br /></div>' );
  });

},
