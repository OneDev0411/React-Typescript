import React from 'react'
import cn from 'classnames'
import Box from '@material-ui/core/Box'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      textAlign: 'center',
      position: 'relative',
      width: '100%'
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
        width: '250px',
        height: '150px'
      },
      [theme.breakpoints.up('md')]: {
        width: '325px',
        height: '200px'
      }
    },
    subImageTop: {
      [theme.breakpoints.up('sm')]: {
        top: '-7%',
        left: '5%',
        boxShadow: `-3px -2px 10px ${theme.palette.grey['300']}`
      }
    },
    subImageBottom: {
      [theme.breakpoints.up('sm')]: {
        bottom: '-7%',
        right: '5%',
        boxShadow: `5px 7px 10px ${theme.palette.grey['300']}`
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
