import React from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import _ from 'underscore'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

export default class ContextDiscrepency extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { placement, onClick } = this.props

    const rows = {
      'On MLS': '000',
      'On Rechat': '000',
      'Provided By': '000',
      Form: '000',
      'Approved By': '000',
      'Signed By': '000'
    }

    const overview = (
      <Popover id="deal-context-discrepency-overview-popover">
        <div className="rows">
          {_.map(rows, (value, name) => (
            <div className="data">
              <div>{name}</div>
              <div>{value}</div>
            </div>
          ))}
        </div>

        <ActionButton>View History</ActionButton>
      </Popover>
    )

    return (
      <OverlayTrigger
        trigger="click"
        placement={placement || 'bottom'}
        rootClose
        onClick={e => onClick && onClick(e)}
        overlay={overview}
      >
        <i className="fa fa-warning" />
      </OverlayTrigger>
    )
  }
}
