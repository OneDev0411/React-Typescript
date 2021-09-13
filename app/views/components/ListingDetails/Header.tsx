import { useCallback, useState } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { mdiClose, mdiExportVariant, mdiHeart, mdiHeartOutline } from '@mdi/js'
import { useSelector } from 'react-redux'
import { withRouter, WithRouterProps, browserHistory } from 'react-router'
import { notify } from 'reapop'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import api from 'models/listings/favorites'
import { selectUserUnsafe } from 'selectors/user'

const useStyles = makeStyles(
  (theme: Theme) => ({
    logo: {
      height: 40,
      [theme.breakpoints.up('lg')]: {
        height: 56
      }
    },
    button: {
      marginRight: theme.spacing(2)
    },
    menuContainer: {
      height: '100%',
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
  listing: ICompactListing
  isWidget?: boolean
  handleClose?: () => void
  handleShare: () => void
}

function Header({
  listing,
  isWidget = false,
  handleShare,
  location,
  handleClose
}: Props & WithRouterProps) {
  const classes = useStyles()
  const user = useSelector(selectUserUnsafe)

  const [isFavorited, setIsFavorited] = useState(listing.favorited)

  const toggleFavorite = useCallback(
    async (listing: ICompactListing) => {
      if (!user) {
        return
      }

      setIsFavorited(prev => !prev)

      try {
        await api.toggleFavorites({
          recId: null,
          mlsNumber: listing.mls_number,
          isFavorite: listing.favorited,
          roomId: user.personal_room
        })
      } catch {
        setIsFavorited(prev => !prev)
        notify({
          status: 'error',
          message: 'Unable to perform this action.',
          options: { id: 'toggle-listing-favorite-error' }
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
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

  const handleFavorite = event => toggleFavorite(listing)

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={3}>
          {handleClose && (
            <Button
              variant="outlined"
              onClick={handleClose}
              startIcon={<SvgIcon path={mdiClose} />}
              className={classes.button}
            >
              Close
            </Button>
          )}
        </Grid>
        <Grid item xs={12} sm={9}>
          <Box
            display="flex"
            alignItems="center"
            className={classes.menuContainer}
          >
            {user && (
              <Button
                variant="outlined"
                onClick={handleFavorite}
                startIcon={
                  <SvgIcon
                    color={isFavorited ? 'red' : 'black'}
                    path={isFavorited ? mdiHeart : mdiHeartOutline}
                  />
                }
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
            {!isWidget && !user && (
              <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default withRouter(Header)
