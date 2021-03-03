import React, { ReactNode, useState } from 'react'
import classNames from 'classnames'
import { makeStyles, fade } from '@material-ui/core'

import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd'

import { CAROUSEL_IMAGE_ITEM_TYPE } from './constants'
import { CarouselImageItemEdge, ImageDragObject } from './types'
import CarouselImage from './CarouselImage'

const useStyles = makeStyles(
  theme => ({
    wrapper: { '&:hover $name': { opacity: 1 } },
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
  const [isDragging, setIsDragging] = useState(false)

  const [, dragRef] = useDrag({
    item: { type: CAROUSEL_IMAGE_ITEM_TYPE, src },
    begin: () => setIsDragging(true),
    end: () => setIsDragging(false)
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
    <CarouselImage
      ref={blockRef}
      className={isDragging ? classes.dragging : undefined}
      classes={{ wrapper: classes.wrapper }}
      dragRef={dragRef}
      onClick={onClick}
      outerChildren={
        droppable &&
        !isDragging &&
        isOver && (
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
        )
      }
    >
      <img
        className={classNames(classes.item, classes.image)}
        src={src}
        alt=""
      />
      {!isDragging && (
        <div className={classNames(classes.item, classes.name)}>{label}</div>
      )}
    </CarouselImage>
  )
}

export default CarouselImageItem
