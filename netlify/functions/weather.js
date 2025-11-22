export async function handler(event) {
  const API_KEY = process.env.WEATHER_API_KEY;
  const city = event.queryStringParameters.city;

  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentURL),
      fetch(forecastURL)
    ]);

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

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
