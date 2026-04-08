import { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";

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

  const selected = STATES.find((s) => s.value === value);

  return (
    <View style={styles.container}>
      <Pressable style={styles.input} onPress={() => setOpen((prev) => !prev)}>
        <Text>{selected ? selected.label : "State"}</Text>
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          <FlatList
            data={STATES}
            keyExtractor={(item) => item.value}
            style={styles.list}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                <Text style={styles.itemText}>{item.label}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 90,
    position: "relative",
    zIndex: 9999,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    width: 90,
    backgroundColor: "#dedede",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    maxHeight: 220,
    zIndex: 10000,
    elevation: 30,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  itemText: {
    color: "#000",
    fontFamily: "Jua",
    textAlign: "center",
    flexWrap: "nowrap",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#dedede",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    maxHeight: 220,
  },
});
