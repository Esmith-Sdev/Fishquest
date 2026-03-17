export async function getCurrentLocation() {
  //get coordinates
  const position = await new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
  const { latitude, longitude } = position.coords;

  //reverse geocode
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error("Failed to reverse geocode location");
  }
  const data = await res.json();
  const addr = data.address || {};
  const streetAddress = [addr.house_number, addr.road]
    .filter(Boolean)
    .join(" ");
  return {
    latitude,
    longitude,
    streetAddress: streetAddress || "",
    fullAddress: data.display_name || "",
    city: addr.city || addr.town || addr.village || addr.hamlet || "",
    state: addr.state || "",
  };
}
