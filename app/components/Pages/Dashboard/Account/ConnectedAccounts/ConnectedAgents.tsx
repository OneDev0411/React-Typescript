import { useState } from 'react'

import {
  Box,
  Grid,
  ListItem,
  Theme,
  makeStyles,
  Typography,
  Button,
  Chip
} from '@material-ui/core'
import cn from 'classnames'

import { AddMlsAgent } from 'components/AddMlsAgent'

interface Props {
  user: IUser
  onDelete: () => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    bordered: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    status: {
      display: 'inline-block',
      marginRight: theme.spacing(1),
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      borderRadius: '100%',
      backgroundColor: theme.palette.grey['700'],
      '&.Active': {
        backgroundColor: theme.palette.success.main
      }
    }
  }),
  { name: 'ConnectedAgentsListItem' }
)

export default function ConnectedAgents({ user, onDelete }: Props) {
  const classes = useStyles()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Box mb={1} mt={6}>
        <Typography variant="subtitle1">MLS</Typography>

        <Typography variant="body2" color="textSecondary">
          Enter your agent license # to unlock MLS features.
        </Typography>
      </Box>

      <Box my={2}>
        <Button
          href=""
          variant="outlined"
          size="small"
          onClick={() => setIsDialogOpen(true)}
        >
          Add MLS Account
        </Button>
      </Box>

      {user.agents?.map((agent, key) => (
        <ListItem
          key={`${agent.id}-${key}`}
          className={classes.bordered}
          button
        >
          <Grid container>
            <Grid item xs={5}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <div>
                  <Typography variant="body1">{agent.mlsid}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {agent.mls} {agent.full_name ? ` - ${agent.full_name}` : ''}
                  </Typography>
                </div>

                <Box mr={3}>
                  <Chip
                    variant="outlined"
                    size="small"
                    label={
                      <Box display="flex" alignItems="center">
                        <span className={cn(classes.status, agent.status)} />
                        {agent.status}
                      </Box>
                    }
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box display="flex" alignItems="center" height="100%">
                <Typography variant="body2" color="textSecondary">
                  Email:&nbsp;
                </Typography>
                <Typography variant="body2">{agent.email}</Typography>
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Box display="flex" alignItems="center" height="100%">
                <Typography variant="body2" color="textSecondary">
                  Office:&nbsp;
                </Typography>

                <Typography variant="body2">
                  {agent.office ? agent.office.name : '-'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </ListItem>
      ))}

      <AddMlsAgent
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  )
}
