import { useCallback, useMemo, useState } from 'react'

import {
  IconButton,
  makeStyles,
  Theme,
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { mdiClose, mdiHeart, mdiHeartOutline } from '@mdi/js'
import { useSelector } from 'react-redux'
import { withRouter, WithRouterProps, browserHistory } from 'react-router'
import { notify } from 'reapop'

import { useUnsafeActiveBrand } from '@app/hooks/brand'
import { IAppState } from '@app/reducers'
import { getBrandLogo } from '@app/utils/get-brand-logo'
import { noop } from '@app/utils/helpers'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import api from 'models/listings/favorites'
import { selectUserUnsafe } from 'selectors/user'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      flexWrap: 'nowrap',
      [theme.breakpoints.up('md')]: {
        flexWrap: 'wrap'
      }
    },
    logo: {
      height: 28 // From figma
    },
    button: {
      marginRight: theme.spacing(1),
      [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(2)
      }
    },
    closeButton: {
      marginLeft: theme.spacing(2)
    },
    menuContainer: {
      justifyContent: 'flex-end'
    }
  }),
  { name: 'Header' }
)

interface Props {
  listing: IListing
  isWidget?: boolean
  isModal?: boolean
  onToggleFavorite?: () => void
  handleClose?: () => void
  handleShare: () => void
}

function Header({
  listing,
  isWidget = false,
  isModal = false,
  handleShare,
  location,
  onToggleFavorite = noop,
  handleClose
}: Props & WithRouterProps) {
  const classes = useStyles()
  const theme = useTheme()
  const user = useSelector(selectUserUnsafe)
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const hostBrand = useSelector<IAppState, IBrand>(
    (state: IAppState) => state.brand
  )
  const brand = useUnsafeActiveBrand()
  const logo = useMemo(
    () =>
      getBrandLogo(brand, hostBrand, '/static/images/logo--white--padded.svg'),
    [brand, hostBrand]
  )

  const [isFavorited, setIsFavorited] = useState(listing.favorited)

  const handleToggleFavorite = useCallback(
    async (listing: IListing) => {
      if (!user) {
        return
      }

      onToggleFavorite()
      setIsFavorited(prev => !prev)

      try {
        await api.toggleFavorites({
          recId: null,
          listingId: listing.id,
          isFavorite: listing.favorited,
          roomId: user.personal_room
        })
      } catch {
        onToggleFavorite()
        setIsFavorited(prev => !prev)
        notify({
          status: 'error',
          message: 'Unable to perform this action.',
          options: { id: 'toggle-listing-favorite-error' }
        })
      }
    },
    [onToggleFavorite, user]
  )

  const handleLogin = () => {
    const { query } = location
    let username: string = ''

    if (query.token) {
      username = query.email || query.phone_number || ''
    }

    const url = `/signin?redirectTo=${location.pathname}${
      username ? `&username=${username}` : ''
    }${location.search}`

    browserHistory.push(url)
  }

  const handleFavorite = () => handleToggleFavorite(listing)

  return (
    <>
      <Grid container className={classes.root}>
        <Grid item xs={5} md={3}>
          {!isWidget && isMobileScreen && logo && (
            <img alt="logo" className={classes.logo} src={logo} />
          )}
        </Grid>
        <Grid item xs={7} md={9}>
          <Box
            display="flex"
            alignItems="center"
            className={classes.menuContainer}
          >
            {user && (
              <Button
                size="small"
                variant={isMobileScreen ? 'contained' : 'outlined'}
                color={isMobileScreen ? 'primary' : 'default'}
                onClick={handleFavorite}
                startIcon={
                  <SvgIcon
                    size={muiIconSizes.small}
                    color={
                      isFavorited ? 'red' : isMobileScreen ? 'white' : 'black'
                    }
                    path={isFavorited ? mdiHeart : mdiHeartOutline}
                  />
                }
                className={classes.button}
              >
                Like
              </Button>
            )}
            {!isWidget && !user && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleLogin}
              >
                Login
              </Button>
            )}

            {isModal && !isMobileScreen && (
              <IconButton
                className={classes.closeButton}
                size="small"
                onClick={handleClose}
              >
                <SvgIcon path={mdiClose} />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default withRouter(Header)
