import { Box, Chip, makeStyles, Theme, Typography } from '@material-ui/core'
import { mdiCardsOutline } from '@mdi/js'
import Skeleton from '@material-ui/lab/Skeleton'

import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot
} from 'react-beautiful-dnd'

import { useMemo } from 'react'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { ColumnCard } from './Card'

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
      // https://github.com/atlassian/react-beautiful-dnd/issues/1640
      height: `calc(100% - ${theme.spacing(6)}px)`
    },
    innerBody: {
      height: '100%',
      overflowY: 'auto'
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
  isLoading: boolean
  list: IContact[]
}

export function BoardColumn({
  id,
  title,
  list,
  isLoading,
  droppable = true
}: Props) {
  const classes = useStyles()

  const randomNumber = useMemo(() => Math.floor(Math.random() * 6) + 1, [])

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

      <Droppable
        droppableId={id}
        type="column"
        direction="vertical"
        isDropDisabled={!droppable}
        ignoreContainerClipping
        isCombineEnabled={false}
      >
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            className={classes.body}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div className={classes.innerBody}>
              {snapshot.isDraggingOver && (
                <div className={classes.placeholder} />
              )}

              {isLoading
                ? new Array(randomNumber)
                    .fill(null)
                    .map((_, index) => (
                      <Skeleton
                        key={index}
                        animation="wave"
                        className={classes.skeleton}
                      />
                    ))
                : list.map((contact, index) => (
                    <ColumnCard
                      key={contact.id}
                      columnId={id}
                      rowId={index}
                      contact={contact}
                    />
                  ))}
            </div>

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
