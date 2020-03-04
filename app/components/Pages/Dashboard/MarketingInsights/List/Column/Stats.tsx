import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'

import { percent } from '../helpers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative'
    },
    statBtn: {
      display: 'block',
      textAlign: 'center',
      lineHeight: '30px',
      cursor: 'help',
      textDecoration: 'underline',
      '&:hover + $list': {
        visibility: 'visible'
      }
    },
    list: {
      minWidth: 160,
      position: 'absolute',
      top: 0,
      left: '-42px',
      marginTop: theme.spacing(3.5),
      background: '#fff',
      visibility: 'hidden',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
      '&:hover': {
        visibility: 'visible'
      }
    }
  })
)

interface Props {
  data: IEmailCampaign
}

function StatsColumn({ data }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <span className={classes.statBtn}>View Stats</span>
      <List disablePadding className={classes.list}>
        {data.executed_at ? (
          <>
            <ListItem divider>
              <ListItemText
                primary={`Delivered: ${percent(data.delivered, data.sent)}%`}
                secondary={`${percent(data.failed, data.sent)}% Bounced`}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary={`Open Rate: ${percent(data.opened, data.sent)}%`}
                secondary={`${data.opened} Recipients`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Click Rate: ${percent(data.clicked, data.sent)}%`}
                secondary={`${data.clicked} Times`}
              />
            </ListItem>
          </>
        ) : (
          <ListItem>
            <ListItemText primary="Not Executed" />
          </ListItem>
        )}
      </List>
    </div>
  )
}

export default StatsColumn
