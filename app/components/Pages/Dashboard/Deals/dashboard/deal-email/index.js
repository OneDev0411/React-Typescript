import React from 'react'
import { connect } from 'react-redux'
import Tooltip from '../../components/tooltip'
import LinkIcon from '../../../../../../views/components/SvgIcons/LinkIcon'
import copy from 'copy-text-to-clipboard'
import { addNotification as notify } from 'reapop'

const DealEmail = ({ deal, notify }) => (
  <Tooltip
    captionIsHTML
    tooltipStyles={{
      marginLeft: '-40px'
    }}
    overlayOptions={{
      delayHide: 200
    }}
    caption={
      deal.listing && (
        <div className="deal-email__tooltip">
          <p>Send documents to this deal by sending emails to this address:</p>
          <br />
          <p>{deal.email}</p>
        </div>
      )
    }
    placement="bottom"
    multiline
  >
    <div
      className="deal-email"
      onClick={() =>
        !deal.listing && !isSavingAddress && this.toggleShowAddressModal()
      }
    >
      <p className="deal-email__label">Email: </p>
      <p className="deal-email__text">{deal.email}</p>
      <button
        className="c-button--shadow"
        onClick={() => {
          copy(deal.email)
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
