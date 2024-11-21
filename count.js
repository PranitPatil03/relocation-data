const fs = require('fs');

// Function to count items in JSON
function countItemsInJson(filePath) {
    try {
        // Read the JSON file
        const data = fs.readFileSync(filePath, 'utf-8');
        // Parse the JSON data
        const jsonArray = JSON.parse(data);
        // Count the items
        const count = jsonArray.length;
        console.log(`Total items in the JSON file: ${count}`);
    } catch (error) {
        console.error('Error reading or processing the JSON file:', error.message);
    }
}

// Specify the file path
const filePath = 'city_zip.json'; // Replace with your JSON file name

// Call the function
countItemsInJson(filePath);
