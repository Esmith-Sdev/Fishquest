import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
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
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 96,
  });

  function openDropdown() {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      const screenHeight = Dimensions.get("window").height;
      const dropdownHeight = 280;
      const top = Math.min(y + height + 6, screenHeight - dropdownHeight - 16);

      setDropdownPosition({
        top: Math.max(16, top),
        left: x,
        width: Math.max(width, 96),
      });
      setOpen(true);
    });
  }

  function handleSelect(item) {
    onChange(item.value);
    setOpen(false);
  }

  return (
    <View style={styles.container}>
      <Pressable
        ref={buttonRef}
        style={styles.pillSelectSmall}
        onPress={openDropdown}
        accessibilityRole="button"
      >
        <View style={styles.logRow}>
          <Text style={styles.selectText}>{value || "State"}</Text>
          <FontAwesome6
            name={open ? "caret-up" : "caret-down"}
            size={20}
            color="black"
          />
        </View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setOpen(false)}
          />
          <View
            style={[
              styles.dropdownPanel,
              {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              },
            ]}
          >
            <FlatList
              data={STATES}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = item.value === value;

                return (
                  <Pressable
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    position: "relative",
    zIndex: 9999,
  },
  pillSelectSmall: {
    width: 80,
    height: 33,
    backgroundColor: "#dedede",
    borderRadius: 50,
    justifyContent: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  dropdownPanel: {
    position: "absolute",
    maxHeight: 280,
    backgroundColor: "#dedede",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  dropdownItem: {
    minHeight: 42,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.12)",
  },
  dropdownItemSelected: {
    backgroundColor: COLORS.secondary,
  },
  dropdownItemText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 15,
  },
  dropdownItemTextSelected: {
    color: "#fff",
  },
});
