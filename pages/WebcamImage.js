import React, { useState } from 'react';
import Webcam from 'react-webcam';
import logo from './logo.png'; // Make sure the path matches the location of your logo file

import { useNavigate } from 'react-router-dom'; // Add this line to import useNavigate

import { storage } from '../firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const webcamRef = React.useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const uploadImageToFirebase = async () => {
    if (capturedImage) {
      // Convert the captured image to a blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
  
      // Create a reference to 'patientImage/imageName.jpg'
      const storageRef = ref(storage, 'patientImage/imageName.jpg');
  
      // Upload the blob to the Firebase Storage
      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      }).catch((error) => {
        console.error("Error uploading file", error);
      });
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <img src={logo} alt="Clinic Logo" style={{ maxWidth: '100px', height: 'auto' }} />
      <div style={{ maxWidth: '100vw', overflow: 'hidden' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 1280,
            height: 720,
            aspectRatio: 16 / 9,
          }}
        />
      </div>
      <div>
        <button onClick={uploadImageToFirebase}>Upload Image</button>

        <button onClick={captureImage}>Capture</button>
      </div>
      {capturedImage && (
        <div>
          <h2>Captured Image</h2>
          <img src={capturedImage} alt="Captured" style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
}

export default App;



V2.0

import React, { useState, useRef } from 'react'; // make sure to import useRef here
import Webcam from 'react-webcam';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function App() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();
  const [imageCount, setImageCount] = useState(1); // Initialize a counter for image names

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const uploadImageToFirebase = async () => {
    if (capturedImage) {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
  
      // Use the imageCount state to create a dynamic file name
      const imageName = `patient${imageCount}.jpg`;
      const storageRef = ref(storage, `patientImage/${imageName}`);
  
      // Upload the blob to Firebase Storage
      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log(`Uploaded a blob or file named ${imageName}!`);
        setImageCount((prevCount) => prevCount + 1); // Increment the counter after upload
      }).catch((error) => {
        console.error("Error uploading file", error);
      });
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <img src={logo} alt="Clinic Logo" style={{ maxWidth: '100px', height: 'auto' }} />
      <div style={{ maxWidth: '100vw', overflow: 'hidden' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 1280,
            height: 720,
            aspectRatio: 16 / 9,
          }}
        />
      </div>
      <div>
        <button onClick={uploadImageToFirebase}>Upload Image</button>
        <button onClick={captureImage}>Capture</button>
      </div>
      {capturedImage && (
        <div>
          <h2>Captured Image</h2>
          <img src={capturedImage} alt="Captured" style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
}

export default App;
