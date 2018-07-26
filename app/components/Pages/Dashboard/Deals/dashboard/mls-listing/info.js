import React, { Component } from 'react'
import ListingStatus from './listing-status'

class Info extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovered: false
    }

    this._setHoverState = this._setHoverState.bind(this)
  }

  _setHoverState(isHovered) {
    this.setState({
      isHovered
    })
  }

  render() {
    const { isHovered } = this.state
    const { deal, editMls, deleteMls } = this.props
    const hasMLSAddress = deal && deal.mls_context

    return (
      <div className="mls-info">
        {!deal.is_draft && <ListingStatus deal={deal} />}

        <div
          className="item"
          onMouseEnter={() => this._setHoverState(true)}
          onMouseLeave={() => this._setHoverState(false)}
        >
          <div className="lbl">MLS#</div>
          <div className="value mls-number">
            {(hasMLSAddress && deal.mls_context.mls_number) || '-'}

            {isHovered && (
              <button className="c-button--shadow" onClick={editMls}>
                EDIT
              </button>
            )}

            {hasMLSAddress && (
              <button onClick={deleteMls} className="c-button--shadow">
                <i className="fa fa-times-circle" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Info
