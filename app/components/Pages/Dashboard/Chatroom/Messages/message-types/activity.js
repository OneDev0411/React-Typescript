import React from 'react'
import moment from 'moment'
import Flex from 'styled-flex-component'
import { mdiBellOutline } from '@mdi/js'
import { useTheme, makeStyles, Tooltip } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    box: {
      width: theme.spacing(3.5),
      height: theme.spacing(3.5),
      border: `1px solid ${theme.palette.grey.A100}`,
      borderRadius: '100%',
      marginRight: theme.spacing(2)
    }
  }),
  { name: 'MessageActivity' }
)
export default ({ message }) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <div className="activity">
      <Flex>
        <span className={classes.box}>
          <SvgIcon path={mdiBellOutline} color={theme.palette.grey[500]} />
        </span>
        <span className="name">{message.comment}</span>
      </Flex>

      <Tooltip
        title={moment.unix(message.created_at).format('MMM DD, YYYY h:mmA')}
        placement="left"
      >
        <span>{moment.unix(message.created_at).fromNow()}</span>
      </Tooltip>
    </div>
  )
}
