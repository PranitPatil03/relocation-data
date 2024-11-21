const axios = require("axios");
const cheerio = require("cheerio");

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
      source_city_masterid: source.masterid,
      source_city: source.name,
      destination_city_masterid: destination.masterid,
      destination_city: destination.name,
      sub_calculate: "Calculate",
    };

    // Fetch HTML
    const response = await axios.post(url, payload);
    const html = response.data;

    // Parse HTML using Cheerio
    const $ = cheerio.load(html);

    // Helper function to extract data
    function extractData(categorySelector) {
      const data = {};
      $(categorySelector).each((_, element) => {
        const label = $(element).find("h2.price-categ").text().trim();
        const sourceValue = $(element).find("p.price1").text().trim();
        const destinationValue = $(element).find("p.price2").text().trim();
        data[label] = { source: sourceValue, destination: destinationValue };
      });
      return data;
    }

    // Extract data by categories
    const housingAffordability = extractData(
      "#housing_Tabpanel .pricing-content"
    );
    const qualityOfLife = extractData("#quality_Tabpanel .pricing-content");
    const jobMarketStrength = extractData("#job_Tabpanel .pricing-content");
    const livingAffordability = extractData(
      "#living_Tabpanel .pricing-content"
    );

    // Return the formatted data
    return {
      sourceCity: source.name,
      destinationCity: destination.name,
      data: {
        "Housing Affordability": housingAffordability,
        "Quality of Life": qualityOfLife,
        "Job Market Strength": jobMarketStrength,
        "Living Affordability": livingAffordability,
      },
    };
  } catch (error) {
    console.error(
      `Error fetching data for ${source.name} to ${destination.name}:`,
      error.message
    );
    return null;
  }
}

// Main function
(async () => {
  const cities = [
    { name: "stanley", masterid: "P02500000FsoG9YAsFKGNfvMcsFOZbQTXR1eVIqd" },
    { name: "fromberg", masterid: "P02500000FsoFpHz4b2Is6cbsmwLEDrrvREzAXH2" },
  ];

  const results = [];

  for (let i = 0; i < cities.length - 1; i++) {
    console.log(
      `Fetching data for: ${cities[i].name} to ${cities[i + 1].name}`
    );
    const result = await fetchCityData(cities[i], cities[i + 1]);
    if (result) {
      results.push(result);
    }
  }

  console.log("Results:", JSON.stringify(results, null, 2));
})();
