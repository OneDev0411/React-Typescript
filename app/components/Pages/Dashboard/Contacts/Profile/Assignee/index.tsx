import { useState } from 'react'

import {
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  makeStyles,
  Popover
} from '@material-ui/core'
import { mdiPlus, mdiTrashCanOutline } from '@mdi/js'
import cn from 'classnames'
import { useDispatch } from 'react-redux'

import { useActiveBrand } from '@app/hooks/brand'
import { addAssignee } from '@app/models/assignees/add-assignee'
import { confirmation } from '@app/store_actions/confirmation'
import { muiIconSizes } from '@app/views/components/SvgIcons'
import UserAvatar from '@app/views/components/UserAvatar'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { AssigneesEditMode } from '../../components/AssigneesEditMode'
import { BasicSection } from '../components/Section/Basic'
import { SectionButton } from '../components/Section/Button'

interface Props {
  contact: INormalizedContact
  submitCallback: (newContact: INormalizedContact) => void
}

const useStyles = makeStyles(
  theme => ({
    basicSection: {
      marginTop: theme.spacing(2),
      paddingTop: theme.spacing(2),
      borderTop: `1px solid ${theme.palette.action.disabledBackground}`
    },
    popoverContainer: {
      width: '400px',
      height: '400px',
      padding: theme.spacing(1),
      overflow: 'hidden'
    },
    actionContainer: {
      display: 'flex',
      alignItems: 'center',
      background: theme.palette.background.paper,
      padding: theme.spacing(0.5),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4]
    },
    action: {
      padding: theme.spacing(0, 2),
      background: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center',
      color: theme.palette.grey[800],
      '& svg': {
        color: theme.palette.grey[800],
        margin: 'auto'
      },
      '&:hover': {
        background: theme.palette.action.hover,
        textDecoration: 'none'
      }
    },
    actionLabel: {
      display: 'block',
      color: theme.palette.grey[800],
      ...theme.typography.caption
    },
    videoModeActionBar: {
      position: 'absolute',
      top: '90%',
      right: '0',
      display: 'flex',
      zIndex: 1,
      visibility: 'hidden'
    },
    videoModeActionBarActive: {
      visibility: 'visible'
    }
  }),
  { name: 'ContactAssigneeModal' }
)

const Assignee = ({ contact, submitCallback }: Props) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const activeBrand = useActiveBrand()
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLButtonElement>>(null)
  const [showActionId, setShowActionId] = useState<Nullable<UUID>>(null)
  const handleOpenModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseModal = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'assignees-popover' : undefined

  const handleDelete = (id: UUID) => {
    dispatch(
      confirmation({
        message: 'Delete Assignee',
        description: 'Are you sure about deleting this Assignee?',
        confirmLabel: 'Yes, I do',
        appearance: 'danger',
        onConfirm: () => {
          deleteAssignee(id)
        }
      })
    )
  }

  const deleteAssignee = async (id: UUID) => {
    if (!contact.assignees) {
      return
    }

    let removedAssignees = contact?.assignees?.filter(
      assignee => assignee.id !== id
    )

    const assignees =
      removedAssignees?.map(assignee => ({
        user: assignee?.user?.id,
        brand: assignee?.brand?.id
      })) ?? []

    try {
      const { data } = await addAssignee(contact.id, {
        assignees
      })

      submitCallback(data)
      setShowActionId(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className={classes.basicSection}>
        <BasicSection title="Assignee">
          <List component="nav">
            {contact.assignees?.map(assignee => (
              <ListItem
                onMouseEnter={() => setShowActionId(assignee.id)}
                onMouseLeave={() => setShowActionId(null)}
                key={assignee.id}
                disableGutters
                button
              >
                <ListItemIcon>
                  <UserAvatar
                    image={assignee.user?.profile_image_url}
                    name={assignee.user?.display_name}
                    showStateIndicator={false}
                  />
                </ListItemIcon>
                <ListItemText primary={assignee.user?.display_name} />
                {activeBrand.id === contact.brand && (
                  <div
                    className={cn(classes.videoModeActionBar, {
                      [classes.videoModeActionBarActive]:
                        showActionId === assignee.id
                    })}
                  >
                    <div className={classes.actionContainer}>
                      <div
                        onClick={() => handleDelete(assignee.id)}
                        className={classes.action}
                      >
                        <SvgIcon
                          path={mdiTrashCanOutline}
                          size={muiIconSizes.small}
                        />
                        <span className={classes.actionLabel}>Delete</span>
                      </div>
                    </div>
                  </div>
                )}
              </ListItem>
            ))}
          </List>
          {activeBrand.id === contact.brand && (
            <SectionButton
              aria-describedby={id}
              onClick={handleOpenModal}
              label="Add new assignee"
              icon={mdiPlus}
            />
          )}
        </BasicSection>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseModal}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <div className={classes.popoverContainer}>
          <AssigneesEditMode contact={contact} onChange={submitCallback} />
        </div>
      </Popover>
    </>
  )
}
export default Assignee
