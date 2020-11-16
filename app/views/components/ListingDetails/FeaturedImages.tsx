import React from 'react'
import cn from 'classnames'
import Box from '@material-ui/core/Box'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      textAlign: 'center',
      position: 'relative'
    },
    mainImage: {
      maxWidth: '100%',
      [theme.breakpoints.up('md')]: {
        maxWidth: '90%'
      }
    },
    subImage: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'block',
        position: 'absolute',
        width: '30%',
        height: '25'
      }
    },
    subImageTop: {
      [theme.breakpoints.up('md')]: {
        top: 0,
        left: '5%'
      }
    },
    subImageBottom: {
      [theme.breakpoints.up('md')]: {
        bottom: 0,
        right: '5%'
      }
    }
  }),
  { name: 'FeaturedImages' }
)

interface Props {
  images?: string[] | null
}

function FeaturedImages({ images }: Props) {
  const classes = useStyles()

  if (images == null) {
    return null
  }

  return (
    <Box className={classes.container}>
      <img src={images[0]} alt="main" className={classes.mainImage} />
      <img
        src={images[1]}
        alt="top"
        className={cn(classes.subImage, classes.subImageTop)}
      />
      <img
        src={images[2]}
        alt="bottom"
        className={cn(classes.subImage, classes.subImageBottom)}
      />
    </Box>
  )
}

export default FeaturedImages
