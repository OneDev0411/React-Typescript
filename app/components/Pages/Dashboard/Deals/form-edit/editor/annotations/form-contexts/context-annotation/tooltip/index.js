import React from 'react'

import ToolTip from 'components/tooltip'

export default function ContextToolTip(props) {
  if (props.hasMlsLock) {
    return (
      <ToolTip
        captionIsHTML
        isCustom={false}
        caption={
          <React.Fragment>
            <img src="/static/images/deals/lock.svg" alt="locked" />
            <div>
              Listing information can only be changed on MLS. Once changed, the
              update will be reflected here.
            </div>
          </React.Fragment>
        }
        placement="bottom"
        multiline
      >
        {props.children}
      </ToolTip>
    )
  }

  return props.children
}
