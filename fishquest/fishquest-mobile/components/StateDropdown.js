import { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import { COLORS } from "../constants/theme";
const STATES = [
  { label: "AL", value: "AL" },
  { label: "AK", value: "AK" },
  { label: "AZ", value: "AZ" },
  { label: "AR", value: "AR" },
  { label: "CA", value: "CA" },
  { label: "CO", value: "CO" },
  { label: "CT", value: "CT" },
  { label: "DE", value: "DE" },
  { label: "FL", value: "FL" },
  { label: "GA", value: "GA" },
  { label: "HI", value: "HI" },
  { label: "ID", value: "ID" },
  { label: "IL", value: "IL" },
  { label: "IN", value: "IN" },
  { label: "IA", value: "IA" },
  { label: "KS", value: "KS" },
  { label: "KY", value: "KY" },
  { label: "LA", value: "LA" },
  { label: "ME", value: "ME" },
  { label: "MD", value: "MD" },
  { label: "MA", value: "MA" },
  { label: "MI", value: "MI" },
  { label: "MN", value: "MN" },
  { label: "MS", value: "MS" },
  { label: "MO", value: "MO" },
  { label: "MT", value: "MT" },
  { label: "NE", value: "NE" },
  { label: "NV", value: "NV" },
  { label: "NH", value: "NH" },
  { label: "NJ", value: "NJ" },
  { label: "NM", value: "NM" },
  { label: "NY", value: "NY" },
  { label: "NC", value: "NC" },
  { label: "ND", value: "ND" },
  { label: "OH", value: "OH" },
  { label: "OK", value: "OK" },
  { label: "OR", value: "OR" },
  { label: "PA", value: "PA" },
  { label: "RI", value: "RI" },
  { label: "SC", value: "SC" },
  { label: "SD", value: "SD" },
  { label: "TN", value: "TN" },
  { label: "TX", value: "TX" },
  { label: "UT", value: "UT" },
  { label: "VT", value: "VT" },
  { label: "VA", value: "VA" },
  { label: "WA", value: "WA" },
  { label: "WV", value: "WV" },
  { label: "WI", value: "WI" },
  { label: "WY", value: "WY" },
];

export default function StateDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");

  return (
    <View style={styles.container}>
      <SelectDropdown
        statusBarTranslucent={true}
        data={STATES}
        defaultValue={STATES.find((s) => s.value === value)}
        dropdownStyle={{
          height: 250,
        }}
        onSelect={(item) => onChange(item.value)}
        dropdownOverlayColor="transparent"
        renderButton={(selectedItem, isOpened) => (
          <View style={styles.pillSelectSmall}>
            <View style={styles.logRow}>
              <Text style={styles.selectText}>{value || "State"}</Text>
              <FontAwesome6
                name={isOpened ? "caret-up" : "caret-down"}
                size={20}
                color="black"
              />
            </View>
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View
            style={[
              styles.dropdownItem,
              isSelected && styles.dropdownItemSelected,
            ]}
          >
            <Text style={styles.selectText}>{item.label}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 70,
    position: "relative",
    zIndex: 9999,
  },
  dropdown: {
    position: "absolute",
    top: 10,
    left: 0,
    width: 90,
    backgroundColor: "#dedede",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,

    maxHeight: 100,
    zIndex: 10000,
    elevation: 30,
  },
  pillSelectSmall: {
    width: 80,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  selectText: {
    fontFamily: "Jua",
    textAlign: "center",
  },

  logRow: {
    gap: 8,
    flexDirection: "row",

    alignItems: "center",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#dedede",
  },

  dropdownItemSelected: {
    backgroundColor: COLORS.secondary,
  },
});
