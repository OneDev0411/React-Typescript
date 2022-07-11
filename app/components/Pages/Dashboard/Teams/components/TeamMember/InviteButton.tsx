import { useState } from 'react'

import {
  makeStyles,
  Button,
  CircularProgress,
  Typography,
  Grid,
  Tooltip
} from '@material-ui/core'
import { mdiRefresh, mdiCheck, mdiEmailOutline } from '@mdi/js'
import format from 'date-fns/format'

import { useInviteUser } from '@app/models/brand/invite-user'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getUserLastInvitation } from '../../helpers/get-user-last-invitation'

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      marginRight: theme.spacing(4)
    },
    inviteSent: {
      marginRight: theme.spacing(2),
      display: 'flex',
      alignItems: 'center'
    },
    inviteSentIcon: {
      marginRight: theme.spacing(0.5)
    }
  }),
  { name: 'InviteButton' }
)

interface Props {
  team: IBrand
  user: IUser
  userRoles: IBrandRole[]
}

export function InviteButton({ team, user, userRoles }: Props) {
  const classes = useStyles()

  const [lastInvitationDate, setLastInvitationDate] = useState<Optional<Date>>(
    getUserLastInvitation(user, userRoles)
  )
  const isInvited = !!lastInvitationDate

  const { mutateAsync, isLoading } = useInviteUser({
    notify: {
      onSuccess: () => 'The invitation has been sent.',
      onError: 'Something went wrong. Please try again.'
    }
  })

  const inviteUser = () => {
    mutateAsync({
      user: user.id,
      brand: team.id
    }).then(() => {
      setLastInvitationDate(new Date())
    })
  }

  return (
    <Grid
      className={classes.wrapper}
      container
      direction="row-reverse"
      alignItems="center"
      wrap="nowrap"
    >
      {isInvited && (
        <>
          <Button
            size="small"
            variant="outlined"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SvgIcon path={mdiRefresh} size={muiIconSizes.small} />
              )
            }
            onClick={inviteUser}
          >
            {isLoading ? 'Resending...' : 'Resend Invitation'}
          </Button>
          <Tooltip
            title={
              lastInvitationDate
                ? `Last invitation sent at ${format(
                    lastInvitationDate,
                    'LLL dd, yyyy  hh:mmaaa'
                  )}`
                : 'Invitation sent.'
            }
          >
            <Typography
              className={classes.inviteSent}
              variant="body2"
              color="primary"
            >
              <SvgIcon
                path={mdiCheck}
                size={muiIconSizes.small}
                className={classes.inviteSentIcon}
              />
              Invitation sent
            </Typography>
          </Tooltip>
        </>
      )}
      {!isInvited && (
        <Button
          size="small"
          variant="outlined"
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SvgIcon path={mdiEmailOutline} size={muiIconSizes.small} />
            )
          }
          onClick={inviteUser}
        >
          {isLoading ? 'Inviting...' : 'Invite'}
        </Button>
      )}
    </Grid>
  )
}
