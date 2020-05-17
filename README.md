# Automated COVID-19 Data Visualization using AWS

## What is this?

This is a serverless solution built using AWS to automatically collect, store, and visualize COVID-19 related public data

## Why do I want this?

There is a vast amount of data around the number of COVID-19 cases, deaths, hospitalizations and testing available online. If you are a researcher, healthcare professional, or just a curious individual who would like to be able to collect this data, analyze it and visualize it to observe trends and metrics, you are the right audience for this solution.

## How do I build this?

Follow the instructions below. It assumes you have a basic understanding of AWS and have an AWS account.

### Step 1: Bookmark the source of data

Source data is available at https://covidtracking.com/api in CSV and JSON format. We will pull historic daily states data in JSON, but you can choose whichever dataset you are interested in

### Step 2: Create a Lambda function

Create a new Lambda function from scratch. Select nodeJS 12.X as the language, and give it an IAM role with read and write access to S3

Copy [this code]() into the Lambda function, and update the DESTINATION_BUCKET to an S3 bucket of your choice

### Step 3: Create a new analysis in QuickSight

Make sure QuickSight has access to read your S3 bucket. Go to Manage QuickSight on top-right of the console, making sure you are **in N. Virginia region** irrespective of where your S3 and QuickSight is running, review permissions and make sure your S3 bucket is checked in the list

In QuickSight, create New Analysis, New data source, and select S3 as the data source. Download [this sample manifest file], update it with the location of data on your S3 bucket, and upload it to QuickSight. 

QuickSight will preview the data it has pulled from S3. Review all data fields and edit if any of them have incorrect data types, especially remember to update "date" field from *number* to *date* type with yyyyMMdd format

All the data is available now in QuickSight. Go creative with creating whatever types of charts you'd like to see. Here is an example-

![QuickSight Chart Example](https://octodex.github.com/images/yaktocat.png)


