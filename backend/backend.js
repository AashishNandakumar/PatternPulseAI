const brain = require("brain.js");
const fs = require("fs");
var mysql = require("mysql");
const { connection, createTable, createDatabase } = require("./database");
const { log } = require("console");

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

const callNeural = (trainingData, morseCode1) => {
  // const trainingData = readTrainingData("dataset.json");
  // console.log(trainingData);
  // console.log("training data: ", trainingData);
  const configuration = { hiddenLayers: [5, 10], learningRate: 0.3 };
  const network = new brain.recurrent.LSTM(configuration);

  network.train(trainingData, {
    iterations: 100,
    //   logPeriod: 1000,
    errorThresh: 0.005,
    // log: (stats) => console.log(stats),
  });

  //! storing the trained data offline, so u can bring it back to use, instead training the data again and again
  // const trainedModel = network.toJSON();
  storeOfflineNeuralNetwork(network);

  // console.log("trained model: ", trainedModel);

  // test
  // console.log("Value: ", network.run(morseCode1));
};

// * function to store the trained neural network offline
function storeOfflineNeuralNetwork(network) {
  const nerualNetworkJSON = network.toJSON();

  const jsonData = JSON.stringify(nerualNetworkJSON, null, 2);

  // store the above in OfflineNeuralNet.json
  fs.writeFileSync("OfflineNeuralNet.json", jsonData, "utf-8");
  // console.log(nerualNetworkJSON);
}

// * for mysql get and set methods

function insertData(data) {
  const sql = `INSERT IGNORE INTO training_data (input, output) VALUES ?`;

  const values = data.map((item) => [item.input, item.output]);

  connection.query(sql, [values], (err) => {
    if (err) console.error("error inserting data ", err);
    else console.log("data inserted successfully");
  });
}

function fetchData(callback) {
  const sql = `SELECT input, output FROM training_data`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Couldn't read data from the DB ", err);
      callback(err, null);
    } else {
      console.log("Data fetched successfully");
      // console.log(result);
      const formatData = result.map((row) => {
        return { input: row.input, output: row.output };
      });

      callback(null, formatData);
    }
  });
}

function main() {
  // * Increase training dataset
  // for (let i = 0; i < 1000; i++) {
  //   let val = setTrainingData();
  //   if (val) {
  //     console.log("Success in writing data: ", i + 1);
  //   } else {
  //     console.log("Unsuccessfull in writing data: ", i + 1);
  //   }
  // }
  // callNeural("-. ---");

  // createDatabase();
  // createTable();

  // * Inserting data into sql
  // const trainingData = [];

  // for (let i = 0; i < 50000; i++) {
  //   let data = getTrainingData();
  //   trainingData.push(data);
  // }
  // insertData(trainingData);

  // * fetch the training data from sql and push it to the neural network
  fetchData((err, data) => {
    if (err) console.error("Error fetchng data ", err);
    else {
      // console.log(data);
      callNeural(data, "..-");
    }
  });
}

main();
