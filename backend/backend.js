const brain = require("brain.js");
const fs = require("fs");

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
function readTrainingData(filename) {
  try {
    const jsonData = fs.readFileSync(filename, "utf-8");
    return JSON.parse(jsonData);
  } catch (err) {
    console.error(err);
    return [];
  }
}

// create random words, pass it onto the (words->morse) converter, push the results into dataset
const randomWords = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let res = "";
  const charLength = characters.length;
  for (let i = 0; i < length; i++) {
    res += characters.charAt(Math.floor(Math.random() * charLength));
  }

  return res;
};

const textToMorse = (text) => {
  const morseCodeDictionary = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
  };

  text = text.toUpperCase();
  // text = text.replace(/\s/g, "/");

  const words = text.split(" ");
  const morseCodeArray = words.map((word) =>
    word
      .split("")
      .map((char) => morseCodeDictionary[char] || char)
      .join(" ")
  );
  return morseCodeArray.join(" / ");
};

const getTrainingData = () => {
  let rand = "";
  let range = Math.floor(Math.random() * 5) + 1;
  // currently let us train over 1 word
  range = 1;
  for (let i = 0; i < range; i++) {
    let wordLength = Math.floor(Math.random() * 10) + 1;

    // 1 word with length 2(2 characters)
    wordLength = 2;
    rand += randomWords(wordLength);
    if (i + 1 < range) {
      rand += " ";
    }
  }
  const randMorse = textToMorse(rand);
  return { input: randMorse, output: rand };
};

const setTrainingData = () => {
  try {
    const data = getTrainingData();
    const existingData = fs.readFileSync("dataset.json", "utf-8");
    let parsedExistingData = JSON.parse(existingData);

    parsedExistingData.push(data);
    const jsonData = JSON.stringify(parsedExistingData, null, 2);
    fs.writeFileSync("dataset.json", jsonData, "utf-8");

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// setTrainingData();

const callNeural = (morseCode1) => {
  const trainingData = readTrainingData("dataset.json");
  console.log(trainingData);

  const configuration = { hiddenLayers: [5, 10], learningRate: 0.3 };
  const network = new brain.recurrent.LSTM(configuration);

  network.train(trainingData, {
    iterations: 120,
    //   logPeriod: 1000,
    errorThresh: 0.005,
    log: (stats) => console.log(stats),
  });

  // test
  console.log("Value: ", network.run(morseCode1));
};

function main() {
  // * Increase trainning dataset
  // for (let i = 0; i < 1000; i++) {
  //   let val = setTrainingData();
  //   if (val) {
  //     console.log("Success in writing data: ", i + 1);
  //   } else {
  //     console.log("Unsuccessfull in writing data: ", i + 1);
  //   }
  // }

  callNeural("-. ---");
}

main();
