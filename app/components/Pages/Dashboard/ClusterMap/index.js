import React, { Component } from 'react'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import GMap from './GMap'

export default class ClusterMap extends Component {
  render() {
    return (
      <div className="c-cluster-map">
        <header className="header">
          <div>
            Clustering example google-map-react (zoom, move to play with)
          </div>
        </header>
        <main className="main">
          <GMap />
        </main>
      </div>
    )
  }
}
