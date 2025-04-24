const datafileUrl = "https://cdn.optimizely.com/datafiles/FN6PNAH4J4dcZQDj6epN5.json";

exports.handler = async (event, context) => {
    let cachedDatafile = null;
    let cacheTimestamp = null;
    const TTL = 5 * 60 * 1000; // 5 minutes

    try {
        const now = Date.now();
        if (cachedDatafile && cacheTimestamp && now - cacheTimestamp < TTL) {
            console.log("Returning cached datafile");
            return {
                statusCode: 200,
                body: JSON.stringify(cachedDatafile),
            };
        }

        console.log("Fetching new datafile from Optimizely...");
        const response = await fetch(datafileUrl);

        if (!response.ok) {
            console.error("Failed to fetch Optimizely datafile:", response.status, response.statusText);
            return {
                statusCode: response.status,
                body: `Failed to fetch Optimizely datafile: ${response.statusText}`,
            };
        }

        cachedDatafile = await response.json();
        cacheTimestamp = now;

        return {
            statusCode: 200,
            body: JSON.stringify(cachedDatafile),
        };
    } catch (error) {
        console.error("Error fetching Optimizely datafile:", error);

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
