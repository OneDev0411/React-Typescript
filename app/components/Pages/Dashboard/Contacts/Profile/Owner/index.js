import React from 'react'
import { Box, Typography, Tooltip, makeStyles } from '@material-ui/core'

import { TeamContactSelect } from '../../../../../../views/components/TeamContact/TeamContactSelect'
import { ItemChangelog } from '../../../../../../views/components/TeamContact/ItemChangelog'
import { isSoloActiveTeam } from '../../../../../../utils/user-teams'

const useStyles = makeStyles(
  theme => ({
    container: {
      padding: theme.spacing(2, 0, 2),
      borderTop: `1px solid ${theme.palette.action.disabledBackground}`
    },
    owner: {
      display: 'inline-flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
      cursor: 'pointer'
    },
    label: {
      marginLeft: theme.spacing(0.5),
      color: theme.palette.grey[500]
    }
  }),
  { name: 'ContactProfile' }
)
export const Owner = props => {
  const classes = useStyles()

  if (props.user && isSoloActiveTeam(props.user)) {
    return null
  }

  return (
    <Box className={classes.container}>
      <TeamContactSelect
        {...props}
        buttonRenderer={buttonProps => {
          const title = buttonProps.selectedItem.label

          return (
            <Tooltip title="Click to Change">
              <Box className={classes.owner} onClick={buttonProps.onClick}>
                <Typography variant="body2">{title}</Typography>
                <Typography variant="caption" className={classes.label}>
                  Owner
                </Typography>
              </Box>
            </Tooltip>
          )
        }}
        upsideDown
        fullWidth
      />
      <ItemChangelog item={props.contact} />
    </Box>
  )
}
