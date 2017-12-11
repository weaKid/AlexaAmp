const AWS = require("aws-sdk");
const uuidv4 = require('uuid/v4');

exports.handle = (event, context, callback) => {
    AWS.config.update({
        region: "eu-west-1"
    });
    console.log('Lambda Persistence Received event:', JSON.stringify(event, null, 2));

    const docClient = new AWS.DynamoDB.DocumentClient();

    const id = uuidv4();
    const { firstName, lastName, title, businessTradingName, businessPhoneNumber, totalMonthlySales, averageMonthlyCardSales, monthlyCosts, loanAmount } = event;

    var params = {
        TableName: process.env.usersTableName,
        Item: {
            "Id": id,
            "firstName": firstName,
            "lastName": lastName,
            "title": title,
            "businessTradingName": businessTradingName,
            "businessPhoneNumber": businessPhoneNumber,
            "totalMonthlySales": totalMonthlySales,
            "averageMonthlyCardSales": averageMonthlyCardSales,
            "monthlyCosts": monthlyCosts,
            "loanAmount": loanAmount
        }
    };

    console.log("Adding a new item...");

    docClient.put(params).promise()
        .then(result => callback(null, result))
        .catch(err => callback(err));
};