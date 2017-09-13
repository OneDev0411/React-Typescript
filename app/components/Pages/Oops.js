// Oops.js
import React from 'react'
import { Link } from 'react-router'

const Oops = () =>
  <div className="c-oops">
    <h1 className="logo">Rechat</h1>
    <div id="main-content" className="container text-center">
      <h1 className="tk-calluna-sans">
        Oops. The page you were looking for doesn’t exist.
      </h1>
      <Link to="/">Take me home</Link>
    </div>
  </div>

export default Oops
