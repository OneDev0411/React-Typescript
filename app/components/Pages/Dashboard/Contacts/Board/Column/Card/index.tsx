import {
  Box,
  Typography,
  Chip,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core'
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd'

import { mdiCalendar } from '@mdi/js'
import cn from 'classnames'

import { useMemo } from 'react'

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
      transition: '0.1s ease-in all',
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
    },
    placeholder: {
      margin: theme.spacing(0.5),
      padding: theme.spacing(1.5),
      backgroundColor: theme.palette.grey['100'],
      border: `1px dashed ${theme.palette.action.disabled}`,
      borderRadius: theme.shape.borderRadius,
      '& > div': {
        visibility: 'hidden'
      }
    }
  }),
  {
    name: 'Board-Column'
  }
)

interface Props {
  contact: IContact
  id: string
}

export function ColumnCard({ contact, id }: Props) {
  const classes = useStyles()
  const theme = useTheme<Theme>()

  const content = useMemo(
    () => (
      <>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar contact={contact} size="small" />
            <Typography className={classes.name}>
              <TextMiddleTruncate text={contact.display_name} maxLength={30} />
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
      </>
    ),
    // eslint-disable-next-line
    [contact]
  )

  return (
    <Draggable draggableId={id} index={parseInt(id, 10)}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <>
          <div
            className={classes.root}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
              ...(snapshot.isDragging
                ? {
                    borderColor: theme.palette.success.main,
                    transform: `${provided.draggableProps.style?.transform} rotateZ(3deg)`
                  }
                : {})
            }}
          >
            {content}
          </div>

          {snapshot.isDragging && (
            <div className={classes.placeholder}>{content}</div>
          )}
        </>
      )}
    </Draggable>
  )
}
