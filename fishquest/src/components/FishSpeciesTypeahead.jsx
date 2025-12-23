import { useMemo, useRef, useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

export default function FishSpeciesTypeahead({
  value,
  onPick,
  placeholder = "Search fish species",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const cacheRef = useRef(new Map());
  const latestReqId = useRef(0);
  const debounceTimer = useRef(null);
  const suppressNextInputClear = useRef(false);
  const labelKey = useMemo(() => (opt) => opt.label ?? "", []);

  async function fetchSpecies(query, reqId) {
    const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(
      query
    )}&per_page=20`;

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const results = Array.isArray(data?.results) ? data.results : [];

    // ✅ FILTER TO FISH ONLY
    const fishOnly = results.filter((t) => {
      return (
        t.iconic_taxon_name === "Actinopterygii" ||
        t.iconic_taxon_name === "Chondrichthyes"
      );
    });

    const mapped = fishOnly.map((t) => {
      const common = t.preferred_common_name || "";
      const sci = t.name || "";

      return {
        id: t.id,
        label: common || sci, // ✅ common name only
        commonName: common || sci,
        scientificName: sci, // kept internally if you ever want it
        source: "inaturalist",
      };
    });

    if (reqId !== latestReqId.current) return null;
    return mapped;
  }

  const handleSearch = (query) => {
    const q = query.trim();
    if (q.length < 2) {
      setOptions([]);
      return;
    }

    const key = q.toLowerCase();
    if (cacheRef.current.has(key)) {
      setOptions(cacheRef.current.get(key));
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      const reqId = ++latestReqId.current;
      setIsLoading(true);

      try {
        const results = await fetchSpecies(q, reqId);
        if (results) {
          cacheRef.current.set(key, results);
          setOptions(results);
        }
      } finally {
        if (reqId === latestReqId.current) setIsLoading(false);
      }
    }, 250);
  };

  const handleChange = (selected) => {
    const item = selected?.[0];
    if (!item) {
      onPick(null);
      return;
    }
    suppressNextInputClear.current = true;
    // Custom entry
    if (item.customOption || typeof item === "string") {
      const label = item.label ?? item;
      onPick({
        id: null,
        label,
        commonName: label,
        scientificName: "",
        source: "custom",
      });
      return;
    }

    onPick(item);
  };
  const handleInputChange = (text) => {
    if (suppressNextInputClear.current) {
      suppressNextInputClear.current = false;
      return;
    }

    if (value && text !== (value.label ?? "")) onPick(null);
  };
  return (
    <AsyncTypeahead
      id="fish-species-typeahead"
      isLoading={isLoading}
      minLength={2}
      onSearch={handleSearch}
      options={options}
      labelKey={labelKey}
      onChange={handleChange}
      onInputChange={handleInputChange}
      placeholder={placeholder}
      allowNew
      inputProps={{ className: "pillInput" }}
      emptyLabel="No fish found. Press Enter to add your own."
      selected={value ? [value] : []}
      filterBy={() => true}
    />
  );
}
