import "./App.css";
import HomePage from "./components/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Caesar from "./components/Caesar";
import Vignere from "./components/Vignere";
import Playfair from "./components/Playfair";
import Affine from "./components/Affine";
import Polybius from "./components/Polybius";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  return (
    <div className="App">
      {/* <HomePage /> */}
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/caesar" element={<Caesar />} />
          <Route exact path="/vignere" element={<Vignere />} />
          <Route exact path="/playfair" element={<Playfair />} />
          <Route exact path="/affine" element={<Affine />} />
          <Route exact path="/polybius" element={<Polybius />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
