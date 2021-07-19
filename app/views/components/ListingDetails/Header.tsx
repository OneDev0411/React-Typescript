import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter, WithRouterProps, browserHistory } from 'react-router'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core'
import { mdiClose, mdiExportVariant, mdiHeart, mdiHeartOutline } from '@mdi/js'

import { selectUserUnsafe } from 'selectors/user'
import { useFavorite } from 'hooks/use-favorite'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
  listing: IListing
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

  const { isFavorited, toggleFavorite } = useFavorite(listing)

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

  const handleFavorite = event => toggleFavorite()

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
