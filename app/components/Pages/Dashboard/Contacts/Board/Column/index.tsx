import React, { useState } from 'react'

import { Box, Chip, makeStyles, Theme, Typography } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { mdiCardsOutline } from '@mdi/js'
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot
} from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'
import { useAsync } from 'react-use'
import AutoSizer from 'react-virtualized-auto-sizer'
import { areEqual } from 'react-window'

import { searchContacts } from '@app/models/contacts/search-contacts'
import { IAppState } from '@app/reducers'
import { selectUser } from '@app/selectors/user'
import VirtualList, { LoadingPosition } from '@app/views/components/VirtualList'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { viewAs } from 'utils/user-teams'

import { Tags } from '../constants'
import { useColumnList } from '../hooks/use-column-list'

import { CardItem } from './Card/CardItem'
import { DraggableCardItem } from './Card/DraggableCardItem'

const loadingLimit = 100

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
  tag?: string
  searchTerm: string
  onReachStart?: () => void
  onReachEnd?: () => void
}

export const BoardColumn = React.memo(function BoardColumn({
  id,
  title,
  searchTerm,
  tag
}: Props) {
  const classes = useStyles()
  const [currentSearchTerm, setCurrentSearchTerm] = useState(searchTerm)
  const [list, updateList] = useColumnList(tag)
  const [loadingOffset, setLoadingOffset] = useState(0)
  const [loading, setLoading] = useState<Nullable<'initial' | 'more'>>(null)
  const [isReachedEnd, setIsReachedEnd] = useState(false)
  const user = useSelector(selectUser)
  const tagAttributeDefinitionId = useSelector<IAppState, UUID>(
    ({ contacts }) => contacts.attributeDefs.byName.tag
  )

  const isInitialLoading = list.length === 0 && loading === 'initial'
  const isLoading = loading !== null

  const getLoadingPosition = () => {
    if (loading === 'initial') {
      return LoadingPosition.Middle
    }

    if (loading === 'more') {
      return LoadingPosition.Bottom
    }

    return undefined
  }

  useAsync(async () => {
    if (loading || (searchTerm === currentSearchTerm && isReachedEnd)) {
      return
    }

    setLoading(loadingOffset === 0 ? 'initial' : 'more')

    let filters: IContactFilter[] | undefined

    if (tag) {
      filters = [
        {
          attribute_def: tagAttributeDefinitionId,
          invert: false,
          value: tag
        }
      ]
    } else {
      filters = Tags.map(tag => ({
        attribute_def: tagAttributeDefinitionId,
        invert: true,
        value: tag
      }))
    }

    const { data, info } = await searchContacts(
      searchTerm,
      filters,
      {
        start: loadingOffset,
        limit: loadingLimit
      },
      viewAs(user)
    )

    setLoading(null)
    setIsReachedEnd(data.length + list.length === info?.total)

    updateList(
      searchTerm === currentSearchTerm ? [...list, ...data] : data,
      tag
    )

    setCurrentSearchTerm(searchTerm)
  }, [loadingOffset, searchTerm, tagAttributeDefinitionId])

  const handleReachEnd = () => setLoadingOffset(offset => offset + loadingLimit)

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
                <Typography variant="subtitle1">{list.length}</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </div>

      {isInitialLoading && (
        <div className={classes.body}>
          {new Array(3).fill(null).map((_, index) => (
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
                    onReachEnd={handleReachEnd}
                    isLoading={loading !== null}
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
