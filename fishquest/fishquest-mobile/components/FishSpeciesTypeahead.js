import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { AllSpecies } from "../data/species.config";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, ScrollView } from "react-native";

import { useEffect } from "react";
export function getSpeciesById(speciesId) {
  return AllSpecies.find((fish) => fish.id === speciesId) || null;
}

export default function FishSpeciesTypeahead({
  value,
  onPick,
  placeholder = "Search fish species",
  disabled = false,
}) {
  const [query, setQuery] = useState(value?.name || "");
  const [showResults, setShowResults] = useState(false);
  const normalizedSpecies = useMemo(() => {
    return (AllSpecies || [])
      .map((fish) => ({
        ...fish,
        label: fish.name,
        commonName: fish.name,
        scientificName: fish.scientificName ?? "",
        source: fish.source ?? "config",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredSpecies = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    return normalizedSpecies.filter((option) => {
      const fields = [
        option.name,
        option.group,
        option.category,
        ...(option.aliases || []),
        ...(option.searchTerms || []),
        ...(option.tags || []),
      ];

      return fields.some((field) => {
        const text = String(field || "").toLowerCase();
        return text.split(/[\s\-\/]+/).some((word) => word.startsWith(q));
      });
    });
  }, [query, normalizedSpecies]);

  const handleInputChange = (text) => {
    setQuery(text);

    if (!text.trim()) {
      onPick(null);
      setShowResults(false);
    } else {
      setShowResults(true);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.name || item.label);
    onPick(item);
    setShowResults(false);
  };
  useEffect(() => {
    if (value) {
      setQuery(value.name || value.label);
    }
  }, [value]);
  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={handleInputChange}
        placeholder={placeholder}
        editable={!disabled}
        style={[styles.input, disabled && styles.disabledInput]}
        onFocus={() => {
          if (query.trim().length >= 2) setShowResults(true);
        }}
      />

      {showResults && filteredSpecies.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={filteredSpecies}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Pressable style={styles.item} onPress={() => handleSelect(item)}>
                <Text style={styles.itemTitle}>{item.name || item.label}</Text>

                {(item.group || item.category) && (
                  <Text style={styles.itemSubtitle}>
                    {[item.group, item.category].filter(Boolean).join(" • ")}
                  </Text>
                )}
              </Pressable>
            )}
          />
        </View>
      )}

      {showResults &&
        query.trim().length >= 2 &&
        filteredSpecies.length === 0 && (
          <View style={styles.dropdown}>
            <Text style={styles.emptyText}>No fish found.</Text>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    zIndex: 9999,
    elevation: 30,
  },
  input: {
    width: 180,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#000",
    fontFamily: "Jua",
  },

  disabledInput: {
    backgroundColor: "#f2f2f2",
    opacity: 0.6,
  },
  dropdown: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#dedede",
    maxHeight: 220,
    overflow: "hidden",
    zIndex: 10000,
    elevation: 40,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontFamily: "Jua",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Jua",
  },
  itemSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#666",
    fontFamily: "Jua",
  },
  emptyText: {
    padding: 12,
    fontSize: 14,
    color: "#666",
    fontFamily: "Jua",
  },
});
