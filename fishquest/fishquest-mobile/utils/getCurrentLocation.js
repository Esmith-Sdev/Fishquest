import * as Location from "expo-location";

export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission was denied");
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const { latitude, longitude } = position.coords;

  const result = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  const addr = result[0] || {};
  const streetAddress = [addr.streetNumber, addr.street]
    .filter(Boolean)
    .join(" ");

  return {
    latitude,
    longitude,
    streetAddress: streetAddress || "",
    fullAddress: "",
    city: addr.city || addr.subregion || "",
    state: addr.region || "",
  };
}
