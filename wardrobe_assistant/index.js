'use strict';

var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyCxnNXjAphrLih732HRHJNquqf9sNjlov0",
    authDomain: "wardrobe-assistant-5d912.firebaseapp.com",
    databaseURL: "https://wardrobe-assistant-5d912.firebaseio.com",
    storageBucket: "bucket.appspot.com"
};
firebase.initializeApp(config);

var database = firebase.database();

const functions = require('firebase-functions'); // Cloud functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library






/////////////////////////////////////////////////////////////////////////////////////


function descriptionGenerator(articleDictionary){
    var result = "";
    result += articleDictionary.color + " " + articleDictionary.type;
    return result;
}
function filterByValue(dataset, valueType, value){
    var result = [];
    for(var i = 0; i < dataset.length; i++){
        if(dataset[i][valueType] == value){
            result.push(dataset[i]);
        }
    }
    // for (var article in dataset){
    //     if (article.valueType == value) {
    //         result.push(article);
    //     }
    return result;
}
function getRandomPiece(dataset){
    var result;
    if (dataset.length !==0){
        result = dataset[Math.floor(Math.random()*(dataset.length - 1))];
    }
    return descriptionGenerator(result);
}

function generateFootWear(shoeSource){
    var result = "FootWear : ";
    result += getRandomPiece(shoeSource) + "\n";
    return result;
}
function generateCoat(coatSource){
    var result = "Coat : ";
        var num = Math.floor(Math.random()+ Math.random());
        if (num === 0){
            result += "No coat today! \n";
        }
        else{
            result += getRandomPiece(coatSource) + "\n";
        }
    return result;
    }
function generateTopBottom(topSource, bottomSource){
    var result = "Top : ";
    result += getRandomPiece(topSource) + "\nBottom : " + getRandomPiece(bottomSource) + "\n";
    return result;
}
function generateOp(opSource){
    var result = "Body Wear : ";
    result += getRandomPiece(opSource) + "\n";
    return result;
}
function generateBodyWear(topSource, bottomSource, opSource){
    var result = "";
    var num = Math.floor(Math.random() + Math.random()+1);
    if (num == 1){
        result += generateTopBottom(topSource, bottomSource);
    }
    else{
        result += generateOp(opSource);
    }
    return result;
}

function getArticleByID(dataset, idList){
    var result = [];
    for (var id in idList){
        result.push(dataset[id]);
    }
    return result;
}

function generateOutfit(dataset, season, numOfArticles){
    var result = "";
    // var filtered = filterByValue(dataset, "tags", styleList);
    var shoeSource = filterByValue(dataset, "category", "shoes");
    var coatSource = filterByValue(dataset, "category", "outerwear");
    var topSource = filterByValue(dataset, "category", "tops");
    var bottomSource = filterByValue(dataset, "category", "bottoms");
    var opSource = filterByValue(dataset, "category", "one piece");
    result += generateBodyWear(topSource, bottomSource, opSource, season, numOfArticles) + 
    generateCoat(coatSource, season) + generateFootWear(shoeSource);
    return result;
    
}


///////////////////////////////////////////////////////////////////////////////////////////






exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
    const app = new DialogflowApp({
        request: req,
        response: res
    });


    function welcome(app) {
        app.ask("Do you want a formal or casual outfit?");
    }

    function createLook(app) {
        var style = app.getArgument("tags");
        // Database connects to clothing dictionary, filter by style and returns a sub dict
        var data = database.ref("clothing").orderByChild(style).equalTo("true");
        
        // Use a callback function to get data
        data.once('value').then(function(snapshot){
            
            var dict = snapshot.val();
            var list = [];
            for (var key in dict) {
                list.push(dict[key]);
            }
            
            app.ask('Your ' +style +' outfit of the day is \n' + generateOutfit(list));
            
        });
        //var outfit = 'blue jacket';
        // if (userChoice == "casual") {
        //     app.ask('you chose a ' + userChoice);
        // } else {
        //     //generate formal outfit
        //     app.ask('you chose a ' + userChoice);
        // }
        //get outfit from backend
    }

    function createLookCustom(app) {
        let userResponse =
            app.getArgument("userFeedback");
        if (userResponse == "like") {
            //positive response
            app.ask("You liked it!");
        } else {
            //negative response
            app.ask("Sorry, we'll try better next time!");
        }
    }

    const actionMap = new Map();
    actionMap.set("create.look", createLook);
    actionMap.set("create-look.create-look-custom", createLookCustom);
    actionMap.set("input.welcome", welcome);
    app.handleRequest(actionMap);
});
