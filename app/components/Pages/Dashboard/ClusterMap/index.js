import React, { Component } from 'react'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import GMap from './GMap'

export default class ClusterMap extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="c-cluster-map">
        <header className="banner">
          <div>
            Clustering example (zoom, move to play with)
          </div>
        </header>
        <main className="main">
          <GMap user={this.props.data.user} />
        </main>
      </div>
    )
  }
}
