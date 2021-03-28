import React, { Ref, ReactNode, forwardRef } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(
  theme => ({
    root: { position: 'relative' },
    wrapper: {
      display: 'block',
      margin: theme.spacing(1),
      position: 'relative'
    },
    space: {
      paddingTop: '100%',
      pointerEvents: 'none'
    },
    button: { cursor: 'pointer' }
  }),
  { name: 'CarouselImage' }
)

export interface CarouselImageProps {
  className?: string
  onClick?: () => void
  dragRef?: Ref<HTMLDivElement>
  children: ReactNode
  outerChildren?: ReactNode
  classes?: Partial<ReturnType<typeof useStyles>>
}

function CarouselImage(
  {
    className,
    dragRef,
    onClick,
    children,
    outerChildren,
    classes: classesProp
  }: CarouselImageProps,
  ref: Ref<HTMLDivElement>
) {
  const classes = useStyles({ classes: classesProp })

  return (
    <Grid
      item
      xs={3}
      className={classNames(classes.root, className)}
      innerRef={ref}
    >
      <div
        ref={dragRef}
        className={classNames(classes.wrapper, onClick && classes.button)}
        onClick={onClick}
      >
        <div className={classes.space} />
        {children}
      </div>
      {outerChildren}
    </Grid>
  )
}

export default forwardRef(CarouselImage)
