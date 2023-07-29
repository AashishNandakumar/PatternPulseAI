const brain = require("brain.js");

/*  Traditional way of reading data from a file
    const fs = require("fs");

    let inputData, outputData;

    async function readDataFromFileA() {
    try {
        fs.readFile("data1_morseCode.txt", "utf-8", (err, data) => {
        inputData = data;
        console.log("Data from 1:\n", inputData);
        });
    } catch (err) {
        console.log(err);
        inputData = null;
    }
    }

    async function readDataFromFileB() {
    try {
        fs.readFile("data2_morseCodeInterpretation.txt", "utf-8", (err, data) => {
        outputData = data;
        console.log("Data from 2:\n", outputData);
        });
    } catch (err) {
        console.log(err);
        outputData = null;
    }
    }

    function processData() {
    if (inputData && outputData) {
        console.log("processing");
    } else {
        console.log("Data not yet loaded");
    }
    }

    async function main() {
    // read data from file A and B concurrently
    await Promise.all([readDataFromFileA(), readDataFromFileB()]);

    processData();

    console.log(inputData, outputData);
    }

    main();
*/
