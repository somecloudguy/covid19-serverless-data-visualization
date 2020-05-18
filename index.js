// Lambda function. Use nodeJS 12.X
//LAST UPDATED: 2020-05-18

// Define required libraries
const AWS = require('aws-sdk');
const https = require('https');
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Empty string to populate with downloaded data
let dataString = '';

// Define AWS locations that don't change between each execution of function
const uploadBucket = '<S3_BUCKET_NAME>';

// Function to download data and upload to S3
exports.handler = (event, context, callback) => {
    
    // Data is pulled from https://covidtracking.com/. Updated daily at 1600 EST
    
    // Standard nodeJS function for HTTP GET requests. 
    // Receives data in chunks and concatenates until complete
    const req = https.get("https://covidtracking.com/api/v1/states/daily.json", function(res) {
        res.on('data', chunk => {
        dataString += chunk;
        });
        // After dataString is populated with downloaded data, execute the following-
        res.on('end', () => {

            // Write downloaded file size for reference
            console.log('Data downloaded size:', dataString.length);
            
            // Get today's date to create unique filename for each day's data file
            var todayYear = new Date().getFullYear();
            var todayMonth = new Date().getMonth() + 1;
            var todayDate = new Date().getUTCDate();
            var prefixDate = todayYear + '-' + todayMonth + '-' + todayDate;

            // Define full path within S3 bucket to upload the daily files
            var dailyKey = '<S3_FOLDER_PATH>/archive/' + prefixDate + '-covid-data.json';

            // Define full path within S3 bucket to upload the master file
            var masterKey = '<S3_FOLDER_PATH>/data/master-covid-data.json';
            
            // Define parameters for daily files
            const dailyParams = {
                Bucket : uploadBucket,
                Key : dailyKey,
                Body : dataString
            };

            // Define parameters for master file
            const masterParams = {
                Bucket : uploadBucket,
                Key : masterKey,
                Body : dataString
            };
            // Put daily file in S3
            s3.putObject(dailyParams, callback);
            // Put master file in S3
            s3.putObject(masterParams, callback);

            // Write uploaded file size to verify against downloaded file size
            console.log('Data uploaded size:', dataString.length);  

            //Empty dataString to prevent old data from being re-uploaded on next execution
            dataString = '';
        });
    });
    // If error, print error message
    req.on('error', (e) => {
        console.error(e);
    });

    // Write to Cloudwatch logs
    console.log('Received event:', event);
};
