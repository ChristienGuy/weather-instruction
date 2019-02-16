import { Handler, APIGatewayEvent } from "aws-lambda";
import fetch from "node-fetch";

const { DARK_SKY_API_KEY } = process.env;
const BASE_DARK_SKY_URL = "https://api.darksky.net";

// TODO: allow excluding of certain values
const darkSky = {
  forecast: (lng: number, lat: number): string => {
    return `${BASE_DARK_SKY_URL}/forecast/${DARK_SKY_API_KEY}/${lng},${lat}?units=si`;
  }
};

const handler: Handler = async (event: APIGatewayEvent) => {
  const { lat, lng } = event.queryStringParameters;
  const res = await fetch(darkSky.forecast(Number(lat), Number(lng))).then(
    res => res.json()
  );

  const {
    daily: { data }
  } = res;

  const averageTemperature =
    data.reduce((sum, { apparentTemperatureLow }) => {
      return sum + apparentTemperatureLow;
    }, 0) / data.length;

  return {
    statusCode: 200,
    body: JSON.stringify({
      needAJacket: averageTemperature < 10
    })
  };
};

export { handler };
