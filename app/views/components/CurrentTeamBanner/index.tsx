import { Typography, IconButton, makeStyles, Theme } from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import { useSelector } from 'react-redux'
import { useCookie } from 'react-use'

import { selectUser } from '@app/selectors/user'
import { getActiveTeam, getActiveTeamPalette } from '@app/utils/user-teams'

import Acl from '../Acl'
import { SvgIcon } from '../SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 4),
      backgroundColor: theme.palette.info.main
    }
  }),
  {
    name: 'CurrentTeamBanner'
  }
)
export function CurrentTeamBanner() {
  const classes = useStyles()

  const [cookie, setCookie] = useCookie('active-team-banner')

  const user = useSelector(selectUser)
  const team = getActiveTeam(user)!
  const palette = getActiveTeamPalette(user)

  const isOpen = cookie ? JSON.parse(cookie)[team.brand.id] !== false : true

  const handleClose = () => {
    setCookie(
      JSON.stringify({
        [team.brand.id]: false
      })
    )
  }

  if (!isOpen) {
    return null
  }

  return (
    <Acl.Admin>
      <div
        className={classes.root}
        style={{
          backgroundColor: palette['body-bg-color']
        }}
      >
        <Typography
          variant="body1"
          style={{
            color: palette['body-text-color'] || '#000'
          }}
        >
          You are in team <strong>{team?.brand.name}</strong>
        </Typography>

        <IconButton size="small" onClick={handleClose}>
          <SvgIcon path={mdiClose} />
        </IconButton>
      </div>
    </Acl.Admin>
  )
}
