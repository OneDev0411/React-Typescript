import React from 'react'
import Flex from 'styled-flex-component'

import { Divider } from 'components/Divider'
import { grey, red, yellow } from 'views/utils/colors'
import ClickedIcon from 'components/SvgIcons/Clicked/IconClicked'
import OpenedIcon from 'components/SvgIcons/OpenedEmail/IconOpenedEmail'
import BouncedIcon from 'components/SvgIcons/CircleClose/IconCircleClose'
import UnsubscriedIcon from 'components/SvgIcons/CircleRemove/IconCircleRemove'

export default function EmailMeta({ bounced, unsubscribed, opened, clicked }) {
  const dividerProps = {
    width: '1px',
    height: '1em',
    margin: '0 0.5em'
  }

  const iconStyle = {
    fill: grey.A900,
    marginRight: '0.25em'
  }

  const bouncedColor = red.A100
  const unsubscribedColor = yellow.A100

  return (
    <Flex alignCenter style={{ fontWeight: 500 }}>
      <Divider {...dividerProps} />
      {bounced && (
        <React.Fragment>
          <BouncedIcon style={{ ...iconStyle, fill: bouncedColor }} />
          <span style={{ color: bouncedColor }}>Bounced</span>
        </React.Fragment>
      )}
      {unsubscribed && (
        <React.Fragment>
          <UnsubscriedIcon style={{ ...iconStyle, fill: unsubscribedColor }} />
          <span style={{ color: unsubscribedColor }}>Unsubscribed</span>
          <Divider {...dividerProps} />
        </React.Fragment>
      )}
      {!bounced && (
        <React.Fragment>
          <OpenedIcon style={iconStyle} />
          {`${opened} Opened`}
          <Divider {...dividerProps} />
          <ClickedIcon style={iconStyle} />
          {`${clicked} Clicked`}
        </React.Fragment>
      )}
    </Flex>
  )
}
