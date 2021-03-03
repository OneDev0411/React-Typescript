import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { makeStyles, fade, Grid } from '@material-ui/core'

import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd'

import { CAROUSEL_IMAGE_ITEM_TYPE } from './constants'
import { CarouselImageItemEdge, ImageDragObject } from './types'

const useStyles = makeStyles(
  theme => ({
    root: { position: 'relative' },
    wrapper: {
      display: 'block',
      margin: theme.spacing(1),
      position: 'relative',
      '&:hover $name': { opacity: 1 }
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
      transition: theme.transitions.create('opacity'),
      '& > svg': { fontSize: 32 }
    },
    button: { cursor: 'pointer' },
    edge: {
      position: 'absolute',
      top: 0,
      height: '100%',
      width: '50%',
      zIndex: 1
    },
    edgeLeft: {
      left: -1,
      borderLeft: '2px solid transparent'
    },
    edgeRight: {
      right: -1,
      borderRight: '2px solid transparent'
    },
    edgeLeftOver: { borderLeftColor: theme.palette.primary.main },
    edgeRightOver: { borderRightColor: theme.palette.primary.main },
    dragging: { opacity: 0.4 }
  }),
  { name: 'CarouselImageItem' }
)
export interface CarouselImageItemProps {
  src: string
  label: ReactNode
  onClick?: () => void
  droppable?: boolean
  onImageDrop?: (
    src: string,
    target: string,
    edge: CarouselImageItemEdge
  ) => void
}

const propSharedParams = {
  accept: CAROUSEL_IMAGE_ITEM_TYPE,
  collect: (monitor: DropTargetMonitor) => ({ isOver: monitor.isOver() })
}

function CarouselImageItem({
  src,
  label,
  onClick,
  droppable,
  onImageDrop
}: CarouselImageItemProps) {
  const classes = useStyles()

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: CAROUSEL_IMAGE_ITEM_TYPE, src },
    collect: monitor => ({ isDragging: monitor.isDragging() })
  })

  const [{ isOver }, blockRef] = useDrop(propSharedParams)

  const [{ isOver: isEdgeLeftOver }, dropBeforeRef] = useDrop({
    ...propSharedParams,
    drop: (item: ImageDragObject) =>
      onImageDrop?.(item.src, src, CarouselImageItemEdge.BEFORE)
  })

  const [{ isOver: isEdgeRightOver }, dropAfterRef] = useDrop({
    ...propSharedParams,
    drop: (item: ImageDragObject) =>
      onImageDrop?.(item.src, src, CarouselImageItemEdge.AFTER)
  })

  return (
    <Grid
      item
      xs={3}
      className={classNames(classes.root, isDragging && classes.dragging)}
      innerRef={blockRef}
    >
      <div
        ref={dragRef}
        className={classNames(classes.wrapper, onClick && classes.button)}
        onClick={onClick}
      >
        <div className={classes.space} />
        <img
          className={classNames(classes.item, classes.image)}
          src={src}
          alt=""
        />
        <div className={classNames(classes.item, classes.name)}>{label}</div>
      </div>
      {droppable && !isDragging && isOver && (
        <>
          <div
            className={classNames(
              classes.edge,
              classes.edgeLeft,
              isEdgeLeftOver && classes.edgeLeftOver
            )}
            ref={dropBeforeRef}
          />
          <div
            className={classNames(
              classes.edge,
              classes.edgeRight,
              isEdgeRightOver && classes.edgeRightOver
            )}
            ref={dropAfterRef}
          />
        </>
      )}
    </Grid>
  )
}

export default CarouselImageItem
