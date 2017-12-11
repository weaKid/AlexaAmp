

let speechOutput;
let reprompt;
const welcomeOutput = "Welcome to AMP voice assisted module. What would you like to do?";
const welcomeReprompt = "Let me know what would you like to do. For example you can ask for a loan";
const formComplete = [
    "Ok I've collected all the data I needed ",
    "Here are the details you've submitted"
];



// 2. Skill Code =======================================================================================================

'use strict';
const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

const APP_ID = process.env.alexaAppId;
const lambda = new AWS.Lambda({
    region: 'eu-west-1'
});

const handlers = {
    'LaunchRequest': function () {
        this.response.speak(welcomeOutput).listen(welcomeReprompt);
        this.emit(':responseReady');
    },
    'AskForLoan': function () {
        //delegate to Alexa to collect all the required slot values
        var filledSlots = delegateSlotCollection.call(this);

        //compose speechOutput that simply reads all the collected slot values
        var speechOutput = randomPhrase(formComplete);

        //Now let's recap the form details
        var name = this.event.request.intent.slots.name.value.split(' ');
        var firstName = name[0];
        var lastName = name[1];
        var title = this.event.request.intent.slots.title.value;
        var businessTradingName = this.event.request.intent.slots.businessTradingName.value;
        var businessPhoneNumber = this.event.request.intent.slots.businessPhoneNumber.value;
        var totalMonthlySales = this.event.request.intent.slots.totalMonthlySales.value;
        var averageMonthlyCardSales = this.event.request.intent.slots.averageMonthlyCardSales.value;
        var monthlyCosts = this.event.request.intent.slots.monthlyCosts.value;
        var loanAmount = this.event.request.intent.slots.loanAmount.value;


        speechOutput += `Your title is ${title}, your first name is ${firstName} and your last name is ${lastName}`

        //save the collected data to DynamoDb
        const formDetails = {
            firstName,
            lastName,
            title,
            businessTradingName,
            businessPhoneNumber,
            totalMonthlySales,
            averageMonthlyCardSales,
            monthlyCosts,
            loanAmount
        }

        if (this.event.request.dialogState === "COMPLETED") {
            const thisAlexa = this;
            const persistenceParams = {
                FunctionName: process.env.persistenceLambdaName,
                InvocationType: 'RequestResponse',
                Payload: JSON.stringify(formDetails, null, 2)
            }
            lambda.invoke(persistenceParams, function (err, data) {
                if (err) {
                    thisAlexa.response.speak('There was an error saving your details')
                    thisAlexa.emit(":responseReady");
                } else {
                    const emailSenderParams = {
                        FunctionName: process.env.emailSenderLambdaName,
                        InvocationType: 'RequestResponse',
                        Payload: JSON.stringify(formDetails, null, 2)
                    }
                    lambda.invoke(emailSenderParams, function (err, data) {
                        if (err) {
                            thisAlexa.response.speak('There was an error sending the email')
                            thisAlexa.emit(":responseReady");
                        } else {
                            thisAlexa.response.speak(speechOutput);
                            thisAlexa.emit(":responseReady");
                        }
                    });
                }
            })
        }


    },
    'AskForAnEasterEgg': function () {
        speechOutput = `I like tech I love nice hardware
        
        Internet of things and robotic underwear
        
        Build me something to scratch my sore bits
        
        Stream it live at 100gigabits
        
        I know you guys
        
        Can hack some shit for me
        
        
        Using nice APIs on borrowed credentials
        
        Who gives a fuck if it’s got potential?
        
        Scrape a ton of confidential information
        
        Publish it on pastebin hashtag bit of fun
        
        I know you can`;

        reprompt = "";
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AskForSupport': function () {
        speechOutput = `You can call AMP support at 1 800 6969`;
        
        reprompt = "";
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = "";
        reprompt = "";
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        var speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
};

exports.handle = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function delegateSlotCollection() {
    console.log("in delegateSlotCollection");
    console.log("current dialogState: " + this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
        console.log("in Beginning");
        var updatedIntent = this.event.request.intent;
        //optionally pre-fill slots: update the intent object with slot values for which
        //you have defaults, then return Dialog.Delegate with this updated intent
        // in the updatedIntent property
        this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
        console.log("in not completed");
        // return a Dialog.Delegate directive with no updatedIntent property.
        this.emit(":delegate");
    } else {
        console.log("in completed");
        console.log("returning: " + JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent;
    }
}

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return (array[i]);
}
function isSlotValid(request, slotName) {
    var slot = request.intent.slots[slotName];
    //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
    var slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        slotValue = slot.value.toLowerCase();
        return slotValue;
    } else {
        //we didn't get a value in the slot.
        return false;
    }
}
