import React from 'react'
import { makeStyles, Theme } from '@material-ui/core'

import { SharedMediaProps } from './types'

const useStyle = makeStyles((theme: Theme) => ({
  container: {
    maxWidth: '480px',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  logoContainer: {
    marginBottom: theme.spacing(3)
  },
  logo: {
    minHeight: theme.spacing(5),
    maxHeight: theme.spacing(5)
  },
  previewContainer: {
    width: '100%',
    minHeight: '30vh',
    marginBottom: theme.spacing(3)
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '100%'
  }
}))

export default function SharedImage({ url }: SharedMediaProps) {
  const classes = useStyle()

  return (
    <div className={classes.container}>
      <div className={classes.logoContainer}>
        <a href="/">
          <img
            className={classes.logo}
            alt="brand"
            src="/static/images/logo.svg"
          />
        </a>
      </div>
      <div className={classes.previewContainer}>
        <img className={classes.previewImage} alt="preview" src={url} />
      </div>
      <ol>
        <li>Press and hold on the image above.</li>
        <li>Select share option from the pop up menu.</li>
        <li>
          Select Facebook, Instagram or another app to share the image to.
        </li>
      </ol>
    </div>
  )
}
