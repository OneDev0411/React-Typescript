import {
  Box,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core'
import { mdiCalendar } from '@mdi/js'
import cn from 'classnames'
import { DraggableProvided } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'

import { PopoverContactTagSelector } from '@app/components/Pages/Dashboard/Contacts/components/TagSelector'
import { updateContactTags } from 'actions/contacts/update-contact-tags'
import { getAccountAvatar } from 'components/Avatar/helpers/get-avatar'
import MiniContact from 'components/MiniContact'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import type { SelectorOption } from 'components/TagSelector'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import { getContactNameInitials } from 'models/contacts/helpers'

import LastTouched from '../../../List/Table/columns/LastTouched'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: theme.spacing(0.5, 1),
      height: '100%'
    },
    container: {
      backgroundColor: '#fff',
      padding: theme.spacing(1.5),
      height: '100%',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      overflow: 'auto',
      '&:hover': {
        backgroundColor: theme.palette.grey['50']
      }
    },
    cardAvatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      marginRight: theme.spacing(1)
    },
    cardName: {
      color: theme.palette.common.black
    },
    grey: {
      color: theme.palette.grey['500']
    },
    tag: {
      backgroundColor: '#fff',
      border: `1px solid ${theme.palette.divider}`,
      marginRight: theme.spacing(0.5)
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
    },
    flexCenter: {
      display: 'flex',
      alignItems: 'center'
    }
  }),
  {
    name: 'Board-Column-Card'
  }
)

interface Props {
  provided: DraggableProvided
  contact: IContact
  isDragging: boolean
  style?: React.CSSProperties
  onChangeTags?: (contact: IContact, tags: string[]) => void
}

export function CardItem({
  provided,
  contact,
  isDragging,
  style = {},
  onChangeTags
}: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const theme = useTheme<Theme>()

  const handleChangeTag = (tags: SelectorOption[]) => {
    const newTags = tags.filter(tag => !!tag.value).map(tag => tag.value!)

    dispatch(updateContactTags(contact.id, newTags))
    onChangeTags?.(contact, newTags)
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.dragHandleProps}
      {...provided.draggableProps}
      style={{
        ...provided.draggableProps.style,
        ...style
      }}
      className={classes.root}
    >
      <div
        className={classes.container}
        style={{
          ...(isDragging
            ? {
                borderColor: theme.palette.success.main
              }
            : {})
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div className={classes.flexCenter}>
            <Avatar
              className={classes.cardAvatar}
              src={getAccountAvatar(contact)}
            >
              {getContactNameInitials(contact)}
            </Avatar>

            <Link
              to={`/dashboard/contacts/${contact.id}`}
              className={classes.cardName}
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
          </div>

          <div className={classes.flexCenter}>
            <SvgIcon
              path={mdiCalendar}
              className={classes.grey}
              size={muiIconSizes.xsmall}
            />
            <Typography variant="caption" className={classes.lastTouch}>
              <LastTouched contact={contact} />
            </Typography>
          </div>
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
            <Box display="flex" alignItems="center" mt={2} onClick={onClick}>
              {(contact.tags || []).length > 0 ? (
                <>
                  {contact.tags!.slice(0, 3).map((tag, index) => (
                    <Chip
                      key={tag}
                      label={<TextMiddleTruncate text={tag} maxLength={10} />}
                      size="small"
                      className={classes.tag}
                    />
                  ))}

                  {contact.tags!.length > 3 && (
                    <Tooltip
                      title={contact.tags!.slice(3).map(tag => (
                        <div key={tag}>{tag}</div>
                      ))}
                    >
                      <Typography variant="caption">
                        and {contact.tags!.length - 3} more
                      </Typography>
                    </Tooltip>
                  )}
                </>
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
      </div>
    </div>
  )
}
