import { memo } from 'react'

import {
  Box,
  Typography,
  Avatar,
  Chip,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core'
import { mdiCalendar } from '@mdi/js'
import cn from 'classnames'
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle
} from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
import { areEqual } from 'react-window'

import { updateContactTags } from 'actions/contacts/update-contact-tags'
import { getAccountAvatar } from 'components/Avatar/helpers/get-avatar'
import MiniContact from 'components/MiniContact'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { PopoverContactTagSelector } from 'components/TagSelector'
import type { SelectorOption } from 'components/TagSelector/type'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import { getContactNameInitials } from 'models/contacts/helpers'

import LastTouched from '../../../List/Table/columns/LastTouched'

interface Props {
  style: React.CSSProperties
  index: number
  data: {
    rows: IContact[]
    columnId: string
  }
}

export function ColumnDraggableCard({
  style,
  index,
  data: { rows, columnId }
}: Props) {
  const contact = rows[index]

  if (!contact) {
    return null
  }

  return (
    <Draggable
      draggableId={`${columnId}:${contact.id}`}
      index={index}
      key={contact.id}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <ColumnCard
          provided={provided}
          contact={contact}
          style={style}
          isDragging={snapshot.isDragging}
        />
      )}
    </Draggable>
  )
}

export function ColumnCard({ provided, contact, isDragging, style = {} }) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.dragHandleProps}
      {...provided.draggableProps}
      style={{
        ...provided.draggableProps.style,
        ...style,
        border: '1px olive solid'
      }}
    >
      {contact.display_name}
    </div>
  )
}

// const useStyles = makeStyles(
//   (theme: Theme) => ({
//     root: {
//       backgroundColor: '#fff',
//       border: `1px solid ${theme.palette.divider}`,
//       borderRadius: theme.shape.borderRadius,
//       margin: theme.spacing(0.5),
//       padding: theme.spacing(1.5),
//       transition: '0.1s ease-in all',
//       '&:hover': {
//         backgroundColor: theme.palette.grey['50']
//       }
//     },
//     cardAvatar: {
//       width: theme.spacing(3),
//       height: theme.spacing(3),
//       marginRight: theme.spacing(1)
//     },
//     cardName: {
//       color: theme.palette.common.black
//     },
//     grey: {
//       color: theme.palette.grey['500']
//     },
//     tag: {
//       backgroundColor: '#fff',
//       border: `1px solid ${theme.palette.divider}`,
//       margin: theme.spacing(0, 1, 1, 0)
//     },
//     noTags: {
//       backgroundColor: '#fff'
//     },
//     placeholder: {
//       margin: theme.spacing(0.5),
//       padding: theme.spacing(1.5),
//       backgroundColor: theme.palette.grey['100'],
//       border: `1px dashed ${theme.palette.action.disabled}`,
//       borderRadius: theme.shape.borderRadius,
//       '& > div': {
//         visibility: 'hidden'
//       }
//     },
//     lastTouch: {
//       marginLeft: theme.spacing(0.5),
//       color: theme.palette.grey['500'],
//       '& b': {
//         fontWeight: 'normal',
//         ...theme.typography.caption
//       }
//     },
//     flexCenter: {
//       display: 'flex',
//       alignItems: 'center'
//     }
//   }),
//   {
//     name: 'Board-Column-Card'
//   }
// )

// interface Props {
//   style: React.CSSProperties
//   index: number
//   data: {
//     rows: IContact[]
//     columnId: string
//   }
// }

// function ColumnCardItem({ style, index, data: { rows, columnId } }: Props) {
//   const classes = useStyles()
//   const theme = useTheme<Theme>()
//   const dispatch = useDispatch()

//   const contact = rows[index]

//   const handleChangeTag = (tags: SelectorOption[]) => {
//     dispatch(
//       updateContactTags(
//         contact.id,
//         tags.filter(tag => !!tag.value).map(tag => tag.value!)
//       )
//     )
//   }

//   return (
//     <Draggable draggableId={`${columnId}:${contact.id}`} index={index}>
//       {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
//         <div
//           className={classes.root}
//           ref={provided.innerRef}
//           {...provided.dragHandleProps}
//           {...provided.draggableProps}
//           style={getStyle({
//             draggableStyle: provided.draggableProps.style,
//             virtualStyle: style,
//             isDragging: snapshot.isDragging
//           })}
//           // style={{
//           //   ...provided.draggableProps.style,
//           //   ...style,
//           //   ...(snapshot.isDragging
//           //     ? {
//           //         borderColor: theme.palette.success.main
//           //       }
//           //     : {})
//           // }}
//         >
//           <Box
//             display="flex"
//             alignItems="center"
//             justifyContent="space-between"
//           >
//             {contact.display_name}

//             <div className={classes.flexCenter}>
//               <Avatar
//                 className={classes.cardAvatar}
//                 src={getAccountAvatar(contact)}
//               >
//                 {getContactNameInitials(contact)}
//               </Avatar>

//               <Link
//                 to={`/dashboard/contacts/${contact.id}`}
//                 className={classes.cardName}
//               >
//                 <MiniContact type="contact" data={contact}>
//                   <Typography variant="body2">
//                     <TextMiddleTruncate
//                       text={contact.display_name}
//                       maxLength={25}
//                     />
//                   </Typography>
//                 </MiniContact>
//               </Link>
//             </div>

//             <div className={classes.flexCenter}>
//               <SvgIcon
//                 path={mdiCalendar}
//                 className={classes.grey}
//                 size={muiIconSizes.xsmall}
//               />
//               <Typography variant="caption" className={classes.lastTouch}>
//                 <LastTouched contact={contact} title="" />
//               </Typography>
//             </div>
//           </Box>

//           <PopoverContactTagSelector
//             label={`${contact.display_name}'s Tag`}
//             value={contact.tags?.map(tag => ({
//               title: tag,
//               value: tag
//             }))}
//             filter={{
//               selectedIds: [contact.id]
//             }}
//             callback={handleChangeTag}
//             anchorRenderer={onClick => (
//               <Box mt={2} onClick={onClick}>
//                 {(contact.tags || []).length > 0 ? (
//                   contact.tags?.map((tag, index) => (
//                     <Chip
//                       key={index}
//                       label={tag}
//                       size="small"
//                       className={classes.tag}
//                     />
//                   ))
//                 ) : (
//                   <Chip
//                     className={cn(classes.noTags, classes.grey)}
//                     label="No Tags"
//                     size="small"
//                   />
//                 )}
//               </Box>
//             )}
//           />
//         </div>
//       )}
//     </Draggable>
//   )
// }

// function getStyle({
//   draggableStyle,
//   virtualStyle,
//   isDragging
// }: {
//   draggableStyle: DraggingStyle | NotDraggingStyle | undefined
//   virtualStyle: React.CSSProperties
//   isDragging: boolean
// }) {
//   const combined = {
//     ...virtualStyle,
//     ...draggableStyle
//   }

//   const grid = 0

//   return {
//     ...combined,
//     height: isDragging ? combined.height : combined.height - grid,
//     left: isDragging ? combined.left : combined.left + grid,
//     width: isDragging
//       ? draggableStyle.width
//       : `calc(${combined.width} - ${grid * 2}px)`,
//     marginBottom: grid
//   }
// }

// export const ColumnCard = memo(ColumnCardItem, areEqual)
