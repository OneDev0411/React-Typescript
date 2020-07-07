import React from 'react'
import { Grid, Button, makeStyles } from '@material-ui/core'

import { PdfThumbnail } from 'components/PdfThumbnail'

import { SharedMediaProps } from './types'

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh'
  },
  logo: {
    height: '2.5rem'
  }
}))

export default function SharedPdf({ url }: SharedMediaProps) {
  const classes = useStyles()

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="space-around"
      className={classes.container}
    >
      <Grid item>
        <a href="/">
          <img
            alt="brand"
            className={classes.logo}
            src="/static/images/logo.svg"
          />
        </a>
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" href={url}>
          Click to view or download PDF
        </Button>
      </Grid>
      <Grid item>
        <PdfThumbnail
          url={url}
          style={{
            width: 'auto',
            maxHeight: '80vh'
          }}
        />
      </Grid>
    </Grid>
  )
}
