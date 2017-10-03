// NoMatch.js
import React from 'react'
import { Link } from 'react-router'

const NoMatch = () => (
  <div className="noMatch">
    <h1 className="logo">Rechat</h1>
    <div id="main-content" className="container text-center">
      <h1 className="tk-calluna-sans">
        The page you were looking for doesn’t exist. Beautiful skyline, though.
      </h1>
      <Link to="/">Take me home</Link>
    </div>
  </div>
)

export default NoMatch
