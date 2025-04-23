export default async (request, context) => {
  return new Response("👋 Hello from the edge!", {
    status: 200,
    headers: {
      "content-type": "text/plain",
    },
  });
};