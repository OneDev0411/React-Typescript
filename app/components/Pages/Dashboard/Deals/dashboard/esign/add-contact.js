import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default class AddContact extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render () {
    return (
      <OverlayTrigger
        container={this}
        trigger="click"
        placement="bottom"
        className="esign-add-contact"
        overlay={
          <Popover
            id="deal-esign-popover-add-contact"
            className="esign-add-contact--popover"
            title={null}
          >
            <div className="hero">Add a recipient</div>

            <input type="text" placeholder="First Name"/>
            <input type="text" placeholder="Last Name"/>
            <input type="text" placeholder="Email"/>

            <div className="cta">
              <button className="btn-cancel">Cancel</button>
              <button className="btn-add">Add</button>
            </div>
          </Popover>
        }
      >
        <div className="inline">
          <span className="item-title">
            Each message will be sent separately. Recipients will not see each other.
          </span>

          <span></span>
        </div>
      </OverlayTrigger>
    )
  }
}
