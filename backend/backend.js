const brain = require("brain.js");
// const data = require("./trainOnThis.Json");

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

const fs = require("fs");

function readTrainingData(filename) {
  try {
    const jsonData = fs.readFileSync(filename, "utf-8");
    return JSON.parse(jsonData);
  } catch (err) {
    console.error(err);
    return [];
  }
}

// scale down function
// function convertToBinary(morseCode) {
//   return morseCode.split("").map((char) => (char === "." ? 1 : 0));
// }

function writeTrainingData(filename, data) {
  try {
    // // convert the dot and dashes into 0 or 1
    // const convertedData = data.map((entry) => ({
    //   input: convertToBinary(entry.input),
    //   output: entry.output,
    // }));

    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filename, jsonData, "utf-8");
    console.log("Success write");
  } catch (err) {
    console.error("Error ", err);
  }
}

// const oldData = readtraingData("trainOnThis.Json");

// const newData = {
//   input: "... --- ...",
//   output: "SOS",
// };

// oldData.push(newData);

// writeTrainingData("trainOnThis.Json", oldData);

// console.log(readtraingData("trainOnThis.Json"));

const trainingData = readTrainingData("trainOnThis.Json");
console.log(trainingData);
const network = new brain.recurrent.LSTM();

network.train(trainingData, {
  iterations: 1000,
  //   logPeriod: 1000,
  errorThresh: 0.005,
  log: (stats) => console.log(stats),
});

console.log("Value: ", network.run(".-"));
