import { useState } from 'react'

import { Typography, Theme, makeStyles } from '@material-ui/core'
import { mdiAccountGroupOutline } from '@mdi/js'
import { useSelector } from 'react-redux'

import { switchActiveTeam } from '@app/models/user/switch-active-team'
import { selectActiveTeamUnsafe } from '@app/selectors/team'
import {
  NodeRenderer,
  BrandAvailableToUserSelectorDrawer
} from '@app/views/components/BrandSelector'
import Loading from '@app/views/components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

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
  const activeTeam = useSelector(selectActiveTeamUnsafe)
  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useState<boolean>(false)
  const [isSwitchingActiveTeam, setIsSwitchingActiveTeam] =
    useState<boolean>(false)

  const hanldeOpenBrandSelectorDrawer = () => setIsBrandSelectorOpen(true)
  const hanldeCloseBrandSelectorDrawer = () => setIsBrandSelectorOpen(false)

  const handleOnClickBrand = async (brand: IBrand) => {
    try {
      setIsSwitchingActiveTeam(true)
      hanldeCloseBrandSelectorDrawer()

      await switchActiveTeam(brand.id)
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }
  const renderBrandNode = ({ brand }: NodeRenderer) => {
    return (
      <Brand
        brand={brand}
        isActive={brand.id === activeTeam?.brand.id}
        onClick={() => handleOnClickBrand(brand)}
      />
    )
  }

  if (!activeTeam) {
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

            <Typography variant="subtitle2">
              {activeTeam?.brand.name}
            </Typography>
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
    </>
  )
}
