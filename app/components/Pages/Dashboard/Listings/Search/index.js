import { connect } from 'react-redux'
import React, { Component } from 'react'
import GMap from './GMap'

export default class Search extends Component {
  render() {
    console.log(this.props)
    return (
      <main className="c-lisitngs-layout__main">
        <GMap />
      </main>
    )
  }
}