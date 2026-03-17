import { useMemo } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { AllSpecies } from "../data/species.config";
import "react-bootstrap-typeahead/css/Typeahead.css";

export function getSpeciesById(speciesId) {
  return AllSpecies.find((fish) => fish.id === speciesId) || null;
}

export default function FishSpeciesTypeahead({
  value,
  onPick,
  placeholder = "Search fish species",
  disabled = false,
}) {
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

  const handleChange = (selected) => {
    onPick(selected?.[0] || null);
  };

  const handleInputChange = (text) => {
    if (!text.trim()) {
      onPick(null);
    }
  };

  const selectedValue = useMemo(() => {
    if (!value?.id) return [];
    const existing = normalizedSpecies.find((fish) => fish.id === value.id);
    return existing ? [existing] : [];
  }, [value, normalizedSpecies]);

  return (
    <Typeahead
      id="fish-species-typeahead"
      disabled={disabled}
      minLength={2}
      options={normalizedSpecies}
      selected={selectedValue}
      labelKey="label"
      onChange={handleChange}
      onInputChange={handleInputChange}
      placeholder={placeholder}
      emptyLabel="No fish found."
      clearButton
      highlightOnlyResult={false}
      selectHintOnEnter={false}
      filterBy={(option, props) => {
        const q = props.text.trim().toLowerCase();
        if (!q) return false;

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
      }}
      renderMenuItemChildren={(option) => (
        <div>
          <div>{option.name || option.label}</div>
          {(option.group || option.category) && (
            <small className="text-muted">
              {[option.group, option.category].filter(Boolean).join(" • ")}
            </small>
          )}
        </div>
      )}
    />
  );
}
