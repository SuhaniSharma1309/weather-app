import fetch from "node-fetch";

export async function handler(event) {
  const API_KEY = process.env.WEATHER_API_KEY;
  const city = event.queryStringParameters.city;

  if (!city) {
    return { statusCode: 400, body: JSON.stringify({ error: "City is required" }) };
  }

  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentURL),
      fetch(forecastURL)
    ]);

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    // ❗ If city is invalid
    if (current.cod !== 200 || forecast.cod !== "200") {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "City not found" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ current, forecast })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Backend error" })
    };
  }
}
