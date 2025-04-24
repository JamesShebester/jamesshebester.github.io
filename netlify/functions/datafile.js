import fetch from "node-fetch";

let cachedDatafile = null; // Cache for the datafile
let cacheTimestamp = null; // Timestamp of the last fetch
const TTL = 5 * 60 * 1000; // Time-to-live in milliseconds (5 minutes)

exports.handler = async (event, context) => {
    const datafileUrl = "https://cdn.optimizely.com/datafiles/FN6PNAH4J4dcZQDj6epN5.json"; // Replace with your actual Optimizely datafile URL

    try {
        // Check if the cache is still valid
        const now = Date.now();
        if (cachedDatafile && cacheTimestamp && now - cacheTimestamp < TTL) {
            console.log("Returning cached datafile");
            return {
                statusCode: 200,
                body: JSON.stringify(cachedDatafile),
            };
        }

        // Fetch the datafile from Optimizely
        console.log("Fetching new datafile from Optimizely...");
        const response = await fetch(datafileUrl);

        if (!response.ok) {
            console.error("Failed to fetch Optimizely datafile:", response.status, response.statusText);
            return {
                statusCode: response.status,
                body: `Failed to fetch Optimizely datafile: ${response.statusText}`,
            };
        }

        // Parse and cache the datafile
        cachedDatafile = await response.json();
        cacheTimestamp = now;
        console.log("Fetched and cached new datafile");

        return {
            statusCode: 200,
            body: JSON.stringify(cachedDatafile),
        };
    } catch (error) {
        console.error("Error fetching Optimizely datafile:", error);

        // If an error occurs, return the cached datafile if available
        if (cachedDatafile) {
            console.log("Returning cached datafile due to error");
            return {
                statusCode: 200,
                body: JSON.stringify(cachedDatafile),
            };
        }

        return {
            statusCode: 500,
            body: "Internal Server Error",
        };
    }
};
