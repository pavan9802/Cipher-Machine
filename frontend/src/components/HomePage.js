import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const [cipher, setCipher] = React.useState();

  const handleChange = (event) => {
    setCipher(event.target.value);
    const option = document.getElementById(event.target.value);
    option.click();
  };

  return (
    <div class="hp_container">
      <div class="title_div">
        <h1 class="title">Select a Cipher</h1>
      </div>
      <div>
        <select class="select" value={cipher} onChange={handleChange}>
          <option>Choose Here</option>
          <Link id="affine" to="/affine"></Link>
          <option value="affine">Affine</option>

          <Link id="caesar" to="/caesar"></Link>
          <option value="caesar">Caesar</option>

          <Link id="playfair" to="/playfair"></Link>
          <option value="playfair">Playfair</option>

          <Link id="polybius" to="/polybius"></Link>
          <option value="polybius">Polybius</option>

          <Link id="vignere" to="/vignere"></Link>
          <option value="vignere">Vignere</option>
        </select>
      </div>
    </div>
  );
}

export default HomePage;
