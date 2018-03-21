import React from 'react'
import { connect } from 'react-redux'
import Tooltip from '../../components/tooltip'
import LinkIcon from '../../../../../../views/components/SvgIcons/LinkIcon'
import copy from 'copy-text-to-clipboard'
import { addNotification as notify } from 'reapop'

const DealEmail = ({ dealEmail, notify }) => (
  <Tooltip
    captionIsHTML
    tooltipStyles={{
      marginLeft: '-40px'
    }}
    overlayOptions={{
      delayHide: 200
    }}
    caption={
      <div className="deal-email__tooltip">
        <p>Send documents to this deal by sending emails to this address:</p>
        <br />
        <p>{dealEmail}</p>
      </div>
    }
    placement="bottom"
    multiline
  >
    <div className="deal-email">
      <p className="deal-email__label">Email: </p>
      <p className="deal-email__text">{dealEmail}</p>
      <button
        className="c-button--shadow"
        onClick={() => {
          copy(dealEmail)
          notify({
            message: 'Link Copied',
            status: 'success'
          })
        }}
      >
        <LinkIcon />
      </button>
    </div>
  </Tooltip>
)

export default connect(null, { notify })(DealEmail)
