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
// calculating new arrivial time     
  interval = $("#nextArrival").val().trim();
  var time = new Date();
// new variable to add the traintime and frequency together  

  var newTime = moment(trainTime.charAt(0).toString() + trainTime.charAt(1).toString() + trainTime.charAt(2).toString() + trainTime.charAt(3).toString(), 'Hmm').format('hh:mm A')
  var numberedInterval = parseInt(interval);
  var nextArrival;

  if (parseInt(time.getMinutes()) + numberedInterval > 60) {
    adjustedHours = parseInt(time.getHours()) + 1;
      if (adjustedHours >= 24) {
        adjustedHours = '00';
      };
    adjustedMinutes = (parseInt(time.getMinutes()) + numberedInterval) - 60;
      if (adjustedMinutes < 10) {
        adjustedMinutes = '0' + adjustedMinutes.toString();
      }  
    nextArrival = moment(adjustedHours.toString() + adjustedMinutes.toString(), 'Hmm').format('hh:mm A')
    console.log('adjusted hour: ' + nextArrival);
    // console.log('adjustedMinutes: ' + adjustedMinutes);
  } else {
    normalMinutes = parseInt(time.getMinutes() + numberedInterval)
    nextArrival = moment(time.getHours().toString() + normalMinutes.toString(), 'Hmm').format('hh:mm A')
    console.log('normal hour: ' + nextArrival);
  };

  // console.log(time.getHours() + ":" + time.getMinutes() );

// creating multiple or statements to not create errors
// trainTime.length !== 4 to make sure its proper military time
// trainTime === NaN to make sure it is a number
// interval > 60 the time between next arrival is less than 60 minutes
// interval === NaN  to make sure that it is a number
// trainTime > 2400 to make sure it does not exceed standard military time
  if (trainTime.length !== 4 || trainTime === NaN || interval > 60 || interval === NaN || trainTime > 2400 || trainTime.charAt(2) > 6 )
    {
      alert("The time needs to be in military format, sorry. (HHmm)");
      // found online that will stop the function and give an error if this statement runs
      throw new Error ('there was an error with the traintime, please check again');
  }; 


//----------------------------------------------

//references the database and pushes the name and key to it
  database.ref("trains").push({
    trainName: trainName,
    destination: destination,
    firstTime: newTime,
    nextArrival: nextArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

//check to see if the values are getting pulled, they are
  console.log("the information has been pushed to the database!");

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

};
