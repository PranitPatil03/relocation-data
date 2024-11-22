const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// Function to fetch and parse data for a given city pair
async function fetchCityData(source, destination) {
  try {
    const url = "https://cbprod.g-co.agency/move-meter/getMovemeterScore";
    const payload = {
      _token: "oqlcMjhCkqTUnKb9fuS4ZelZznrRgJqbujz6V0Ik",
      version: "v1",
      domain: "",
      para: "getMovemeterScore",
      versionStatus: "",
      submit_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      source_city_masterid: source.placeMasterId,
      source_city: source.city,
      destination_city_masterid: destination.placeMasterId,
      destination_city: destination.city,
      sub_calculate: "Calculate",
    };

    // Fetch HTML
    const response = await axios.post(url, payload);
    const html = response.data;

    // Parse HTML using Cheerio
    const $ = cheerio.load(html);

    // Helper function to extract data
    function extractData(categorySelector, key) {
      const data = {};
      $(categorySelector).each((_, element) => {
        const label = $(element).find("h2.price-categ").text().trim();
        const value = $(element).find(`p.${key}`).text().trim();
        data[label] = value;
      });
      return data;
    }

    // Extract data for source and destination
    const sourceData = {
      "Housing Affordability": extractData(
        "#housing_Tabpanel .pricing-content",
        "price1"
      ),
      "Quality of Life": extractData("#quality_Tabpanel .pricing-content", "price1"),
      "Job Market Strength": extractData(
        "#job_Tabpanel .pricing-content",
        "price1"
      ),
      "Living Affordability": extractData(
        "#living_Tabpanel .pricing-content",
        "price1"
      ),
    };

    const destinationData = {
      "Housing Affordability": extractData(
        "#housing_Tabpanel .pricing-content",
        "price2"
      ),
      "Quality of Life": extractData(
        "#quality_Tabpanel .pricing-content",
        "price2"
      ),
      "Job Market Strength": extractData(
        "#job_Tabpanel .pricing-content",
        "price2"
      ),
      "Living Affordability": extractData(
        "#living_Tabpanel .pricing-content",
        "price2"
      ),
    };

    // Return the formatted data
    return {
      sourceCity: source.city,
      destinationCity: destination.city,
      sourceCityData: sourceData,
      destinationCityData: destinationData,
    };
  } catch (error) {
    console.error(
      `Error fetching data for ${source.city} to ${destination.city}:`,
      error.message
    );
    return null;
  }
}

// Main function
(async () => {
  try {
    // Read source and destination files
    const sourceFile = "./data/source.json"; // Replace with your actual source file
    const destinationFile = "./data/destination.json"; // Replace with your actual destination file

    const sourceData = JSON.parse(fs.readFileSync(sourceFile, "utf-8"));
    const destinationData = JSON.parse(fs.readFileSync(destinationFile, "utf-8"));

    // Validate file lengths
    if (sourceData.length !== destinationData.length) {
      throw new Error(
        "Source and destination files must have the same number of entries."
      );
    }

    const results = [];
    const totalPairs = sourceData.length;

    // Process each city pair
    for (let i = 0; i < sourceData.length; i++) {
      console.log(
        `Processing pair ${i + 1} of ${totalPairs}: ${sourceData[i].city} to ${destinationData[i].city}`
      );
      const result = await fetchCityData(sourceData[i], destinationData[i]);
      if (result) {
        results.push(result);
        console.log(`Data fetched successfully for: ${sourceData[i].city} to ${destinationData[i].city}`);
      } else {
        console.warn(`Skipping pair due to error: ${sourceData[i].city} to ${destinationData[i].city}`);
      }
    }

    // Save results to a file
    const outputFile = "results.json";
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), "utf-8");
    console.log(`\nResults saved successfully to ${outputFile}`);
  } catch (error) {
    console.error("Error in processing:", error.message);
  }
})();
