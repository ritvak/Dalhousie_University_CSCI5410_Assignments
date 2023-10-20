import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
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

//validation for email and password
const LoginValidation = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const db = firebase.firestore();
      const querySnapshot = await db
        .collection('Reg')
        .where('email', '==', email)
        .limit(1)
        .get();

      /**
       * refered below source to excute the query in firestore database
       * https://googleapis.dev/nodejs/firestore/latest/QuerySnapshot.html#:~:text=A%20QuerySnapshot%20contains%20zero%20or,the%20empty%20and%20size%20properties.[Accessed:30 June 2023]
       */
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        if (user.password === password) {
          setLoggedIn(true);
          await updateUserStatus(querySnapshot.docs[0].id, 'online');
          setLoginMessage('Login successful!');
          alert('Login successful!');
          window.location.href = 'http://localhost:3001/profile';  
          return;
        }
      }

      setLoginMessage('Invalid email or password');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error while logging in , enetr valid credentials');
    }
  };

  const updateUserStatus = async (docId, status) => {
    try {
      const db = firebase.firestore();
      await db.collection('state').doc(docId).update({ status });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

   /**
   *  Referered react documentation for Login web page 
   * https://legacy.reactjs.org/docs/forms.html [Accessed:30 June 2023]
   */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* input field for email while sign up */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '10px' }}
          />
          {/* input field for password while sign up */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '10px' }}
          />
        </div>

        {/* login button */}
        <button type="submit">Login</button>
      </form>

      {/* login message on successful login */}
      {loginMessage && <p>{loginMessage}</p>}

      {/* pop up for successful login */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h3>Login Successful!</h3>
          <p>Welcome to the application.</p>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default LoginValidation;
