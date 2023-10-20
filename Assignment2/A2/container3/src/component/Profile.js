import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

require('dotenv').config();

/**
 * Firebase configuration value
https://firebase.google.com/products/firestore [Accessed:30 June 2023]
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
 * https://firebase.google.com/docs/database/web/start [Accessed:30 June 2023]
 */
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const LoginValidation = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  // Fetch user data from Firestore database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const db = firebase.firestore();
        const onlineUsersSnapshot = await db.collection('state')
          .where('status', '==', 'online')
          .get();

        if (!onlineUsersSnapshot.empty) {
          const onlineUsersData = onlineUsersSnapshot.docs.map((doc) => doc.data());
          setUserData(onlineUsersData);
          setLoggedIn(true);
        } else {
          setError('No online user available');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error while fetching user details');
      }
    };

    fetchUserData();
  }, []);

  // Sign out the user and update their status to offline
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      await updateUserStatus('offline');

      setLoggedIn(false);
      setUserData(null);
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Error while logging out');
    }
  };

  const updateUserStatus = async (status) => {
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      try {
        const db = firebase.firestore();
        await db.collection('state').doc(currentUser.uid).update({ status });
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    }
  };


   /**
   *  Referered react documentation for Profile web page 
   * https://legacy.reactjs.org/docs/forms.html [Accessed:30 June 2023]
   */
  return (
    <div>
      {loggedIn ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {userData && userData.length > 0 ? (
            <div>
              <h2>Welcome, {userData[0].name}!</h2>
              <h3>Location: {userData[0].location}</h3>
              <h3>Email Id: {userData[0].email}</h3>
              <button onClick={handleLogout}>Logout</button>
              {userData.length > 1 && (
                <div>
                  <h3>Other online users:</h3>
                  <ul>
                    {userData.slice(1).map((user) => (
                      <li key={user.id}>{user.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <h2>No online user available</h2>
          )}
        </div>
      ) : (
        <h2>{error || 'No online user available'}</h2>
      )}
    </div>
  );
};

export default LoginValidation;
