import { useEffect, useState } from 'react'
import { WithRouterProps } from 'react-router'
import { Container, Grid, Theme, makeStyles } from '@material-ui/core'

import { getPublicShowing } from 'models/showings/get-public-showing'

import LoadingContainer from 'components/LoadingContainer'

import InfoSection from './Sections/InfoSection'
import BookSection from './Sections/BookSection'

const useStyles = makeStyles(
  (theme: Theme) => ({
    pageContainer: {
      maxWidth: '100%',
      padding: 0
    },
    container: {
      [theme.breakpoints.up('sm')]: {
        minHeight: '100vh'
      }
    }
  }),
  {
    name: 'BookShowing'
  }
)

interface RouteParams {
  token: string
}

export default function BookShowing({ params }: WithRouterProps<RouteParams>) {
  const classes = useStyles()
  const [showing, setShowing] = useState<Nullable<IPublicShowing>>(null)
  const token = params.token

  useEffect(() => {
    async function fetchShowing() {
      if (!token) {
        return
      }

      const fetchedShowing = await getPublicShowing(token)

      setShowing(fetchedShowing)
    }

    fetchShowing()
  }, [token])

  if (!showing) {
    // return <div>Getting showing with {token} token.</div>
    return <LoadingContainer />
  }

  console.log({ showing })

  return (
    <Container className={classes.pageContainer}>
      <Grid container direction="row" className={classes.container}>
        <InfoSection showing={showing} />
        <BookSection showing={showing} onBook={console.log} />
      </Grid>
    </Container>
  )
}
