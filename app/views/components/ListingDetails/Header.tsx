import React from 'react'
import { useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core'
import { mdiExportVariant, mdiHeartOutline } from '@mdi/js'

import { IAppState } from 'reducers'
import { getBrandLogo } from 'utils/get-brand-logo'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    logo: {
      maxWidth: 260
    },
    button: {
      marginRight: theme.spacing(2)
    },
    menuContainer: {
      marginTop: theme.spacing(3),
      [theme.breakpoints.up('sm')]: {
        marginTop: 0,
        justifyContent: 'flex-end'
      }
    }
  }),
  { name: 'Header' }
)

interface Props {
  id?: UUID
  handleFavorite?: () => void
  handleShare?: () => void
  handleLogin?: () => void
}

function Header({ id, handleFavorite, handleLogin, handleShare }: Props) {
  const classes = useStyles()
  const brand = useSelector<IAppState, IBrand>(
    (state: IAppState) => state.brand
  )
  const user = useSelector<IAppState, IUser>((state: IAppState) => state.user)

  const logo = React.useMemo(
    () =>
      getBrandLogo(
        brand,
        'inverted-logo-wide',
        '/static/images/logo--type.svg'
      ),
    [brand]
  )

  return (
    <Box py={5} px={3}>
      <Grid container>
        <Grid item xs={12} sm={3}>
          <img alt="logo" src={logo} className={classes.logo} />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Box display="flex" className={classes.menuContainer}>
            {user && (
              <Button
                variant="outlined"
                onClick={handleFavorite}
                startIcon={<SvgIcon path={mdiHeartOutline} />}
                className={classes.button}
              >
                Favorite
              </Button>
            )}
            {user && (
              <Button
                variant="outlined"
                onClick={handleShare}
                startIcon={<SvgIcon path={mdiExportVariant} />}
              >
                Share
              </Button>
            )}
            {!user && (
              <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Header
