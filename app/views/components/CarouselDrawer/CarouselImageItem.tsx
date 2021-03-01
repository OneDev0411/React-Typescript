import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { Box, makeStyles, fade, Grid } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      border: `${theme.spacing(0.5)}px solid ${theme.palette.common.white}`,
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitions.create('border-color'),
      display: 'block',
      width: '100%',
      '&:hover $name': { opacity: 1 },
      position: 'relative'
    },
    space: {
      paddingTop: '100%',
      pointerEvents: 'none'
    },
    item: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    },
    image: {
      objectFit: 'cover',
      border: `1px solid ${theme.palette.grey[300]}`
    },
    name: {
      background: fade(theme.palette.common.black, 0.65),
      color: theme.palette.common.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      transition: theme.transitions.create('opacity')
    },
    button: { cursor: 'pointer' }
  }),
  { name: 'CarouselImageItem' }
)

export interface CarouselImageItemProps {
  src: string
  label: ReactNode
  onClick?: () => void
}

function CarouselImageItem<T>({ src, label, onClick }: CarouselImageItemProps) {
  const classes = useStyles()

  return (
    <Grid item xs={3}>
      <Box m={0.5}>
        <Box
          className={classNames(classes.root, onClick && classes.button)}
          onClick={onClick}
        >
          <div className={classes.space} />
          <img
            className={classNames(classes.item, classes.image)}
            src={src}
            alt=""
          />
          <div className={classNames(classes.item, classes.name)}>{label}</div>
        </Box>
      </Box>
    </Grid>
  )
}

export default CarouselImageItem
