import {
  Grid,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Theme,
  Typography,
  makeStyles,
  createStyles
} from '@material-ui/core'
import Flex from 'styled-flex-component'

import { Avatar } from 'components/Avatar'
import { DangerButton } from 'components/Button/DangerButton'
import { getContactNameInitials } from 'models/contacts/helpers'

interface Props {
  user: IUser
  onDisconnect: () => void
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      bordered: {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }),
  { name: 'ConnectedDocuSignListItem' }
)

export default function ConnectedAccount({ user, onDisconnect }: Props) {
  const classes = useStyles()

  return (
    <Box mb={4}>
      <Box mb={1} mt={6}>
        <Typography variant="subtitle1">Docusign</Typography>
      </Box>

      <ListItem className={classes.bordered} button>
        <ListItemAvatar>
          <Avatar user={user} style={{ marginRight: '1rem' }}>
            {getContactNameInitials(user)}
          </Avatar>
        </ListItemAvatar>
        <Grid container>
          <Grid item xs={4}>
            <ListItemText
              primary={user.email}
              secondary={
                <Flex alignCenter>
                  <div style={{ marginRight: '0.5rem' }}>DocuSign</div>
                </Flex>
              }
            />
          </Grid>

          <ListItemSecondaryAction>
            <DangerButton
              variant="outlined"
              size="small"
              onClick={onDisconnect}
            >
              Disconnect Account
            </DangerButton>
          </ListItemSecondaryAction>
        </Grid>
      </ListItem>
    </Box>
  )
}
