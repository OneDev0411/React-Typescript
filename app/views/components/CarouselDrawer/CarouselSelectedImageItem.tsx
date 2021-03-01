import React from 'react'
// import { IconButton, makeStyles } from '@material-ui/core'
import { HighlightOff } from '@material-ui/icons'

import CarouselImageItem, { CarouselImageItemProps } from './CarouselImageItem'

// const useStyles = makeStyles(
//   theme => ({
//     button: { color: `${theme.palette.common.white} !important` }
//   }),
//   { name: 'CarouselSelectedImageItem' }
// )

interface CarouselSelectedImageItemProps
  extends Omit<CarouselImageItemProps, 'label'> {
  onRemove: (string) => void
}

function CarouselSelectedImageItem({
  src,
  onRemove,
  ...otherProps
}: CarouselSelectedImageItemProps) {
  // const classes = useStyles()

  const handleRemove = () => {
    onRemove(src)
  }

  return (
    <CarouselImageItem
      {...otherProps}
      src={src}
      label={<HighlightOff />}
      onClick={handleRemove}
    />
  )

  // return (
  //   <CarouselImageItem
  //     {...otherProps}
  //     src={src}
  //     label={
  //       <>
  //         <IconButton
  //           className={classes.button}
  //           size="small"
  //           color="inherit"
  //           onClick={handleRemove}
  //         >
  //           <HighlightOff />
  //         </IconButton>
  //       </>
  //     }
  //   />
  // )
}

export default CarouselSelectedImageItem
