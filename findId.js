const axios = require('axios');
const fs = require('fs');

// Function to fetch placeMasterId based on a search term
async function fetchPlaceMasterId(searchTerm) {
    try {
        const url = `https://www.coldwellbanker.com/api/places/search?term=${encodeURIComponent(searchTerm)}`;
        console.log(`Fetching URL: ${url}`);

        // Make the GET request
        const response = await axios.get(url);

        // Ensure the response contains valid data
        if (response.data && response.data.places && response.data.places.length > 0) {
            // Use the first place from the array
            const place = response.data.places[0];
            return {
                placeName: place.placeName,
                placeMasterId: place.placeMasterId,
                city: place.city,
                state: place.stateOrProvince,
            };
        } else {
            console.error(`No valid data found for "${searchTerm}". Response:`, response.data);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching placeMasterId for "${searchTerm}":`, error.message);
        return null;
    }
}

// Main function to process the input JSON file
async function processCities(inputFile, outputFile) {
    try {
        // Read the input file
        const data = fs.readFileSync(inputFile, 'utf-8');
        const cities = JSON.parse(data);

        // Remove the limit to process all cities
        // const limitedCities = cities.slice(0, 20); // This line is removed
        const limitedCities = cities; // Process all cities

        // Initialize an array to store results
        const results = [];

        for (const cityObj of limitedCities) {
            console.log(`Fetching data for city: ${cityObj.city}`);
            const cityData = await fetchPlaceMasterId(cityObj.city);

            // Add the data if it exists
            if (cityData) {
                results.push({
                    city: cityObj.city,
                    zip_code: cityObj.zip_code,
                    placeMasterId: cityData.placeMasterId,
                    placeName: cityData.placeName,
                    state: cityData.state,
                });
            }
        }

        // Write the results to the output file
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf-8');
        console.log(`Results saved successfully to ${outputFile}`);
    } catch (error) {
        console.error(`Error processing cities:`, error.message);
    }
}

// Specify input and output file names
const inputFile = 'city_zip.json'; // Replace with your input JSON file
const outputFile = 'masterId.json'; // The name of the output JSON file

// Call the main function
processCities(inputFile, outputFile);
