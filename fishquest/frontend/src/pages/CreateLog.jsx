import { Navbar, Container, Form, Button, Image } from "react-bootstrap";
import Select from "react-select";
import { useState, useRef, useEffect, useMemo } from "react";
import { getCurrentLocation } from "../utils/getCurrentLocation";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import { uploadImages } from "../api/uploads";
import { createCatchLog } from "../api/logs";
import FishSpeciesTypeahead from "../components/FishSpeciesTypeahead";
import PlusIcon from "/img/Icons/add.png";
import DatePicker from "react-datepicker";
import { getToken } from "../api/auth";
import Bobber from "/img/Bobbers/bobber.png";
import NoBobber from "/img/Bobbers/no-bobber.png";
import { BAIT } from "../data/bait.config";
import { HOOKS } from "../data/hooks.config";
import { POLES } from "../data/poles.config";
import { WEIGHTS } from "../data/weight.config";
import { fetchRigPresets } from "../api/rigPresets";
import { STATE_ABBREVIATIONS } from "../data/states";
import "react-datepicker/dist/react-datepicker.css";
const options = [
  { value: "AL", label: "AL" },
  { value: "AK", label: "AK" },
  { value: "AZ", label: "AZ" },
  { value: "AR", label: "AR" },
  { value: "CA", label: "CA" },
  { value: "CO", label: "CO" },
  { value: "CT", label: "CT" },
  { value: "DE", label: "DE" },
  { value: "FL", label: "FL" },
  { value: "GA", label: "GA" },
  { value: "HI", label: "HI" },
  { value: "ID", label: "ID" },
  { value: "IL", label: "IL" },
  { value: "IN", label: "IN" },
  { value: "IA", label: "IA" },
  { value: "KS", label: "KS" },
  { value: "KY", label: "KY" },
  { value: "LA", label: "LA" },
  { value: "ME", label: "ME" },
  { value: "MD", label: "MD" },
  { value: "MA", label: "MA" },
  { value: "MI", label: "MI" },
  { value: "MN", label: "MN" },
  { value: "MS", label: "MS" },
  { value: "MO", label: "MO" },
  { value: "MT", label: "MT" },
  { value: "NE", label: "NE" },
  { value: "NV", label: "NV" },
  { value: "NH", label: "NH" },
  { value: "NJ", label: "NJ" },
  { value: "NM", label: "NM" },
  { value: "NY", label: "NY" },
  { value: "NC", label: "NC" },
  { value: "ND", label: "ND" },
  { value: "OH", label: "OH" },
  { value: "OK", label: "OK" },
  { value: "OR", label: "OR" },
  { value: "PA", label: "PA" },
  { value: "RI", label: "RI" },
  { value: "SC", label: "SC" },
  { value: "SD", label: "SD" },
  { value: "TN", label: "TN" },
  { value: "TX", label: "TX" },
  { value: "UT", label: "UT" },
  { value: "VT", label: "VT" },
  { value: "VA", label: "VA" },
  { value: "WA", label: "WA" },
  { value: "WV", label: "WV" },
  { value: "WI", label: "WI" },
  { value: "WY", label: "WY" },
];
export default function CreateLog() {
  const date = new Date();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
  });

  const [files, setFiles] = useState([]);
  const [skunked, setSkunked] = useState(false);
  const [species, setSpecies] = useState(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const isGridFull = files.length === 4;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedState, setSelectedState] = useState(null);
  const [geoError, setGeoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [rigsLoading, setRigsLoading] = useState(true);
  const [rigsError, setRigsError] = useState("");
  const location = useLocation();

  function handleCreateRig() {
    navigate("/create-rig", {
      state: {
        returnTo: "/create-log",
        challenge: location.state?.challenge || null,
        draftLog: {
          form,
          skunked,
          species,
          notes,
          weight,
          length,
          selectedDate,
          files,
        },
      },
    });
  }

  async function handleGetLocation() {
    setLoading(true);
    setGeoError("");
    try {
      const location = await getCurrentLocation();
      const abbr =
        typeof location.state === "string" && location.state.length === 2
          ? location.state.toUpperCase()
          : STATE_ABBREVIATIONS[location.state] || "";

      setForm((prev) => ({
        ...prev,
        address: location.streetAddress || "",
        city: location.city || "",
        state: abbr,
      }));
    } catch (err) {
      setGeoError(err.message || "Location failed");
    } finally {
      setLoading(false);
    }
  }
  const onClickUpload = () => {
    fileInputRef.current?.click();
  };

  const [startDate, setStartDate] = useState(new Date());
  const hours24 = date.getHours();
  const minutes = date.getMinutes();

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  const formattedTime =
    hours12.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0");

  const speciesDisabled = skunked || saving;
  useEffect(() => {
    if (skunked) setSpecies(null);
  }, [skunked]);

  //Handle Submit
  async function handleSubmitLog(e) {
    e.preventDefault();

    if (!rigPresetId) {
      alert("Please select a rig preset first.");
      return;
    }

    if (!skunked && !species) {
      alert("Please choose a fish species or mark the trip as skunked.");
      return;
    }

    setSaving(true);

    try {
      const urls = files.length ? await uploadImages(files) : [];

      const selectedSpecies = skunked
        ? null
        : {
            speciesId: species?.id ?? null,
            speciesName: species?.name || species?.label || "",
          };

      const payload = {
        rigPresetId,
        date: selectedDate.toISOString(),
        notes,
        imageUrls: urls,
        skunked,
        ...(skunked
          ? {}
          : {
              ...selectedSpecies,
              weight,
              length,
            }),
      };

      console.log("Submitting log payload:", payload);

      await createCatchLog(payload, localStorage.getItem("token"));
      navigate("/logs");
    } catch (err) {
      console.error("Create log failed:", err);
      alert(err.message || "Create log failed");
    } finally {
      setSaving(false);
    }
  }
  const onFilesSelected = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;
    const max = 4;
    const room = max - files.length;
    const limited = picked.slice(0, room);

    setFiles((prev) => [...prev, ...limited]);
    setImageUploaded(true);
    e.target.value = null;
  };
  const [rigs, setRigs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();

        if (!token) {
          setRigsError("No auth token found.");
          setRigs([]);
          return;
        }

        const data = await fetchRigPresets(token);
        setRigs(Array.isArray(data) ? data : []);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Rig preset load failed:", err);
        setRigsError(err.message || "Failed to load rig presets.");
        setRigs([]);
      } finally {
        setRigsLoading(false);
      }
    })();
  }, []);

  const hydratedRigs = useMemo(() => {
    return rigs.map((p) => ({
      ...p,
      hook: HOOKS.find((x) => x.id === p.hookId),
      bait: BAIT.find((x) => x.id === p.baitId),
      pole: POLES.find((x) => x.id === p.poleId),
      weight: WEIGHTS.find((x) => x.id === p.weightId),
    }));
  }, [rigs]);

  const selectedRig = hydratedRigs[selectedIndex];
  const rigPresetId = selectedRig?._id;
  const prevRig = () => {
    if (!hydratedRigs.length) return;
    setSelectedIndex(
      (i) => (i - 1 + hydratedRigs.length) % hydratedRigs.length,
    );
  };
  const nextRig = () => {
    if (!hydratedRigs.length) return;
    setSelectedIndex((i) => (i + 1) % hydratedRigs.length);
  };

  if (rigsLoading) {
    return (
      <>
        <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
          <Link to="/">
            <i className="bi bi-arrow-left-circle-fill"></i>
          </Link>
          <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
            Create Log
          </h1>
          <Button type="submit" className="orangeButton" disabled>
            Submit
          </Button>
        </Navbar>

        <BottomBar />
        <Container className="bottomNavbarSpacing">
          <div className="p-3 text-light">Loading rig presets...</div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Form onSubmit={handleSubmitLog}>
        <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
          <Link to="/">
            <i className="bi bi-arrow-left-circle-fill"></i>
          </Link>
          <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
            Create Log
          </h1>
          <Button type="submit" className="orangeButton">
            Submit
          </Button>
        </Navbar>
        <BottomBar />
        <Container className="bottomNavbarSpacing">
          <div className="d-flex flex-column p-2">
            <div className="d-flex flex-column gap-4 mt-4 justify-content-start">
              <div className="d-flex flex-row gap-4 align-items-center">
                {selectedRig ? (
                  <>
                    <div className="d-flex flex-column">
                      <div
                        className="d-flex align-items-start flex-column justify-content-end"
                        style={{ width: "9rem" }}
                      >
                        <div className="rigPresetText d-flex flex-row align-items-center">
                          <i
                            className="bi bi-caret-left-fill"
                            onClick={prevRig}
                          ></i>
                          <h2 className="m-0">{selectedRig.rigName}</h2>
                          <i
                            className="bi bi-caret-right-fill"
                            onClick={nextRig}
                          ></i>
                        </div>
                        <div className="rigImageContainer">
                          <Image
                            src={selectedRig?.pole?.image}
                            alt={selectedRig?.pole?.name || "Rig pole"}
                            style={{
                              width: "100%",
                              height: "auto",
                              overflow: "hidden",
                            }}
                          />
                        </div>
                      </div>
                      <Link to={`/edit-rig/${selectedRig._id}`}>
                        <Button
                          className="orangeButton"
                          style={{ width: "3rem" }}
                        >
                          Edit
                        </Button>
                      </Link>
                    </div>

                    <div className="d-flex flex-row gap-3 ms-5">
                      <div className="d-flex flex-column gap-3">
                        <div className="smallSquare">
                          <Image
                            src={selectedRig.bobber ? Bobber : NoBobber}
                            alt={selectedRig.bobber ? "Bobber On" : "No Bobber"}
                            style={{
                              width: "100%",
                              height: "auto",
                              overflow: "hidden",
                            }}
                          />
                        </div>
                        <div className="smallSquare">
                          <Image
                            src={selectedRig?.bait?.image}
                            alt={selectedRig?.bait?.name || "Bait"}
                            style={{
                              width: "100%",
                              height: "auto",
                              overflow: "hidden",
                            }}
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-column gap-3">
                        <div className="smallSquare">
                          <Image
                            src={selectedRig?.hook?.image}
                            alt={selectedRig?.hook?.name || "Hook"}
                            style={{
                              width: "100%",
                              height: "auto",
                              overflow: "hidden",
                            }}
                          />
                        </div>
                        <div className="smallSquare">
                          <Image
                            src={selectedRig?.weight?.image}
                            alt={selectedRig?.weight?.name || "Weight"}
                            style={{
                              width: "100%",
                              height: "auto",
                              overflow: "hidden",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="w-100 d-flex flex-column align-items-start gap-2 p-3"
                    style={{
                      border: "1px dashed #ccc",
                      borderRadius: "12px",
                    }}
                  >
                    <div className="d-flex flex-column align-items-center gap-2 w-100">
                      <h4>No rig preset selected</h4>
                      <h4>No Rigs Found. Create one before logging.</h4>
                      <Link
                        to="/create-rig"
                        state={{
                          returnTo: "/create-log",
                          challenge: location.state?.challenge || null,
                        }}
                      >
                        <Button
                          className="orangeButton"
                          onClick={handleCreateRig}
                        >
                          Create Rig
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/*PHOTOS*/}
              </div>

              {!imageUploaded && (
                <div className="photoUploadContainer d-flex flex-column align-items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onFilesSelected}
                    style={{ display: "none" }}
                    disabled={saving}
                  />
                  <div className="photoUploadIconContainer d-flex flex-column align-items-center">
                    <Button
                      type="button"
                      onClick={onClickUpload}
                      disabled={saving}
                      style={{
                        background: "transparent",
                        border: "transparent",
                      }}
                    >
                      <h3>Upload Image</h3>
                      <i className="bi bi-camera"></i>
                    </Button>
                  </div>
                </div>
              )}

              {/*Image Preview */}
              {files.length > 0 && (
                <div className="image-grid">
                  {Array.from(files).map((_, i) => (
                    <div className="largeSquare" key={i}>
                      {files[i] && (
                        <img src={URL.createObjectURL(files[i])} alt="" />
                      )}
                    </div>
                  ))}
                  {!isGridFull && (
                    <div className="largeSquare">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onFilesSelected}
                        style={{ display: "none" }}
                        disabled={saving}
                      />
                      <Button
                        type="button"
                        onClick={onClickUpload}
                        disabled={saving}
                        style={{
                          background: "transparent",
                          border: "transparent",
                          width: 100,
                          height: 100,
                        }}
                      >
                        <h3>Add Image</h3>
                        <Image
                          style={{ width: 50, height: "auto" }}
                          src={PlusIcon}
                          alt=""
                        ></Image>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/*Notes*/}

              <div className="logForm">
                {/* Fish Species */}
                <div className="pb-3">
                  <Form.Check
                    label="Skunked (No fish caught)"
                    type="checkbox"
                    checked={skunked}
                    onChange={(e) => setSkunked(e.target.checked)}
                  />
                </div>
                <div className="logRow">
                  <div className="logLabel">Fish Species:</div>
                  <div
                    className={`pillInput form-control ${speciesDisabled ? "pillInput--disabled form-control" : ""}`}
                  >
                    <FishSpeciesTypeahead
                      disabled={speciesDisabled}
                      value={species}
                      onPick={setSpecies}
                    />
                  </div>
                </div>
                {/* Est Weight */}
                <div className="logRow">
                  <div className="logLabel">Est. Weight:</div>
                  <div className="logField logFieldInline">
                    <Form.Control
                      disabled={skunked}
                      className="pillInput small"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 2);
                      }}
                    />
                    <Form.Select
                      disabled={skunked}
                      className="pillSelect small"
                      defaultValue="LB"
                    >
                      <option>LB</option>
                      <option>OZ</option>
                    </Form.Select>
                  </div>
                </div>
                {/* Est Length */}
                <div className="logRow">
                  <div className="logLabel">Est. Length:</div>
                  <div className="logField logFieldInline">
                    <Form.Control
                      disabled={skunked}
                      className="pillInput small"
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 2);
                      }}
                    />
                    <Form.Select
                      disabled={skunked}
                      className="pillSelect small"
                      defaultValue="CM"
                    >
                      <option>CM</option>
                      <option>IN</option>
                    </Form.Select>
                  </div>
                </div>
                {/* Date/Time */}
                <div className="logRow">
                  <div className="logLabel me-auto">Date:</div>

                  <div className="logField logFieldInline">
                    <DatePicker
                      className="pillInput form-control medium"
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                    />
                  </div>
                  <div className="logRow">
                    <div className="logLabel me-auto">Time:</div>
                    <div className="logRow">
                      <Form.Control
                        className="pillInput time medium"
                        type="text"
                        defaultValue={formattedTime}
                      />
                      <Form.Select
                        className="pillSelect time"
                        defaultValue={period}
                      >
                        <option>AM</option>
                        <option>PM</option>
                      </Form.Select>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="logColumn">
                  <div className="logLabel me-auto">Location:</div>
                  <div className="logField locationGrid">
                    {/* Address line */}
                    <Form.Control
                      className="pillInput"
                      type="text"
                      placeholder="Street Address"
                      maxLength={35}
                      value={form.address}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, address: e.target.value }))
                      }
                    />
                    {/* State + City */}
                    <div className="logRow mb-0">
                      <Select
                        className="pillSelect state"
                        value={
                          options.find((o) => o.value === form.state) || null
                        }
                        options={options}
                        placeholder="State"
                        maxMenuHeight={170}
                        onChange={(opt) =>
                          setForm((p) => ({ ...p, state: opt?.value || "" }))
                        }
                      />
                      <Form.Control
                        className="pillInput city"
                        type="text"
                        placeholder="City"
                        value={form.city}
                        maxLength={35}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, city: e.target.value }))
                        }
                      />
                    </div>
                    {/* Spot preset + buttons */}
                    <div className="logFieldInline">
                      <div className="flex-row d-flex gap-2 mb-0 align-items-center">
                        <div className="d-flex flex-column">
                          <Button
                            className="pillBtn orangeButton"
                            disabled={loading}
                            type="button"
                            onClick={handleGetLocation}
                          >
                            {loading
                              ? "Getting Location..."
                              : "Use Current Location"}
                          </Button>
                          {geoError && (
                            <p
                              style={{
                                color: "red",
                                marginTop: "5px",
                                marginBottom: 0,
                              }}
                            >
                              {geoError}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Challenge (read-only text) */}
                <div className="logRow">
                  <div className="logLabel">Challenge:</div>
                  <div className="logField challengeText">
                    Catch a fish in 10min
                  </div>
                </div>
                {/* Other Notes */}
                <div className="notesBlock">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    className="notesBox"
                    placeholder="Other Notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Form>
    </>
  );
}
