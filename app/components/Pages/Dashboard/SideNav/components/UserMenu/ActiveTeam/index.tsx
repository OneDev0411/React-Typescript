import { useState } from 'react'

import { Typography, Theme, makeStyles } from '@material-ui/core'
import { mdiAccountGroupOutline } from '@mdi/js'

import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'
import useNotify from '@app/hooks/use-notify'
import { switchActiveTeam } from '@app/models/user/switch-active-team'
import { setImpersonateUser } from '@app/utils/impersonate-user'
import {
  NodeRenderer,
  BrandAvailableToUserSelectorDrawer
} from '@app/views/components/BrandSelector'
import Loading from '@app/views/components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { Agent, BrandedUser } from '@app/views/components/TeamAgents/types'
import { TeamAgentsDrawer } from '@app/views/components/TeamAgentsDrawer'

import { TeamSwitchBrandSelectorRenderer as Brand } from './components/TeamSwitchBrandSelectorRenderer'

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

export function ActiveTeam() {
  const classes = useStyles()
  const notify = useNotify()
  const activeBrand = useUnsafeActiveBrand()

  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useState<boolean>(false)
  const [isImpersonateUserSelectorOpen, setIsImpersonateUserSelectorOpen] =
    useState<boolean>(false)
  const [isSwitchingActiveTeam, setIsSwitchingActiveTeam] =
    useState<boolean>(false)
  const [selectedBrandToSwitch, setSelectedBrandToSwitch] =
    useState<Nullable<IBrand>>(null)

  // handle brand selector drawer state
  const hanldeOpenBrandSelectorDrawer = () => setIsBrandSelectorOpen(true)
  const hanldeCloseBrandSelectorDrawer = () => setIsBrandSelectorOpen(false)

  // handle impersonate user selector drawer state
  const hanldeOpenImpersonateSelectorDrawer = () =>
    setIsImpersonateUserSelectorOpen(true)
  const hanldeCloseImpersonateSelectorDrawer = () =>
    setIsImpersonateUserSelectorOpen(false)

  const handleOnClickBrand = async (brand: IBrand) => {
    try {
      // setIsSwitchingActiveTeam(true)
      // hanldeCloseBrandSelectorDrawer()
      console.log({ brand })
      setSelectedBrandToSwitch(brand)
      hanldeOpenImpersonateSelectorDrawer()
      // await switchActiveTeam(brand.id)
      // window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }
  const handleSelectImpersonateUser = (users: Agent[]) => {
    const selectedImpersonateUser: BrandedUser = users[0]?.agent

    if (!selectedImpersonateUser) {
      notify({
        status: 'error',
        message: 'The user is not valid.'
      })
    }

    setImpersonateUser(selectedImpersonateUser)
    console.log('handleSelectImpersonateUser', selectedImpersonateUser)
  }
  const renderBrandNode = ({ brand }: NodeRenderer) => {
    return (
      <Brand
        brand={brand}
        isActive={brand.id === activeBrand?.id}
        onClick={() => handleOnClickBrand(brand)}
      />
    )
  }

  if (!activeBrand) {
    return (
      <div className={classes.container}>
        <Loading />
      </div>
    )
  }

  return (
    <>
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

            <Typography variant="subtitle2">{activeBrand.name}</Typography>
          </div>
          <div
            className={classes.switchTeam}
            onClick={hanldeOpenBrandSelectorDrawer}
          >
            {isSwitchingActiveTeam ? 'Switching...' : 'Change'}
          </div>
        </div>
      </div>
      {isBrandSelectorOpen && (
        <BrandAvailableToUserSelectorDrawer
          open
          drawerTitle="Switch Team"
          width="43rem"
          onClose={hanldeCloseBrandSelectorDrawer}
          brandSelectorProps={{
            nodeRenderer: renderBrandNode
          }}
        />
      )}
      {isImpersonateUserSelectorOpen && selectedBrandToSwitch && (
        <TeamAgentsDrawer
          open
          bareMode
          width="43rem"
          title="Select Impersonate User"
          currentAgents={[selectedBrandToSwitch]}
          onSelectAgents={handleSelectImpersonateUser}
          onClose={hanldeCloseImpersonateSelectorDrawer}
        />
      )}
    </>
  )
}
