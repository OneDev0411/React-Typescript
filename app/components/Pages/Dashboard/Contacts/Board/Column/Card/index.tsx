import { Box, Typography, Chip, makeStyles, Theme } from '@material-ui/core'
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd'

import { mdiCalendar } from '@mdi/js'
import cn from 'classnames'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import { Avatar } from 'components/Avatar'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      backgroundColor: '#fff',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(0.5),
      padding: theme.spacing(1.5),
      '&:hover': {
        backgroundColor: theme.palette.grey['50']
      }
    },
    name: {
      marginLeft: theme.spacing(1),
      ...theme.typography.body3
    },
    lightColor: {
      color: theme.palette.grey['500']
    },
    tag: {
      backgroundColor: '#fff',
      border: `1px solid ${theme.palette.divider}`,
      margin: theme.spacing(0, 1, 1, 0)
    },
    noTags: {
      backgroundColor: '#fff'
    }
  }),
  {
    name: 'Board-Column'
  }
)

interface Props {
  contact: IContact
  index: number
}

export function ColumnCard({ contact, index }: Props) {
  const classes = useStyles()

  return (
    <Draggable draggableId={contact.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          className={classes.root}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            style={{
              opacity: snapshot.isDragging ? 0.5 : 1
            }}
            {...provided.dragHandleProps}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                <Avatar contact={contact} size="small" />
                <Typography className={classes.name}>
                  <TextMiddleTruncate
                    text={contact.display_name}
                    maxLength={30}
                  />
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <SvgIcon
                  path={mdiCalendar}
                  className={classes.lightColor}
                  size={muiIconSizes.xsmall}
                />
                <Typography variant="caption" className={classes.lightColor}>
                  12 hours ago
                </Typography>
              </Box>
            </Box>

            <Box mt={2}>
              {(contact.tags || []).length > 0 ? (
                contact.tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    className={classes.tag}
                  />
                ))
              ) : (
                <Chip
                  className={cn(classes.noTags, classes.lightColor)}
                  label="No Tags"
                  size="small"
                />
              )}
            </Box>
          </div>
        </div>
      )}
    </Draggable>
  )
}
