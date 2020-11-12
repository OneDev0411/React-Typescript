import React from 'react'
import cn from 'classnames'
import Box from '@material-ui/core/Box'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      textAlign: 'center',
      position: 'relative',
      padding: theme.spacing(3)
    },
    mainImage: {
      maxWidth: '100%',
      [theme.breakpoints.up('sm')]: {
        maxWidth: '75%'
      }
    },
    subImage: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
        position: 'absolute',
        width: '30vw',
        height: '25vh'
      },
      [theme.breakpoints.up('md')]: {
        width: '35vw',
        height: '30vh'
      },
      [theme.breakpoints.up('lg')]: {
        width: '35vw',
        height: '40vh'
      }
    },
    subImageTop: {
      [theme.breakpoints.up('sm')]: {
        top: '-10%',
        left: '5%'
      }
    },
    subImageBottom: {
      [theme.breakpoints.up('sm')]: {
        bottom: '-5%',
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
