import { Navbar, Container, Form, Button, Image } from "react-bootstrap";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import { uploadImages } from "../api/uploads";
import { createCatchLog } from "../api/logs";
import { useNavigate } from "react-router-dom";
import FishSpeciesTypeahead from "../components/FishSpeciesTypeahead";
import PlusIcon from "../assets/img/Icons/add.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function CreateLog() {
  const date = new Date();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [species, setSpecies] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const isGridFull = files.length === 4;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onClickUpload = () => {
    fileInputRef.current?.click();
  };
  const [startDate, setStartDate] = useState(new Date());
  async function handleSubmitLog(e) {
    e.preventDefault();

    setSaving(true);
    try {
      const urls = await uploadImages(files);

      await createCatchLog(
        {
          species,
          notes,
          imageUrls: urls,
        },
        localStorage.getItem("token")
      );
      navigate("/logs");
    } catch (err) {
      alert(err.message);
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
  return (
    <>
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
        <Form onSubmit={handleSubmitLog}>
          <div className="d-flex flex-column p-2">
            <div className="d-flex flex-column gap-4 mt-4 justify-content-start">
              <div className="d-flex flex-row gap-4 align-items-center">
                {/*RIG PREVIEW*/}
                <div className="d-flex flex-column">
                  <div
                    className="d-flex align-items-start flex-column justify-content-end"
                    style={{ width: "9rem" }}
                  >
                    <div className="rigPresetText d-flex flex-row align-items-center">
                      <i className="bi bi-caret-left-fill"></i>
                      <h2 className="m-0">Rig Preset</h2>
                      <i className="bi bi-caret-right-fill"></i>
                    </div>
                    <div className="rigImageContainer"></div>
                  </div>
                  <Link to="/edit-rig">
                    <Button className="orangeButton" style={{ width: "3rem" }}>
                      Edit
                    </Button>
                  </Link>
                </div>
                {/*RIG OPTIONS*/}
                <div className="d-flex flex-row gap-3 ms-5">
                  <div className="d-flex flex-column gap-3">
                    <div className="smallSquare"></div>
                    <div className="smallSquare"></div>
                  </div>
                  <div className="d-flex flex-column gap-3">
                    <div className="smallSquare"></div>
                    <div className="smallSquare"></div>
                  </div>
                </div>
              </div>
              {/*PHOTOS*/}

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
                <div className="logRow">
                  <div className="logLabel">Fish Species:</div>
                  <div className="logField">
                    <div className="pillSearch">
                      <FishSpeciesTypeahead
                        value={species}
                        onPick={(picked) => {
                          setSpecies(picked);
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* Est Weight */}
                <div className="logRow">
                  <div className="logLabel">Est. Weight:</div>
                  <div className="logField logFieldInline">
                    <Form.Control className="pillInput small" type="number" />
                    <Form.Select className="pillSelect small" defaultValue="LB">
                      <option>LB</option>
                      <option>OZ</option>
                    </Form.Select>
                  </div>
                </div>
                {/* Est Length */}
                <div className="logRow">
                  <div className="logLabel">Est. Length:</div>
                  <div className="logField logFieldInline">
                    <Form.Control className="pillInput small" type="number" />
                    <Form.Select className="pillSelect small" defaultValue="CM">
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
                        defaultValue={
                          date.getHours().toString().padStart(2, "0") +
                          ":" +
                          date.getMinutes().toString().padStart(2, "0")
                        }
                      />
                      <Form.Select
                        className="pillSelect time"
                        defaultValue="PM"
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
                    />
                    {/* State + City */}
                    <div className="logFieldInline">
                      <Form.Select
                        className="pillSelect state"
                        defaultValue=""
                        size={5}
                      >
                        <option value="AL">AL</option>
                        <option value="AK">AK</option>
                        <option value="AZ">AZ</option>
                        <option value="AR">AR</option>
                        <option value="CA">CA</option>
                        <option value="CO">CO</option>
                        <option value="CT">CT</option>
                        <option value="DE">DE</option>
                        <option value="FL">FL</option>
                        <option value="GA">GA</option>
                        <option value="HI">HI</option>
                        <option value="ID">ID</option>
                        <option value="IL">IL</option>
                        <option value="IN">IN</option>
                        <option value="IA">IA</option>
                        <option value="KS">KS</option>
                        <option value="KY">KY</option>
                        <option value="LA">LA</option>
                        <option value="ME">ME</option>
                        <option value="MD">MD</option>
                        <option value="MA">MA</option>
                        <option value="MI">MI</option>
                        <option value="MN">MN</option>
                        <option value="MS">MS</option>
                        <option value="MO">MO</option>
                        <option value="MT">MT</option>
                        <option value="NE">NE</option>
                        <option value="NV">NV</option>
                        <option value="NH">NH</option>
                        <option value="NJ">NJ</option>
                        <option value="NM">NM</option>
                        <option value="NY">NY</option>
                        <option value="NC">NC</option>
                        <option value="ND">ND</option>
                        <option value="OH">OH</option>
                        <option value="OK">OK</option>
                        <option value="OR">OR</option>
                        <option value="PA">PA</option>
                        <option value="RI">RI</option>
                        <option value="SC">SC</option>
                        <option value="SD">SD</option>
                        <option value="TN">TN</option>
                        <option value="TX">TX</option>
                        <option value="UT">UT</option>
                        <option value="VT">VT</option>
                        <option value="VA">VA</option>
                        <option value="WA">WA</option>
                        <option value="WV">WV</option>
                        <option value="WI">WI</option>
                        <option value="WY">WY</option>
                      </Form.Select>
                      <Form.Control
                        className="pillInput city"
                        type="text"
                        placeholder="City"
                      />
                    </div>
                    {/* Spot preset + buttons */}
                    <div className="logFieldInline">
                      <div className="flex-row d-flex gap-2 mb-0 align-items-center">
                        <Button className="pillBtn orangeButton" type="button">
                          Use Current Location
                        </Button>
                        <Button className="pillBtn blueButton" type="button">
                          Save
                        </Button>
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
                  />
                </div>
              </div>
            </div>
          </div>
        </Form>
      </Container>
    </>
  );
}
