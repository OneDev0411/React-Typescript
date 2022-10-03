// NoMatch.js
import React from 'react'

import { Link } from 'react-router'
import { useTitle } from 'react-use'

import { Container } from './styled'

const NoMatch = () => {
  useTitle('Not Found | Rechat')

  return (
    <React.Fragment>
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
}

export default NoMatch
