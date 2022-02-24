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

import { useReplaceQueryParam } from '@app/hooks/use-query-param'
import { AddMlsAgent } from 'components/AddMlsAgent'

import ConnectedAccountsLayout from './ConnectedAccountsLayout'

interface Props {
  className?: string
  user: IUser
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

export default function ConnectedAgents({ className, user }: Props) {
  const classes = useStyles()
  const [actionQueryParam, , removeActionQueryParam] =
    useReplaceQueryParam('action')

  // Automatically open the dialog when the url has the action query param
  const [isDialogOpen, setIsDialogOpen] = useState(
    Boolean(actionQueryParam && actionQueryParam === 'add-mls-account')
  )

  const oncloseDialog = () => {
    setIsDialogOpen(false)
    removeActionQueryParam()
  }

  return (
    <ConnectedAccountsLayout
      className={className}
      title="MLS"
      description="Enter your agent license # to unlock MLS features."
      action={
        <Button
          href=""
          variant="outlined"
          size="small"
          onClick={() => setIsDialogOpen(true)}
        >
          Add MLS Account
        </Button>
      }
    >
      {user.agents?.map((agent, key) => (
        <ListItem key={`${agent.id}-${key}`} className={classes.bordered}>
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
                        {agent.status || 'Unknown'}
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

      <AddMlsAgent isOpen={isDialogOpen} user={user} onClose={oncloseDialog} />
    </ConnectedAccountsLayout>
  )
}
