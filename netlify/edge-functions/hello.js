export default async (request, context) => {
  const response = await context.next();

  const rewriter = new HTMLRewriter()
    .on("body", {
      element(element) {
        element.append(`<div style="background: yellow; padding: 1em;">🔥 Special message at the edge!</div>`, {
          html: true,
        });
      },
    });

  return rewriter.transform(response);
};