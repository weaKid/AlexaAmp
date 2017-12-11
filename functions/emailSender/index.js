'use strict';

exports.handle = (event, context) => {

    var send = require('gmail-send')({
        user: process.env.fromUser,
        pass: process.env.fromUserPassword,
        to: process.env.toUser,
        subject: 'Alexa AMP Application Information',
        html: generateHTML(event)
    });

    send({}, function (err, res) {
        console.log('Error sending email:', err, '; res:', res);
    })
}

function generateHTML(ampInformation) {
    return '<img style="padding:20px" width="200" src="https://ukqaawp.amplifi-capital.com/app/assets/images/logo.png"/>' +
        '<h3 style="padding-left:20px">Your Alexa AMP Application Information</h3>' +
        '<table border="3" cellpadding="4">' +
        '<tr><td bgcolor="#FFE54F"><b>Title</b></td><td>' + ampInformation.Title + '</td></tr>' +
        '<tr><td bgcolor="#FFE54F"><b>First Name</b></td><td>' + ampInformation.FirstName + '</td></tr>' +
        '<tr><td bgcolor="#FFE54F"><b>Last Name</b></td><td>' + ampInformation.LastName + '</td></tr>' +
        '<tr><td bgcolor="#FFE54F"><b>Trading Name</b></td><td>' + ampInformation.TradingName + '</td></tr>' +
        '<tr><td bgcolor="#FFE54F"><b>Phone Number</b></td><td>' + ampInformation.PhoneNumber + '</td></tr>' +
        '<tr><td bgcolor="#FFE54F"><b>Total Monthly Cost</b></td><td>' + ampInformation.TotalMonthlyCost + '</td></tr>' +
        '<tr><td bgcolor="#FFE54F"><b>Average Monthly Card Sales</b></td><td>' + ampInformation.AverageMonthlyCardSales + '</td></tr>' +
        '<tr><td bgcolor="#FFE54F"><b>Monthly Costs</b></td><td>' + ampInformation.MonthlyCosts + '</td></tr>' +
        '<tr><td bgcolor="#FFE54F"><b>Requested Loan Amount</td><td>' + ampInformation.LoanAmount + '</td></tr>' +
        '</table>' +
        '<h5><i>NOTE. If you found any discrepancies between the information provided </br>' +
        'and the one displayed here, please send an email to: <a href="mailto:ovidiu.chis@xoomworks.com?Subject=Alexa Application" target="_top">ovidiu.chis@xoomworks.com</a>.</i></h5>';
}
