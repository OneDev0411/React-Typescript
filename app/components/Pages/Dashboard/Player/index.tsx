import { Grid, Typography, makeStyles } from '@material-ui/core'
import { useTitle } from 'react-use'

import { useQueryParamValue } from '@app/hooks/use-query-param'
import PageLayout from '@app/views/components/GlobalPageLayout'

const useStyles = makeStyles(
  () => ({
    video: {
      width: '100%'
    }
  }),
  {
    name: 'Player'
  }
)

export default function Player() {
  useTitle('Rechat | Player')

  const classes = useStyles()

  const video = decodeURIComponent(useQueryParamValue('video'))

  if (!video) {
    return (
      <PageLayout>
        <PageLayout.Header title="Player" />
        <PageLayout.Main>
          <Typography>No URL provided</Typography>
        </PageLayout.Main>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageLayout.Main>
        <Grid container>
          <Grid item xs={12}>
            <video className={classes.video} autoPlay controls src={video} />
          </Grid>
        </Grid>
      </PageLayout.Main>
    </PageLayout>
  )
}
