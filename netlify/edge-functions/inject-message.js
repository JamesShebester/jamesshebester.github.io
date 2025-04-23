export default async (request, context) => {

    console.log("OPTLY: Edge function triggered!");
    const response = await context.next();

    const newHeaders = new Headers(response.headers);
    newHeaders.set("content-type", "text/html");

    const rewriter = new HTMLRewriter()
        .on("body", {
            element(el) {
                el.append(`<div style="background: yellow; padding: 1em;">🔥 Injected at the edge!</div>`, {
                    html: true,
                });
            },
        });

    return rewriter.transform(
        new Response(response.body, {
            status: response.status,
            headers: newHeaders,
        })
    );
};
