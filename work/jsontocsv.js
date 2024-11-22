const fs = require("fs");
const { parse } = require("json2csv");

// Function to convert JSON to CSV with grouped headers
function convertJsonToCsvWithGroups(jsonFile, csvFile) {
  try {
    // Read and parse the JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));

    // Define the fields with group headers
    const fields = [
      { label: "id", value: "id" },
      { label: "zip_code", value: "zip_code" },
      { label: "city", value: "city" },
      { label: "state_code", value: "state_code" },
      { label: "state_name", value: "state_name" },
      {
        label: "Housing Affordability",
        value: "",
        children: [
          { label: "Home Price", value: "data.Housing Affordability.Home Price" },
          { label: "Property Tax", value: "data.Housing Affordability.Property Tax" },
          {
            label: "Home Appreciation Rate",
            value: "data.Housing Affordability.Home Appreciation Rate",
          },
          { label: "Price Per Square Foot", value: "data.Housing Affordability.Price Per Square Foot" },
        ],
      },
      {
        label: "Quality of Life",
        value: "",
        children: [
          { label: "Education", value: "data.Quality of Life.Education" },
          { label: "Healthcare + Fitness", value: "data.Quality of Life.Healthcare + Fitness" },
          { label: "Weather Grade", value: "data.Quality of Life.Weather Grade" },
          { label: "Air Quality Index", value: "data.Quality of Life.Air Quality Index" },
          { label: "Commute / Transit Score", value: "data.Quality of Life.Commute / Transit Score" },
          { label: "Accessibility", value: "data.Quality of Life.Accessibility" },
          { label: "Culture / Entertainment", value: "data.Quality of Life.Culture / Entertainment" },
        ],
      },
      {
        label: "Job Market Strength",
        value: "",
        children: [
          { label: "Unemployment Rate", value: "data.Job Market Strength.Unemployment Rate" },
          { label: "Recent Job Growth", value: "data.Job Market Strength.Recent Job Growth" },
          { label: "Future Job Growth Index", value: "data.Job Market Strength.Future Job Growth Index" },
          { label: "Median Household Income", value: "data.Job Market Strength.Median Household Income" },
        ],
      },
      {
        label: "Living Affordability",
        value: "",
        children: [
          { label: "State Income Tax", value: "data.Living Affordability.State Income Tax" },
          { label: "Utilities", value: "data.Living Affordability.Utilities" },
          { label: "Food / Groceries", value: "data.Living Affordability.Food / Groceries" },
          { label: "Sales Tax", value: "data.Living Affordability.Sales Tax" },
          { label: "Transportation Cost", value: "data.Living Affordability.Transportation Cost" },
        ],
      },
    ];

    // Prepare grouped headers
    const parentHeaders = fields.map((field) =>
      field.children
        ? Array(field.children.length).fill(field.label)
        : field.label
    ).flat();

    const childHeaders = fields.map((field) =>
      field.children ? field.children.map((child) => child.label) : field.label
    ).flat();

    // Flatten the data
    const flattenedData = jsonData.map((entry) => {
      const row = {};
      fields.forEach((field) => {
        if (field.children) {
          field.children.forEach((child) => {
            row[child.label] = child.value.split('.').reduce((o, i) => o?.[i], entry);
          });
        } else {
          row[field.label] = field.value.split('.').reduce((o, i) => o?.[i], entry);
        }
      });
      return row;
    });

    // Combine grouped headers and child headers
    const csv = [parentHeaders.join(","), childHeaders.join(",")]
      .concat(flattenedData.map((row) => Object.values(row).join(",")))
      .join("\n");

    // Write the CSV to a file
    fs.writeFileSync(csvFile, csv, "utf-8");
    console.log(`CSV file saved to ${csvFile}`);
  } catch (error) {
    console.error("Error converting JSON to CSV:", error.message);
  }
}

// Specify the input JSON and output CSV file paths
const inputJsonFile = "./updated_output.json"; // Replace with your JSON file
const outputCsvFile = "./output.csv"; // Replace with your desired CSV file name

// Call the function to convert JSON to CSV with grouped headers
convertJsonToCsvWithGroups(inputJsonFile, outputCsvFile);
