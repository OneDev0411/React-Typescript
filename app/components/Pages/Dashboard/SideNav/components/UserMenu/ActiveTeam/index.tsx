import { useState, useMemo } from 'react'

import { Typography, Theme, makeStyles } from '@material-ui/core'
import { mdiAccountGroupOutline } from '@mdi/js'
import { useSelector } from 'react-redux'

import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'
import { switchActiveTeam } from '@app/models/user/switch-active-team'
import { selectUser } from '@app/selectors/user'
import {
  setImpersonateUser,
  removeImpersonateUser
} from '@app/utils/impersonate-user'
import { getBrandUsers } from '@app/utils/user-teams'
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
  const activeBrand = useUnsafeActiveBrand()
  const user = useSelector(selectUser)

  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useState<boolean>(false)
  const [isImpersonateUserSelectorOpen, setIsImpersonateUserSelectorOpen] =
    useState<boolean>(false)
  const [isSwitchingActiveTeam, setIsSwitchingActiveTeam] =
    useState<boolean>(false)
  const [selectedBrandToSwitch, setSelectedBrandToSwitch] =
    useState<Nullable<IBrand>>(null)
  const isCurrentUserExistInActiveBrand = useMemo(() => {
    if (activeBrand) {
      const activeBrandUsers = getBrandUsers(activeBrand)

      return activeBrandUsers.some(u => u.id === user.id)
    }

    return false
  }, [activeBrand, user.id])

  // handle brand selector drawer state
  const hanldeOpenBrandSelectorDrawer = () => setIsBrandSelectorOpen(true)
  const hanldeCloseBrandSelectorDrawer = () => setIsBrandSelectorOpen(false)

  // handle impersonate user selector drawer state
  const hanldeOpenImpersonateSelectorDrawer = () =>
    setIsImpersonateUserSelectorOpen(true)
  const hanldeCloseImpersonateSelectorDrawer = () =>
    setIsImpersonateUserSelectorOpen(false)

  const handleSwitchTeam = async (brand: IBrand, user?: BrandedUser) => {
    try {
      setIsSwitchingActiveTeam(true)

      if (user) {
        setImpersonateUser(user)
      } else {
        removeImpersonateUser()
      }

      await switchActiveTeam(brand.id)
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  const handleSelectBrand = async (brand: IBrand) => {
    const selectedBrandUsers = getBrandUsers(brand)
    const isCurrentUserExistInSelectedBrand = selectedBrandUsers.some(
      u => u.id === user.id
    )

    if (isCurrentUserExistInSelectedBrand) {
      await handleSwitchTeam(brand)

      return
    }

    if (brand.member_count === 1) {
      await handleSwitchTeam(brand, selectedBrandUsers[0])

      return
    }

    setSelectedBrandToSwitch(brand)
    hanldeOpenImpersonateSelectorDrawer()
  }

  const handleSelectImpersonateUser = async (users: Agent[]) => {
    const selectedImpersonateUser: BrandedUser = users[0]?.agent

    if (!selectedBrandToSwitch || !selectedImpersonateUser) {
      return
    }

    hanldeCloseImpersonateSelectorDrawer()
    hanldeCloseBrandSelectorDrawer()
    await handleSwitchTeam(selectedBrandToSwitch, selectedImpersonateUser)
  }

  const handlePassingSelectedBrand = async (_: Nullable<UUID>) =>
    selectedBrandToSwitch ? [selectedBrandToSwitch] : []

  const renderBrandNode = ({ brand }: NodeRenderer) => {
    const isActive = brand.id === activeBrand?.id
    const isDisabled = isActive && isCurrentUserExistInActiveBrand

    return (
      <Brand
        brand={brand}
        isActive={isActive}
        disabled={isDisabled}
        onClick={() => handleSelectBrand(brand)}
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
          width="43rem"
          title="Select Impersonate User"
          teamAgentsModelFn={handlePassingSelectedBrand}
          onSelectAgents={handleSelectImpersonateUser}
          onClose={hanldeCloseImpersonateSelectorDrawer}
        />
      )}
    </>
  )
}
