import {
  Box,
  Grid,
  ListItem,
  ListItemSecondaryAction,
  Theme,
  makeStyles,
  Typography,
  Button,
  Chip
} from '@material-ui/core'
import cn from 'classnames'

import { DangerButton } from 'components/Button/DangerButton'

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

  return (
    <>
      <Box mb={1} mt={6}>
        <Typography variant="subtitle1">MLS</Typography>

        <Typography variant="body2" color="textSecondary">
          Enter your agent license # to unlock MLS features.
        </Typography>
      </Box>

      <Box my={2}>
        <Button href="" variant="outlined" size="small" onClick={() => {}}>
          Add MLS Account
        </Button>
      </Box>

      {user.agents?.map(agent => (
        <ListItem key={agent.id} className={classes.bordered} button>
          <Grid container>
            <Grid item xs={4}>
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

                <Box mr={2}>
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

            <Grid item xs={3}>
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

            <ListItemSecondaryAction>
              <DangerButton variant="outlined" size="small" onClick={onDelete}>
                Delete
              </DangerButton>
            </ListItemSecondaryAction>
          </Grid>
        </ListItem>
      ))}
    </>
  )
}
