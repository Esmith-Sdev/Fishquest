import { useMemo, useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { COLORS } from "../constants/theme";
import { AllSpecies } from "../data/species.config";

export default function FishSpeciesTypeahead({
  value,
  onPick,
  placeholder = "Search fish species",
  disabled = false,
  onOpenChange,
}) {
  const [query, setQuery] = useState(value?.name || "");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const normalizedSpecies = useMemo(() => {
    return (AllSpecies || [])
      .map((fish) => ({
        ...fish,
        label: fish.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredSpecies = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    return normalizedSpecies.filter((fish) => {
      const fields = [
        fish.name,
        fish.group,
        fish.category,
        ...(fish.aliases || []),
        ...(fish.searchTerms || []),
        ...(fish.tags || []),
      ];

      return fields.some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(q),
      );
    });
  }, [query, normalizedSpecies]);

  useEffect(() => {
    if (value) {
      setQuery(value.name || value.label || "");
    }
  }, [value]);

  function openModal() {
    if (disabled) return;
    setOpen(true);
    onOpenChange?.(true);
  }

  function closeModal() {
    setOpen(false);
    onOpenChange?.(false);
  }

  function handleSelect(item) {
    setQuery(item.name || item.label);
    onPick(item);
    closeModal();
  }

  return (
    <>
      <Pressable
        disabled={disabled}
        style={[styles.fakeInput, disabled && styles.disabledInput]}
        onPress={openModal}
      >
        <Text style={styles.fakeInputText}>
          {value?.name || value?.label || query || placeholder}
        </Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
        onShow={() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 250);
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.box}>
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                if (!text.trim()) onPick(null);
              }}
              placeholder={placeholder}
              showSoftInputOnFocus={true}
              autoFocus={false}
              style={styles.searchInput}
            />

            <FlatList
              data={filteredSpecies}
              keyExtractor={(item) => String(item.id)}
              keyboardShouldPersistTaps="always"
              style={styles.resultsList}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.itemTitle}>{item.name}</Text>

                  {(item.group || item.category) && (
                    <Text style={styles.itemSubtitle}>
                      {[item.group, item.category].filter(Boolean).join(" • ")}
                    </Text>
                  )}
                </Pressable>
              )}
              ListEmptyComponent={
                query.trim().length >= 2 ? (
                  <Text style={styles.emptyText}>No fish found.</Text>
                ) : (
                  <Text style={styles.emptyText}>Type at least 2 letters.</Text>
                )
              }
            />

            <Pressable style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fakeInput: {
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 14,
    width: "100%",
  },

  fakeInputText: {
    color: "#000",
    fontFamily: "Jua",
  },

  disabledInput: {
    opacity: 0.6,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  box: {
    width: "100%",
    maxWidth: 340,
    height: 360,
    backgroundColor: "#dedede",
    borderRadius: 18,
    overflow: "hidden",
  },

  searchInput: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: "#000",
    fontFamily: "Jua",
    fontSize: 16,
  },

  resultsList: {
    flex: 1,
  },

  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
  },

  itemTitle: {
    fontSize: 16,
    fontFamily: "Jua",
    color: "#000",
  },

  itemSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#555",
    fontFamily: "Jua",
  },

  emptyText: {
    padding: 14,
    color: "#666",
    fontFamily: "Jua",
  },

  cancelButton: {
    padding: 12,
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },

  cancelText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 16,
  },
});
