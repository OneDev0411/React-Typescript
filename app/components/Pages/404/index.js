// NoMatch.js
import React from 'react'
import { Link } from 'react-router'
import { Helmet } from 'react-helmet'

import { Container } from './styled'

const NoMatch = () => (
  <React.Fragment>
    <Helmet>
      <title>Not Found | Rechat</title>
    </Helmet>
    <Container>
      <div className="wrapper">
        <h1 className="logo">Rechat</h1>
        <div className="content">
          <h2>
            The page you were looking for doesn’t exist. Beautiful skyline,
            though.
          </h2>
          <Link to="/">Take me home</Link>
        </div>
      </div>
    </Container>
  </React.Fragment>
)

export default NoMatch
