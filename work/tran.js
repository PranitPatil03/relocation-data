const fs = require("fs");

// Function to transform data
function transformData(inputFile, outputFile) {
  try {
    // Read the input JSON file
    const rawData = fs.readFileSync(inputFile, "utf-8");
    const jsonData = JSON.parse(rawData);

    // Initialize the transformed data object
    const transformedData = {};

    // Process each entry in the input data
    jsonData.forEach((entry) => {
      const sourceCityName = entry.sourceCity;
      const destinationCityName = entry.destinationCity;

      // Add source city data
      transformedData[sourceCityName] = {
        data: entry.sourceCityData,
      };

      // Add destination city data
      transformedData[destinationCityName] = {
        data: entry.destinationCityData,
      };
    });

    // Write the transformed data to the output file
    fs.writeFileSync(
      outputFile,
      JSON.stringify(transformedData, null, 2),
      "utf-8"
    );
    console.log(`Transformed data saved successfully to ${outputFile}`);
  } catch (error) {
    console.error("Error in transforming data:", error.message);
  }
}

// Specify input and output files
const inputFile = "./results_temp.json"; // Replace with your input JSON file
const outputFile = "transformed_data.json"; // Output file name

// Call the function to transform the data
transformData(inputFile, outputFile);
