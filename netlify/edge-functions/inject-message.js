import {
    createInstance
} from '@optimizely/optimizely-sdk/dist/optimizely.lite.es';

// Helper function to generate a UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export default async (request, context) => {
    console.log("OPTLY: Edge function triggered!");

    // Check for visitorUUID in cookies
    const cookies = request.headers.get("cookie") || "";
    let visitorUUID = cookies
        .split(";")
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith("visitorUUID="))
        ?.split("=")[1];

    // If visitorUUID doesn't exist, create a new one
    if (!visitorUUID) {
        visitorUUID = generateUUID();
        console.log("Generated new visitorUUID:", visitorUUID);

        // Set the new visitorUUID in the response headers
        context.cookies.set("visitorUUID", visitorUUID, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });
    } else {
        console.log("Existing visitorUUID found:", visitorUUID);
    }

    console.log("Featching the datafile from the serverless function...");
    // Fetch the Optimizely datafile
    const res = await fetch(`${request.url}/netlify/functions/datafile`);
    const datafile = await res.json();

    console.log("creating the Optimizely client instance...");
    const optimizelyClient = createInstance({
        datafile: datafile
    });

    let optimizelyUser = optimizelyClient.createUserContext(visitorUUID);

    console.log("getting optimizely decision...");
    const decision = optimizelyUser.decide("netlify_experiment");
    console.log("Decision:", decision);

    const backgroundColor = decision.variables?.background_color;
    console.log("Background color from Optimizely:", backgroundColor);

    const response = await context.next();

    // Ensure the response body is a string
    const originalBody = await response.text();

    // Inject the message into the <body> tag with the dynamic background color
    const modifiedBody = originalBody.replace(
        /<body([^>]*)>/,
        `<body$1><div style="background: ${backgroundColor}; padding: 1em;">🔥 Injected at the edge! Visitor UUID: ${visitorUUID}</div>`
    );

    // Return the modified response
    return new Response(modifiedBody, {
        status: response.status,
        headers: {
            ...Object.fromEntries(response.headers),
            "content-type": "text/html",
        },
    });
};
