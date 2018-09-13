import React from 'react'
import { connect } from 'react-redux'
import Tooltip from 'views/components/tooltip'
import LinkIcon from 'views/components/SvgIcons/LinkIcon'
import copy from '../../../../../../utils/copy-text-to-clipboard'
import { addNotification as notify } from 'reapop'
import cn from 'classnames'

const DealEmail = ({ dealEmail, notify, marginBottom = false }) => (
  <Tooltip
    captionIsHTML
    isCustom={false}
    placement="bottom"
    tooltipStyles={{
      marginLeft: '-40px'
    }}
    overlayOptions={{
      delayHide: 200
    }}
    caption="Send documents to this deal by sending emails to this address."
    multiline
  >
    <button
      className={cn('c-button--shadow deal-email', { marginBottom })}
      onClick={() => {
        copy(dealEmail)
        notify({
          message: 'Link Copied',
          status: 'success'
        })
      }}
    >
      <p className="deal-email__label">Email: </p>
      <p className="deal-email__text">{dealEmail}</p>
      <div className=" deal-email__share-icon">
        <LinkIcon />
      </div>
    </button>
  </Tooltip>
)

export default connect(
  null,
  { notify }
)(DealEmail)
