import {
  Box,
  Chip,
  IconButton,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import { mdiCardsOutline, mdiDotsVertical } from '@mdi/js'

import { Droppable, DroppableProvided } from 'react-beautiful-dnd'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { ColumnCard } from './Card'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.grey['50'],
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      marginRight: theme.spacing(1.5),
      width: '360px',
      height: '100%',
      overflowX: 'hidden',
      overflowY: 'auto'
    },
    head: {
      position: 'sticky',
      top: 0,
      backgroundColor: theme.palette.grey['50'],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2),
      zIndex: 1
    },
    body: {
      flexGrow: 1
    }
  }),
  {
    name: 'Board-Column'
  }
)

interface Props {
  id: number
  title: string
  droppable?: boolean
  list: IContact[]
}

export function BoardColumn({ id, title, list, droppable = true }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.head}>
        <Chip label={title} size="small" />

        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          flexGrow={1}
        >
          <Box display="flex" alignItems="center" mr={1}>
            <SvgIcon path={mdiCardsOutline} />
            <Box ml={0.5}>
              <Typography variant="subtitle1">{list.length}</Typography>
            </Box>
          </Box>

          <IconButton size="small">
            <SvgIcon path={mdiDotsVertical} />
          </IconButton>
        </Box>
      </div>

      <Droppable
        droppableId={id.toString()}
        type="COLUMN"
        direction="horizontal"
        isDropDisabled={!droppable}
        ignoreContainerClipping
        isCombineEnabled
      >
        {(provided: DroppableProvided) => (
          <div
            className={classes.body}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {list.map((contact, index) => (
              <ColumnCard key={index} id={`${id}-${index}`} contact={contact} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
