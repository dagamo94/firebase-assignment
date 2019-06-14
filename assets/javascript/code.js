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

    if (trainName !== "" && destination !== "" && firstTrainTime !== "", frequency !== "") {

        trainInfoObj = {
            dbTrainName: trainName,
            dbDestination: destination,
            dbFirstTrainTime: firstTrainTime,
            dbFrequency: frequency
        };

        database.ref().push(trainInfoObj);
        clearInputs();
    }

});

database.ref().on("child_added", function (childSnapshot) {
    var tblRow = $("<tr>");
    var tblRowHead = $("<th>").attr("scope", "row").text(childSnapshot.val().dbTrainName);
    var tblDest = $("<td>").text(childSnapshot.val().dbDestination);
    var tblFreq = $("<td>").text(childSnapshot.val().dbFrequency);
    var tblNextArrival = $("<td>").text("TBD");
    var tblMinsAway = $("<td>").text("TBD");
    var removeBtn = $("<td>").append($("<button>").attr({
        type: "submit",
        class: "btn btn-secondary remove",
        id: childSnapshot.val().dbTrainName + "-remove"
    }).text("Remove"));

    tblRow.append(tblRow, tblRowHead, tblDest, tblFreq, tblNextArrival, tblMinsAway, removeBtn);

    $("#train-schedules").append(tblRow);

    console.log(childSnapshot.val().dbTrainName);
    console.log(childSnapshot.val().dbDestination);
    console.log(childSnapshot.val().dbFirstTrainTime);
    console.log(childSnapshot.val().dbFrequency);
});