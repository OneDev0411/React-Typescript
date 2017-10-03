// Oops.js
import React from 'react'
import { Link } from 'react-router'

const TITLE = 'Something went wrong!'

const MESSAGE = (
  <p>
    Help us improve your experience by sending an error{' '}
    <a href="mailto:support@rechat.com">report</a> or allow us to take you back{' '}
    <Link to="/">home</Link>.
  </p>
)

const Oops = ({ title = TITLE, message = MESSAGE }) => (
  <div className="c-oops">
    <Link to="/" className="c-oops__logo din">
      Rechat
    </Link>
    <div className="c-oops__body text-center">
      <h1 className="c-oops__body__title tk-calluna-sans">{title}</h1>
      <div className="c-oops__body__message">{message}</div>
    </div>
  </div>
)

export default Oops
