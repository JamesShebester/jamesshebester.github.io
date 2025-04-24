export default async (request, context) => {
    console.log("OPTLY: Edge function triggered!");
    const response = await context.next();

    // Ensure the response body is a string
    const originalBody = await response.text();

    // Inject the message into the <body> tag
    const modifiedBody = originalBody.replace(
        /<body([^>]*)>/,
        `<body$1><div style="background: yellow; padding: 1em;">🔥 Injected at the edge!</div>`
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
