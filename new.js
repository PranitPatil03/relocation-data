const fs = require("fs");

function splitJsonFile(inputFile, outputPrefix, chunkSize) {
  try {
    // Read and parse the JSON file
    const jsonData = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

    // Calculate the total number of chunks
    const totalChunks = Math.ceil(jsonData.length / chunkSize);

    if (totalChunks < 16) {
      throw new Error("Insufficient data to create 16 files with the specified chunk size.");
    }

    // Split the data into chunks and write to files
    for (let i = 0; i < 16; i++) {
      const chunk = jsonData.slice(i * chunkSize, (i + 1) * chunkSize);
      const type = i < 8 ? "source" : "destination"; // First 8 files are source, next 8 are destination
      const fileName = `${outputPrefix}_${type}_${i + 1}.json`;

      // Write the chunk to a new file
      fs.writeFileSync(fileName, JSON.stringify(chunk, null, 2), "utf-8");
      console.log(`Created file: ${fileName} with ${chunk.length} entries.`);
    }

    console.log("All files created successfully!");
  } catch (error) {
    console.error("Error splitting JSON file:", error.message);
  }
}

// Input JSON file and settings
const inputFile = "masterId.json"; // Replace with your actual file path
const outputPrefix = "data"; // Prefix for output files
const chunkSize = 1834; // Number of entries per file

// Call the function to split the file
splitJsonFile(inputFile, outputPrefix, chunkSize);
