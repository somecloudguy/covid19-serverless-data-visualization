// Lambda function. Use nodeJS 12.X

const AWS = require('aws-sdk');
const https = require('https');
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Empty string to populate with downloaded data
let dataString = '';

// Define S3 bucket to store data
const uploadBucket = '<UPDATE: DESTINATION_BUCKET_NAME>';

// Function to download data and upload to S3
exports.handler = (event, context, callback) => {
    
    // Data is pulled from https://covidtracking.com/. Updated daily at 1600 EST
    
    // nodeJS function for HTTP GET requests. 
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
            var fileName = prefixDate + '-covid-data-test.json';
            
            // Define folder path within S3 bucket to upload the file
            var key = '<UPDATE: S3_PATH/FOLDER/>' + fileName;
            
            // Define parameters to upload to S3 based on latest key and dataString values
            const params = {
                Bucket : uploadBucket,
                Key : key,
                Body : dataString
            };

            // Put data in S3 bucket. Result will go to function callback
            s3.putObject(params, callback);

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
