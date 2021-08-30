import React, { useMemo } from 'react'

import { Box, Chip, makeStyles, Theme, Typography } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { mdiCardsOutline } from '@mdi/js'
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot
} from 'react-beautiful-dnd'
import AutoSizer from 'react-virtualized-auto-sizer'
import { areEqual } from 'react-window'

import VirtualList, { LoadingPosition } from '@app/views/components/VirtualList'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { CardItem } from './Card/CardItem'
import { DraggableCardItem } from './Card/DraggableCardItem'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      backgroundColor: theme.palette.grey['50'],
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      marginRight: theme.spacing(1.5),
      width: '360px',
      maxHeight: '100%'
    },
    head: {
      backgroundColor: theme.palette.grey['50'],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2),
      height: theme.spacing(6),
      boxSizing: 'border-box',
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
      zIndex: 1
    },
    body: {
      // calc(height of the entire column - heading height)
      height: `calc(100% - ${theme.spacing(6)}px)`
    },
    placeholder: {
      margin: theme.spacing(0.5),
      backgroundColor: theme.palette.grey['100'],
      border: `1px dashed ${theme.palette.action.disabled}`,
      borderRadius: theme.shape.borderRadius,
      height: theme.spacing(15)
    },
    skeleton: {
      margin: theme.spacing(0.5),
      borderRadius: theme.shape.borderRadius,
      height: theme.spacing(10),
      transform: 'none'
    },
    titleSkeleton: {
      width: theme.spacing(6),
      height: theme.spacing(3),
      borderRadius: theme.shape.borderRadius
    }
  }),
  {
    name: 'Board-Column'
  }
)

interface Props {
  id: string
  title: string
  droppable?: boolean
  listCount?: number
  isFetchingContacts?: boolean
  isFetchingNextContacts?: boolean
  isFetchingPreviousContacts?: boolean
  list: IContact[]
  onReachStart?: () => void
  onReachEnd?: () => void
}

export const BoardColumn = React.memo(function BoardColumn({
  id,
  title,
  list,
  listCount,
  isFetchingContacts = false,
  isFetchingNextContacts = false,
  isFetchingPreviousContacts = false,
  droppable = true,
  onReachStart = () => {},
  onReachEnd = () => {}
}: Props) {
  const classes = useStyles()

  const randomNumber = useMemo(() => Math.floor(Math.random() * 6) + 1, [])

  const isInitialLoading = list.length === 0 && isFetchingContacts

  const isLoading =
    isFetchingContacts || isFetchingNextContacts || isFetchingPreviousContacts

  const getLoadingPosition = () => {
    if (isInitialLoading) {
      return LoadingPosition.Middle
    }

    if (isFetchingNextContacts) {
      return LoadingPosition.Bottom
    }

    if (isFetchingPreviousContacts) {
      return LoadingPosition.Top
    }

    return undefined
  }

  return (
    <div className={classes.root}>
      <div className={classes.head}>
        {isLoading ? (
          <Skeleton animation="wave" className={classes.titleSkeleton} />
        ) : (
          <Chip label={title} size="small" />
        )}

        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          flexGrow={1}
        >
          <Box display="flex" alignItems="center" mr={1}>
            <SvgIcon path={mdiCardsOutline} />
            <Box ml={0.5}>
              {isLoading ? (
                <Skeleton animation="wave" width="16px" />
              ) : (
                <Typography variant="subtitle1">
                  {listCount || list.length}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </div>

      {isInitialLoading && (
        <div className={classes.body}>
          {new Array(randomNumber).fill(null).map((_, index) => (
            <Skeleton
              key={index}
              animation="wave"
              className={classes.skeleton}
            />
          ))}
        </div>
      )}

      <div className={classes.body}>
        <AutoSizer>
          {({ width, height }) => (
            <Droppable
              droppableId={id}
              type="column"
              mode="virtual"
              direction="vertical"
              isDropDisabled={!droppable}
              ignoreContainerClipping
              isCombineEnabled={false}
              renderClone={(provided, snapshot, rubric) => (
                <CardItem
                  provided={provided}
                  isDragging={snapshot.isDragging}
                  contact={list[rubric.source.index]}
                />
              )}
            >
              {(
                provided: DroppableProvided,
                snapshot: DroppableStateSnapshot
              ) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <VirtualList
                    width={width}
                    height={height}
                    itemCount={
                      snapshot.isUsingPlaceholder
                        ? list.length + 1
                        : list.length
                    }
                    itemData={
                      {
                        rows: list,
                        columnId: id
                      } as React.ComponentProps<
                        typeof DraggableCardItem
                      >['data']
                    }
                    threshold={5}
                    itemSize={() => 112}
                    overscanCount={10}
                    onReachStart={onReachStart}
                    onReachEnd={onReachEnd}
                    isLoading={
                      isFetchingNextContacts || isFetchingPreviousContacts
                    }
                    loadingPosition={getLoadingPosition()}
                  >
                    {DraggableCardItem}
                  </VirtualList>
                </div>
              )}
            </Droppable>
          )}
        </AutoSizer>
      </div>
    </div>
  )
},
areEqual)
