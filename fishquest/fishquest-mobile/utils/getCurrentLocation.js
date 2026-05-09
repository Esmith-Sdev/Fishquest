import * as Location from "expo-location";

function getWeatherLabel(code) {
  if (code === 0) return "clear";

  if ([1, 2, 3].includes(code)) {
    return "Cloudy";
  }

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return "Rainy";
  }

  if ([95, 96, 99].includes(code)) {
    return "Stormy";
  }

  return "Clear";
}

export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission denied");
  }

  const location = await Location.getCurrentPositionAsync({});

  const { latitude, longitude } = location.coords;

  const reverseGeocode = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  const place = reverseGeocode[0];

  // WEATHER FETCH
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`,
  );

  const weatherData = await weatherRes.json();

  return {
    latitude,
    longitude,

    city: place?.city || "",
    state: place?.region || "",
    address: place?.street || "",

    temp: weatherData.current.temperature_2m,

    weather: getWeatherLabel(weatherData.current.weather_code),
    wind: weatherData.current.wind_speed_10m,
  };
}
