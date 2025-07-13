import axios from "axios";

const API_KEY = "df8a98a451mshcf053dbb1d0a300p1316b6jsnc5fc3d394c49";
const API_HOST = "wft-geo-db.p.rapidapi.com";

export const fetchCitySuggestions = async (query) => {
  if (!query) return [];

  try {
    const res = await axios.get(
      `https://${API_HOST}/v1/geo/cities?namePrefix=${query}&limit=5&types=CITY`,
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST,
        },
      }
    );

    return res.data.data.map((city) => `${city.city}, ${city.country}`);
  } catch (error) {
    console.error("GeoDB error:", error.message);
    return [];
  }
};
