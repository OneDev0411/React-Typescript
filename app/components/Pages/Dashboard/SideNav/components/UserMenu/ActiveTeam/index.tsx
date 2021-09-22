import { useState, useMemo } from 'react'

import { Typography, Theme, makeStyles } from '@material-ui/core'
import { mdiAccountGroupOutline } from '@mdi/js'

import { isFetchingSelectedTeam } from '@app/reducers/user'
import { viewAs, getActiveTeam } from '@app/utils/user-teams'
import {
  NodeRenderer,
  ButtonRenderer,
  BrandSelectorDrawer
} from '@app/views/components/BrandSelectorDrawer'
import Loading from '@app/views/components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { putUserSetting } from 'models/user/put-user-setting'

import { Brand } from './Brand'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(2)
    },
    header: {
      display: 'block',
      color: theme.palette.grey[500],
      marginBottom: theme.spacing(1),
      textTransform: 'uppercase'
    },
    activeTeamContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    activeTeam: {
      display: 'flex',
      alignItems: 'center'
    },
    activeTeamIcon: {
      color: theme.palette.common.black,
      marginRight: theme.spacing(1.25)
    },
    switchTeam: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      ...theme.typography.button
    }
  }),
  { name: 'ActiveTeam' }
)

interface SwitcherStatus {
  isSwitching: boolean
  switchedTeamId: UUID
}
interface Props {
  user: IUser
}

export function ActiveTeam({ user }: Props) {
  const classes = useStyles()
  const [switcherStatus, setSwitcherStatus] = useState<SwitcherStatus>({
    isSwitching: false,
    switchedTeamId: ''
  })

  const activeTeam = useMemo(() => getActiveTeam(user), [user])

  console.log({ activeTeam })

  const handleOnClickBrand = async (teamId: string, onClose: () => void) => {
    onClose()
    setSwitcherStatus({
      isSwitching: true,
      switchedTeamId: teamId
    })

    await putUserSetting('user_filter', viewAs(user, true), teamId)

    window.location.reload()
  }
  const renderBrandNode = ({ brand, onClose }: NodeRenderer) => {
    return (
      <Brand
        brand={brand}
        onClick={() => handleOnClickBrand(brand.id, onClose)}
      />
    )
  }

  if (isFetchingSelectedTeam(user)) {
    return (
      <div className={classes.container}>
        <Loading />
      </div>
    )
  }

  if (user && user.teams && user.teams.length > 0) {
    return (
      <div className={classes.container}>
        <Typography variant="overline" className={classes.header}>
          You’re working on
        </Typography>
        <div className={classes.activeTeamContainer}>
          <div className={classes.activeTeam}>
            <SvgIcon
              path={mdiAccountGroupOutline}
              className={classes.activeTeamIcon}
            />

            <Typography variant="subtitle2">
              {activeTeam?.brand.name}
            </Typography>
          </div>
          <BrandSelectorDrawer
            nodeRenderer={renderBrandNode}
            buttonRenderer={({ onOpen }: ButtonRenderer) => (
              <div className={classes.switchTeam} onClick={onOpen}>
                {switcherStatus.isSwitching ? 'Switching...' : 'Change'}
              </div>
            )}
          />
        </div>
      </div>
    )
    // return (
    //   <>
    //     {user.teams.map(team => {
    //       const teamId = team.brand.id
    //       return (
    //         <TeamItem
    //           key={team.id}
    //           disabled={switcherStatus.isSwitching}
    //           isSwitching={switcherStatus.switchedTeamId === teamId}
    //           onClick={() => onClickTeam(teamId)}
    //           selected={teamId === activeTeamId}
    //           team={team}
    //         />
    //       )
    //     })}
    //     <Divider role="separator" />
    //   </>
    // )
  }

  return null
}
