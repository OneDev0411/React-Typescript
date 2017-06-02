import React from 'react'
import { Link } from 'react-router'

import Tabs from './components/Tabs'

export default class Listings extends React.Component {
  render() {
    return (
      <div className="c-listings">
        <Tabs />
        {this.props.children}
      </div>
    )
  }
}