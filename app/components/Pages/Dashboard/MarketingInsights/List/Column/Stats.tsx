import React, { useState } from 'react'
import {
  Popper,
  List,
  ListItem,
  Tooltip,
  ListItemText,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'

import { percent } from '../helpers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    statBtn: {
      cursor: 'pointer',
      textDecoration: 'underline'
      // color: props => (isOpen ? theme.palette.primary.main : 'inherit')
    },
    list: {
      marginTop: theme.spacing(0.5),
      background: '#fff',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1]
    }
  })
)

interface Props {
  data: IEmailCampaign
}

function StatsColumn({ data }: Props) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'view-stats-popper' : undefined

  return (
    <>
      <span
        aria-describedby={id}
        onClick={handleClick}
        className={classes.statBtn}
      >
        View Stats
      </span>
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        <List disablePadding className={classes.list}>
          {data.executed_at ? (
            <>
              <Tooltip title={`${percent(data.failed, data.sent)}% Bounced`}>
                <ListItem divider>
                  <ListItemText
                    primary={`Delivered: ${percent(
                      data.delivered,
                      data.sent
                    )}%`}
                  />
                </ListItem>
              </Tooltip>
              <Tooltip title={`${data.opened} Recipients`}>
                <ListItem divider>
                  <ListItemText
                    primary={`Open Rate: ${percent(data.opened, data.sent)}%`}
                  />
                </ListItem>
              </Tooltip>
              <Tooltip title={`${data.clicked} Times`}>
                <ListItem>
                  <ListItemText
                    primary={`Click Rate: ${percent(data.clicked, data.sent)}%`}
                  />
                </ListItem>
              </Tooltip>
            </>
          ) : (
            <ListItem>
              <ListItemText primary="Not Executed" />
            </ListItem>
          )}
        </List>
      </Popper>
    </>
  )
}

export default StatsColumn
