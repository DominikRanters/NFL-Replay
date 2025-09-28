// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBvjFi4IxgJ_Wgb0ZtSdOVGiq5w1TeZgQ8',
	authDomain: 'nfl-replay.firebaseapp.com',
	projectId: 'nfl-replay',
	storageBucket: 'nfl-replay.firebasestorage.app',
	messagingSenderId: '342301957177',
	appId: '1:342301957177:web:bbc395b0217f2a760541e8',
	measurementId: 'G-7LGYEVL53T'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firebase app and analytics for use throughout the application
export { app, analytics };
export default app;
