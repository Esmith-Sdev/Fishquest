import { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AllSpecies } from "../data/species.config";

export default function FishSpeciesTypeahead({
  value,
  onPick,
  placeholder = "Search fish species",
  disabled = false,
  onOpenChange,
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

  function handleInputChange(text) {
    setQuery(text);

    if (!text.trim()) {
      onPick(null);
      setDropdownOpen(false);
    } else {
      setDropdownOpen(true);
    }
  }

  function handleSelect(item) {
    setQuery(item.name || item.label);
    onPick(item);
    setDropdownOpen(false);
  }
  function setDropdownOpen(value) {
    setShowResults(value);
    onOpenChange?.(value);
  }
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
          if (query.trim().length >= 2) setDropdownOpen(true);
        }}
      />

      {showResults && query.trim().length >= 2 && (
        <View style={styles.dropdown}>
          <ScrollView
            style={styles.dropdownList}
            contentContainerStyle={styles.dropdownContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {filteredSpecies.length > 0 ? (
              filteredSpecies.map((item) => (
                <Pressable
                  key={String(item.id)}
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.itemTitle}>
                    {item.name || item.label}
                  </Text>

                  {(item.group || item.category) && (
                    <Text style={styles.itemSubtitle}>
                      {[item.group, item.category].filter(Boolean).join(" • ")}
                    </Text>
                  )}
                </Pressable>
              ))
            ) : (
              <Text style={styles.emptyText}>No fish found.</Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 9999,
    elevation: 40,
  },

  dropdown: {
    width: 220,
    height: 220,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#dedede",
    overflow: "hidden",
    zIndex: 10000,
    elevation: 50,
  },

  dropdownList: {
    height: 220,
  },

  dropdownContent: {
    paddingBottom: 8,
  },
  input: {
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 14,
    color: "#000",
    fontFamily: "Jua",
  },

  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
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
