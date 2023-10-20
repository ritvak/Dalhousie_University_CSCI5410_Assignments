import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
require('dotenv').config();

/**
 * Firebase configuration value
https://firebase.google.com/products/firestore[Accessed:30 June 2023]
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

/**
 * https://firebase.google.com/docs/database/web/start[Accessed:30 June 2023]
 */
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Registration = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //validation for all the input fields also handle errors
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(name)) {
      setError('Name should contain only letters');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password should contain at least 8 characters, including letters and digits');
      return;
    }

    const registrationData = {
      name,
      location,
      email,
      password,
    };

    const userStateData = {
      status: 'offline',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      ...registrationData,
    };
    
    /**
     * For storing data in firestore data in REg and state daatbase
     * https://www.geeksforgeeks.org/how-to-perform-fetch-and-send-with-firestore-using-reactjs/ [Accessed:30 June 2023]
     */
    try {
      const db = firebase.firestore();
      const regRef = await db.collection('Reg').add(registrationData);
      await db.collection('state').doc(regRef.id).set(userStateData);
      setName('');
      setLocation('');
      setEmail('');
      setPassword('');
      setError('');
      alert('Registration successful!');
      window.location.href = 'http://localhost:3001/login'; 
    } catch (error) {
      console.error('Error registering user:', error);

      //Erro handling while registering
      setError('Error while registering add input fields correctly.');
    }
  };

  /**
   *  Referered react documentation for Registration web page 
   * https://legacy.reactjs.org/docs/forms.html [Accessed:30 June 2023]
   */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  
            {/* innput field for name */}
           <input
             type="text"
             placeholder="Name"
             value={name}
            onChange={(e) => setName(e.target.value)}
             required
            style={{ marginBottom: '10px' }}
           />
          
          {/* input field for location  */}
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{ marginBottom: '10px' }}
          />

          {/* input field for email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '10px' }}
          />
            {/* input field for password */}
           <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '10px' }}
          />
            {/* error message */}
           {error && <p style={{ color: 'red' }}>{error}</p>} {}

           {/* Register button */}
        <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Registration;




