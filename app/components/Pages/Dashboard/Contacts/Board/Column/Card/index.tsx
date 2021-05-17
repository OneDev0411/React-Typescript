import {
  Box,
  Typography,
  Avatar,
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

import { Link } from 'react-router'

import { useDispatch } from 'react-redux'

import MiniContact from 'components/MiniContact'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { PopoverContactTagSelector } from 'components/TagSelector'

import { getAccountAvatar } from 'components/Avatar/helpers/get-avatar'

import type { SelectorOption } from 'components/TagSelector/type'

import { updateContactTags } from 'actions/contacts/update-contact-tags'

import LastTouched from '../../../List/Table/columns/LastTouched'

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
    avatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      marginRight: theme.spacing(1)
    },
    name: {
      color: theme.palette.common.black
    },
    grey: {
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
    },
    lastTouch: {
      marginLeft: theme.spacing(0.5),
      color: theme.palette.grey['500'],
      '& b': {
        fontWeight: 'normal',
        ...theme.typography.caption
      }
    }
  }),
  {
    name: 'Board-Column-Card'
  }
)

interface Props {
  contact: IContact
  columnId: string
  rowId: number
}

export function ColumnCard({ contact, columnId, rowId }: Props) {
  const classes = useStyles()
  const theme = useTheme<Theme>()
  const dispatch = useDispatch()

  const handleChangeTag = (tags: SelectorOption[]) => {
    dispatch(
      updateContactTags(
        contact.id,
        tags.filter(tag => !!tag.value).map(tag => tag.value!)
      )
    )
  }

  const content = useMemo(
    () => (
      <>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar className={classes.avatar} src={getAccountAvatar(contact)}>
              {contact.display_name[0]}
            </Avatar>

            <Link
              to={`/dashboard/contacts/${contact.id}`}
              className={classes.name}
            >
              <MiniContact type="contact" data={contact}>
                <Typography variant="body2">
                  <TextMiddleTruncate
                    text={contact.display_name}
                    maxLength={25}
                  />
                </Typography>
              </MiniContact>
            </Link>
          </Box>

          <Box display="flex" alignItems="center">
            <SvgIcon
              path={mdiCalendar}
              className={classes.grey}
              size={muiIconSizes.xsmall}
            />
            <Typography variant="caption" className={classes.lastTouch}>
              <LastTouched contact={contact} title="" />
            </Typography>
          </Box>
        </Box>

        <PopoverContactTagSelector
          label={`${contact.display_name}'s Tag`}
          value={contact.tags?.map(tag => ({
            title: tag,
            value: tag
          }))}
          filter={{
            selectedIds: [contact.id]
          }}
          callback={handleChangeTag}
          anchorRenderer={onClick => (
            <Box mt={2} onClick={onClick}>
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
                  className={cn(classes.noTags, classes.grey)}
                  label="No Tags"
                  size="small"
                />
              )}
            </Box>
          )}
        />
      </>
    ),
    // eslint-disable-next-line
    [contact]
  )

  return (
    <Draggable draggableId={`${columnId}:${contact.id}`} index={rowId}>
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
                    borderColor: theme.palette.success.main
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
