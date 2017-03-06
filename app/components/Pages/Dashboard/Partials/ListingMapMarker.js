import React from 'react'
import S from 'shorti'

export default class ListingMapMarker extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        key={ this.props.key }
        onMouseOver={ this.props.onMouseOver }
        onMouseOut={ this.props.onMouseOut }
        onClick={ this.props.onClick }
        style={ S('pointer mt-10') }
      >
        { this.props.children }
      </div>
    )
  }
}
