import React from 'react'
import Flex from 'styled-flex-component'
import {
  mdiEmailOpenOutline,
  mdiCursorDefaultClickOutline,
  mdiCloseCircleOutline,
  mdiMinusCircleOutline
} from '@mdi/js'
import { makeStyles } from '@material-ui/core'

import { Divider } from 'components/Divider'
import { red, yellow } from 'views/utils/colors'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    icon: {
      color: theme.palette.grey['600'],
      marginRight: theme.spacing(0.5)
    }
  }),
  { name: 'EmailMeta' }
)

export default function EmailMeta({ bounced, unsubscribed, opened, clicked }) {
  const classes = useStyles()
  const dividerProps = {
    width: '1px',
    height: '1em',
    margin: '0 0.5em'
  }

  const bouncedColor = red.A100
  const unsubscribedColor = yellow.A100

  return (
    <Flex alignCenter style={{ fontWeight: 500 }}>
      <Divider {...dividerProps} />
      {bounced && (
        <React.Fragment>
          <SvgIcon
            path={mdiCloseCircleOutline}
            color={bouncedColor}
            className={classes.icon}
          />
          <span style={{ color: bouncedColor }}>Bounced</span>
        </React.Fragment>
      )}
      {unsubscribed && (
        <React.Fragment>
          <SvgIcon
            path={mdiMinusCircleOutline}
            color={unsubscribedColor}
            className={classes.icon}
          />
          <span style={{ color: unsubscribedColor }}>Unsubscribed</span>
          <Divider {...dividerProps} />
        </React.Fragment>
      )}
      {!bounced && (
        <React.Fragment>
          <SvgIcon path={mdiEmailOpenOutline} className={classes.icon} />
          {`${opened} Opened`}
          <Divider {...dividerProps} />
          <SvgIcon
            path={mdiCursorDefaultClickOutline}
            className={classes.icon}
          />
          {`${clicked} Clicked`}
        </React.Fragment>
      )}
    </Flex>
  )
}
