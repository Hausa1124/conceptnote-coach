// netlify/functions/submit.js
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const res = await fetch(process.env.MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If API key auth is enabled in Make, Netlify will inject this env var.
        "x-make-secret": process.env.MAKE_WEBHOOK_SECRET || ""
      },
      body: event.body
    });
    const text = await res.text();
    return { statusCode: res.status, body: text };
  } catch (e) {
    return { statusCode: 500, body: `Proxy error: ${e.message}` };
  }
}