import { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, Pressable, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS } from "../constants/theme";
import { getCurrentLocation } from "../utils/getCurrentLocation";
import { ActivityIndicator } from "react-native";

export default function ForecastModal({ visible, onClose }) {
  const [loading, setLoading] = useState(true);
  const [temp, setTemp] = useState("");
  const [weather, setWeather] = useState("");
  const [wind, setWind] = useState("");
  const [city, setCity] = useState("");
  const [locationState, setLocationState] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");

  useEffect(() => {
    if (!visible) return;

    async function loadWeather() {
      setLoading(true);

      try {
        const data = await getCurrentLocation();

        setLocationState(data.state);
        setCity(data.city);
        setTemp(data.temp);
        setWeather(data.weather);
        setWind(data.wind);
        setWeatherIcon(getWeatherIcon(data.weather));
      } catch {
        setWeather("");
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, [visible]);

  function getWeatherIcon(weather) {
    const normalizedWeather = String(weather || "").toLowerCase();

    if (normalizedWeather === "clear") {
      return require("../assets/images/icons/weather/sun.png");
    }

    if (normalizedWeather === "cloudy") {
      return require("../assets/images/icons/weather/cloudy.png");
    }

    if (normalizedWeather === "rainy") {
      return require("../assets/images/icons/weather/rainy.png");
    }

    if (normalizedWeather === "stormy") {
      return require("../assets/images/icons/weather/stormy.png");
    }

    return require("../assets/images/icons/weather/sun.png");
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={styles.overlay}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={styles.modalCard}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Fishing Forecast</Text>
            <View style={{ position: "absolute", right: -10, top: -10 }}>
              <Pressable onPress={onClose} style={styles.button}>
                <MaterialIcons
                  name="cancel"
                  size={30}
                  color={COLORS.secondary}
                />
              </Pressable>
            </View>
          </View>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <View style={styles.column}>
              <Image source={weatherIcon} style={styles.weatherImage} />
              <Text style={styles.weatherText}>{weather}</Text>
              <Text style={styles.tempText}>{temp}°</Text>
              <Text style={styles.windText}>Wind: {wind}MPH</Text>
              <Text style={styles.locationText}>
                {city}, {locationState}
              </Text>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  locationText: {
    fontSize: 14,
    fontFamily: "Rubik",
  },
  tempText: {
    fontSize: 30,
    fontFamily: "Rubik",
  },
  weatherText: {
    fontSize: 15,
    fontFamily: "Rubik",
  },
  windText: {
    fontSize: 15,
    fontFamily: "Rubik",
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
  modalCard: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    height: 300,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#dedede",
  },
  title: {
    fontSize: 18,
    fontFamily: "Jua",
    paddingBottom: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 25,
  },

  orangeButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
    zIndex: 10,
  },
  weatherImage: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginTop: 16,
  },
  blueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: COLORS.primaryDropShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
    zIndex: 10,
  },
  buttonText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 15,
    textAlign: "center",
  },
});
