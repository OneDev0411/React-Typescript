import { useState, useMemo } from 'react'

import { Typography, Theme, makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'
import { getBrands } from '@app/models/BrandConsole/Brands'
import { switchActiveTeam } from '@app/models/user/switch-active-team'
import { selectUser, selectImpersonateUser } from '@app/selectors/user'
import {
  setImpersonateUser,
  removeImpersonateUser
} from '@app/utils/impersonate-user'
import { getBrandUsers } from '@app/utils/user-teams'
import { AnimatedLoader } from '@app/views/components/AnimatedLoader'
import {
  NodeRenderer,
  BrandAvailableToUserSelectorDrawer
} from '@app/views/components/BrandSelector'
import { Agent, BrandedUser } from '@app/views/components/TeamAgents/types'
import { TeamAgentsDrawer } from '@app/views/components/TeamAgentsDrawer'

import { TeamSwitchBrandSelectorRenderer as Brand } from './components/TeamSwitchBrandSelectorRenderer'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(2, 2, 1, 2)
    },
    header: {
      display: 'block',
      color: theme.palette.grey[500],
      textTransform: 'uppercase'
    },
    activeTeamContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    activeTeam: {
      display: 'flex',
      alignItems: 'center',
      maxWidth: '100%'
    },
    switchTeam: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      ...theme.typography.button
    },
    switchingIndicatorContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: theme.palette.common.white,
      zIndex: theme.zIndex.modal + 1
    },
    switchingIndicatorInfo: {
      display: 'inline-block',
      textAlign: 'center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    switchingIcon: {
      margin: 'auto',
      textAlign: 'center'
    },
    switchingLabel: {
      display: 'block',
      marginTop: theme.spacing(1),
      color: theme.palette.common.black,
      ...theme.typography.h5
    }
  }),
  { name: 'ActiveTeam' }
)

export function ActiveTeam() {
  const classes = useStyles()
  const activeBrand = useUnsafeActiveBrand()
  const user = useSelector(selectUser)
  const impersonateUser = useSelector(selectImpersonateUser)

  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useState<boolean>(false)
  const [isImpersonateUserSelectorOpen, setIsImpersonateUserSelectorOpen] =
    useState<boolean>(false)
  const [isSwitchingActiveTeam, setIsSwitchingActiveTeam] =
    useState<boolean>(false)
  const [selectedBrandToFetchUser, setSelectedBrandToFetchUser] =
    useState<Nullable<IBrand>>(null)
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
      hanldeCloseBrandSelectorDrawer()

      if (isImpersonateUserSelectorOpen) {
        hanldeCloseImpersonateSelectorDrawer()
      }

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
    try {
      setSelectedBrandToFetchUser(brand)

      if (brand.member_count === 0) {
        await handleSwitchTeam(brand)

        return
      }

      const { data: brandWithUsers } = await getBrands(brand.id, false)
      const selectedBrandUsers = getBrandUsers(brandWithUsers)

      const isCurrentUserExistInSelectedBrand = selectedBrandUsers.some(
        u => u.id === user.id
      )

      if (isCurrentUserExistInSelectedBrand) {
        await handleSwitchTeam(brandWithUsers)

        return
      }

      if (brandWithUsers.member_count === 1) {
        await handleSwitchTeam(brandWithUsers, selectedBrandUsers[0])

        return
      }

      setSelectedBrandToSwitch(brandWithUsers)
      hanldeOpenImpersonateSelectorDrawer()
    } catch (error) {
      console.error(error)
    } finally {
      setSelectedBrandToFetchUser(null)
    }
  }

  const handleSelectImpersonateUser = async (users: Agent[]) => {
    const selectedImpersonateUser: BrandedUser = users[0]?.agent

    if (!selectedBrandToSwitch || !selectedImpersonateUser) {
      return
    }

    await handleSwitchTeam(selectedBrandToSwitch, selectedImpersonateUser)
  }

  const handlePassingSelectedBrand = async (_: Nullable<UUID>) =>
    selectedBrandToSwitch ? [selectedBrandToSwitch] : []

  const renderBrandNode = ({ brand }: NodeRenderer) => {
    const isActive = activeBrand?.id === brand.id
    const isDisabled = isActive && isCurrentUserExistInActiveBrand
    const isFetchingUsers = selectedBrandToFetchUser?.id === brand.id

    return (
      <Brand
        brand={brand}
        isActive={isActive}
        disabled={isDisabled}
        isFetchingUser={isFetchingUsers}
        onClick={() => handleSelectBrand(brand)}
      />
    )
  }

  if (!activeBrand) {
    return null
  }

  return (
    <>
      {isSwitchingActiveTeam && (
        <div className={classes.switchingIndicatorContainer}>
          <div className={classes.switchingIndicatorInfo}>
            <div className={classes.switchingIcon}>
              <AnimatedLoader />
            </div>
            <span className={classes.switchingLabel}>Switching Team...</span>
          </div>
        </div>
      )}
      <div className={classes.container}>
        {impersonateUser && (
          <div>
            <Typography variant="overline" className={classes.header}>
              Working User
            </Typography>
            <div className={classes.activeTeamContainer}>
              <div className={classes.activeTeam}>
                <Typography variant="subtitle2" noWrap>
                  {impersonateUser.display_name}
                </Typography>
              </div>
            </div>
          </div>
        )}
        <div>
          <Typography variant="overline" className={classes.header}>
            Active Account
          </Typography>
          <div className={classes.activeTeamContainer}>
            <div className={classes.activeTeam}>
              <Typography variant="subtitle2" noWrap>
                {activeBrand.name}
              </Typography>
            </div>
            <div
              className={classes.switchTeam}
              onClick={hanldeOpenBrandSelectorDrawer}
            >
              Change
            </div>
          </div>
        </div>
      </div>
      {isBrandSelectorOpen && (
        <BrandAvailableToUserSelectorDrawer
          open
          drawerTitle="Select an Account"
          width="43rem"
          onClose={hanldeCloseBrandSelectorDrawer}
          brandSelectorProps={{
            shouldExpandOnNodeClick: true,
            nodeRenderer: renderBrandNode
          }}
        />
      )}
      {isImpersonateUserSelectorOpen && selectedBrandToSwitch && (
        <TeamAgentsDrawer
          open
          width="43rem"
          title="Select User"
          withRelatedContacts={false}
          teamAgentsModelFn={handlePassingSelectedBrand}
          onSelectAgents={handleSelectImpersonateUser}
          onClose={hanldeCloseImpersonateSelectorDrawer}
        />
      )}
    </>
  )
}
