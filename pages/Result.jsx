import React, { useState } from 'react';
import './Result.css'; // make sure to create a CSS file to style your dropdown

function About() {
  const [isOpen, setIsOpen] = useState(false);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    console.log(value);
    setIsOpen(false);
  };

  const onActionButtonClick = () => {
    console.log("Action button clicked");
  };

  return (
    <div className="dropdown-container">
      <div className="button-container">
        <button onClick={toggling} className="dropdown-button">
          Select Patient ▼
        </button>
        {isOpen && (
          <ul className="dropdown-list">
            <li onClick={onOptionClicked("Patient 1")} className="dropdown-list-item">
              Patient 1
            </li>
            <li onClick={onOptionClicked("Patient 2")} className="dropdown-list-item">
              Patient 2
            </li>
            <li onClick={onOptionClicked("Patient 3")} className="dropdown-list-item">
              Patient 3
            </li>
          </ul>
        )}
      </div>
      <div className="button-container">
        <button onClick={onActionButtonClick} className="dropdown-button">
          Send Result
        </button>
      </div>
    </div>
  );
}

export default About;

V2.0 -----


import React, { useState, useEffect } from 'react';
import './Result.css';
import { storage } from '../firebaseConfig';
import { ref, listAll } from 'firebase/storage';

function About() {
  const [isOpen, setIsOpen] = useState(false);
  const [patientNames, setPatientNames] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("Select Patient"); // State to keep track of the selected patient

  useEffect(() => {
    fetchPatientNames();
  }, []);

  const fetchPatientNames = () => {
    const storageRef = ref(storage, 'patientImage/');

    listAll(storageRef)
      .then((res) => {
        const names = res.items.map((itemRef) => {
          const match = itemRef.name.match(/(patient\d+)/i);
          return match ? match[1] : null;
        }).filter(Boolean);

        setPatientNames(names);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    console.log(value);
    setSelectedPatient(value); // Update the selected patient state
    setIsOpen(false);
  };

  const onActionButtonClick = () => {
    console.log("Action button clicked");
    // Here, you can handle the action when the Send Result button is clicked
    // For instance, sending the result to the selected patient or handling other logic
  };

  return (
    <div className="dropdown-container">
      <div className="button-container">
        <button onClick={toggling} className="dropdown-button">
          {selectedPatient} ▼
        </button>
        {isOpen && (
          <ul className="dropdown-list">
            {patientNames.map((name, index) => (
              <li key={index} onClick={onOptionClicked(name)} className="dropdown-list-item">
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="button-container">
        <button onClick={onActionButtonClick} className="dropdown-button">
          Send Result
        </button>
      </div>
    </div>
  );
}

export default About;


import React, { useState, useEffect } from 'react';
import './Result.css';
import { storage } from '../firebaseConfig';
import { ref, getDownloadURL,listAll } from 'firebase/storage';
import axios from 'axios';

function About() {
  const [isOpen, setIsOpen] = useState(false);
  const [patientNames, setPatientNames] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("Select Patient");
  const [selectedPatientImage, setSelectedPatientImage] = useState(null);

  useEffect(() => {
    fetchPatientNames();
  }, []);

  const fetchPatientNames = () => {
    const storageRef = ref(storage, 'patientImage/');

    listAll(storageRef)
      .then((res) => {
        const names = res.items.map((itemRef) => {
          const match = itemRef.name.match(/(patient\d+)/i);
          return match ? match[1] : null;
        }).filter(Boolean);

        setPatientNames(names);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedPatient(value);
    fetchImageForSelectedPatient(value);
    setIsOpen(false);
  };

  const fetchImageForSelectedPatient = (patientName) => {
    console.log("Selected patient name:", patientName); // Debugging line
    const imageRef = ref(storage, `patientImage/${patientName}.jpg`);
    getDownloadURL(imageRef)
      .then((url) => {
        console.log("Fetched image URL:", url); // Debugging line
        setSelectedPatientImage(url);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  };
  

  const onActionButtonClick = () => {
    if (!selectedPatientImage) {
      console.error("No patient image selected");
      return;
    }

    axios({
        method: "POST",
        url: "https://detect.roboflow.com/acne-detect/5",
        params: {
            api_key: "quYHWCDA4a7D3RgDjvTj",
        },
        headers: { 'Content-Type': 'multipart/form-data' },
        data: { image: selectedPatientImage }
    })
    .then(function(response) {
        console.log(response.data);
    })
    .catch(function(error) {
        console.log(error.message);
    });
  };

  return (
    <div className="dropdown-container">
      <div className="button-container">
        <button onClick={toggling} className="dropdown-button">
          {selectedPatient} ▼
        </button>
        {isOpen && (
          <ul className="dropdown-list">
            {patientNames.map((name, index) => (
              <li key={index} onClick={onOptionClicked(name)} className="dropdown-list-item">
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="button-container">
        <button onClick={onActionButtonClick} className="dropdown-button">
          Send Result
        </button>
      </div>
    </div>
  );
}

export default About;
