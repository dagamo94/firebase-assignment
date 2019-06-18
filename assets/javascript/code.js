var firebaseConfig = {
    apiKey: "AIzaSyB_yyt9BpXQegP-a3IZrlS9m3vZZrAlF5E",
    authDomain: "testing-30df7.firebaseapp.com",
    databaseURL: "https://testing-30df7.firebaseio.com",
    projectId: "testing-30df7",
    storageBucket: "testing-30df7.appspot.com",
    messagingSenderId: "356240968235",
    appId: "1:356240968235:web:29600676e23540b2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";
var trainInfoObj;

function clearInputs(){
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
}

$("#capture-train-info").on("click", function (event) {
    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#first-train-time").val().trim();
    frequency = $("#frequency").val().trim();

    if (trainName !== "" && destination !== "" && firstTrainTime !== "" && frequency !== "") {

        trainInfoObj = {
            dbTrainName: trainName,
            dbDestination: destination,
            dbFirstTrainTime: firstTrainTime,
            dbFrequency: frequency,
            dbNextTrain: "",
            dbMinutesAway: ""
        };

        database.ref().push(trainInfoObj);
        clearInputs();
    }

});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot)
    var tFrequency = childSnapshot.val().dbFrequency;

    var firstTime = childSnapshot.val().dbFirstTrainTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("FIRST TIME COONVERTED: ",  firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var arrivalTime = moment(nextTrain).format("hh:mm A");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var tblRow = $("<tr>");
    var tblRowHead = $("<th>").attr("scope", "row").text(childSnapshot.val().dbTrainName);
    var tblDest = $("<td>").text(childSnapshot.val().dbDestination);
    var tblFreq = $("<td>").text(childSnapshot.val().dbFrequency);
    var tblNextArrival = $("<td>").text(arrivalTime);
    var tblMinsAway = $("<td>").text(tMinutesTillTrain);
    var removeBtn = $("<td>").append($("<button>").attr({
        type: "submit",
        class: "btn btn-dark remove",
        id: childSnapshot.val().dbTrainName + "-remove"
    }).text("Remove"));
    

    tblRow.append(tblRow, tblRowHead, tblDest, tblFreq, tblNextArrival, tblMinsAway, removeBtn);

    $("#train-schedules").append(tblRow);

    // console.log(childSnapshot.val().dbTrainName);
    // console.log(childSnapshot.val().dbDestination);
    // console.log(childSnapshot.val().dbFirstTrainTime);
    // console.log(childSnapshot.val().dbFrequency);
    $("td").on("click", ".remove", function(event){
        event.preventDefault();
        alert(tblMinsAway.text());
        $(this).remove(tblRow);
        console.log();
        firebase.database().ref("testing-30df7/-LhbGm3OSdSJAtK-HzlF").remove()
        .then(function(){
            console.log("removed");
        })
        .catch(function(error){
            console.log("error", error)
        })
    });
});

