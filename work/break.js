const fs = require("fs");

function splitJsonFile(inputFile, outputFile1, outputFile2) {
  try {
    // Read the JSON file
    const data = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

    // Calculate the split index
    const midIndex = Math.ceil(data.length / 2);

    // Split the data into two parts
    const part1 = data.slice(0, midIndex);
    const part2 = data.slice(midIndex);

    // Write the parts to separate files
    fs.writeFileSync(outputFile1, JSON.stringify(part1, null, 2), "utf-8");
    fs.writeFileSync(outputFile2, JSON.stringify(part2, null, 2), "utf-8");

    console.log(`Data successfully split into ${outputFile1} and ${outputFile2}`);
  } catch (error) {
    console.error("Error splitting JSON file:", error.message);
  }
}

// Specify input and output file names
const inputFile = "./masterId.json"; // Replace with your input JSON file
const outputFile1 = "./data/source.json"; // First output file
const outputFile2 = "./data/destination.json"; // Second output file

// Call the function
splitJsonFile(inputFile, outputFile1, outputFile2);
