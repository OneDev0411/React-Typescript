import React from 'react'
import cn from 'classnames'
import Box from '@material-ui/core/Box'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      textAlign: 'center',
      position: 'relative',
      width: '100%',
      [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(5, 0)
      }
    },
    mainImage: {
      maxWidth: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '70%'
      }
    },
    subImage: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
        position: 'absolute',
        width: 250,
        height: 150
      },
      [theme.breakpoints.up('md')]: {
        width: 325,
        height: 200
      },
      [theme.breakpoints.up('lg')]: {
        width: 225,
        height: 150
      }
    },
    subImageTop: {
      [theme.breakpoints.up('sm')]: {
        top: '-7%',
        left: '5%',
        boxShadow: `-3px -2px 10px ${theme.palette.grey['300']}`
      },
      [theme.breakpoints.up('lg')]: {
        top: 0,
        left: '10%',
        boxShadow: 'none'
      }
    },
    subImageBottom: {
      [theme.breakpoints.up('sm')]: {
        bottom: '-7%',
        right: '5%',
        boxShadow: `5px 7px 10px ${theme.palette.grey['300']}`
      },
      [theme.breakpoints.up('lg')]: {
        right: '10%',
        bottom: 0,
        boxShadow: 'none'
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
