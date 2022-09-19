import { useState } from 'react'

import {
  Popover,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  Box,
  CircularProgress,
  makeStyles,
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  Typography
} from '@material-ui/core'
import { mdiPlus, mdiTrashCanOutline } from '@mdi/js'
import { useDispatch } from 'react-redux'
import { IAssigneeReturnData, INormalizedContact } from 'types/Contact'
import useDebouncedCallback from 'use-debounce/lib/callback'

import { useActiveBrand } from '@app/hooks/brand'
import { addAssignee } from '@app/models/assignees/add-assignee'
import { confirmation } from '@app/store_actions/confirmation'
import { muiIconSizes } from '@app/views/components/SvgIcons'
import TeamAgents from '@app/views/components/TeamAgents'
import { BrandedUser } from '@app/views/components/TeamAgents/types'
import { AgentsList } from '@app/views/components/TeamAgentsDrawer/List'
import UserAvatar from '@app/views/components/UserAvatar'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { BasicSection } from '../components/Section/Basic'
import { SectionButton } from '../components/Section/Button'

import AssigneeEmail from './AssigneeEmail'

interface Props {
  contact: INormalizedContact
  submitCallback: (newContact: INormalizedContact) => void
}

const useStyles = makeStyles(
  theme => ({
    dialogContainer: {
      textAlign: 'center'
    },
    popoverContainer: {
      width: '400px',
      height: '400px',
      padding: theme.spacing(1)
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
      right: '0%',
      display: 'flex'
    }
  }),
  { name: 'ContactAssigneeModal' }
)

const Assignee = ({ contact, submitCallback }: Props) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const activeBrand = useActiveBrand()
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLButtonElement>>(null)
  const [selectedAgent] = useState<BrandedUser[]>([] as BrandedUser[])
  const [currentAgent, setCurrentAgent] = useState<Nullable<BrandedUser>>(null)
  const [showActionId, setShowActionId] = useState<Nullable<UUID>>(null)
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false)
  const [showEmailDrawer, setShowEmailDrawer] = useState<boolean>(false)
  const [searchCriteria, setSearchCriteria] = useState<string>('')
  const [debouncedSetSearchCriteria] = useDebouncedCallback(
    setSearchCriteria,
    500
  )

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelectAgent = async (user: BrandedUser) => {
    if (activeBrand.id === contact.brand) {
      let oldAssignees: IAssigneeReturnData[] = []

      if (contact.assignees) {
        contact.assignees.map(assignee => {
          oldAssignees.push({
            user: assignee?.user?.id,
            brand: assignee?.brand?.id
          })
        })
      }

      try {
        if (user) {
          const { data } = await addAssignee(contact.id, {
            assignees: [
              ...oldAssignees,
              { brand: user.brand_id, user: user.id }
            ]
          })

          console.log()

          setCurrentAgent(user)
          setShowEmailDialog(true)
          submitCallback(data)

          handleClose()
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
  const handleDelete = (id: UUID) => {
    if (activeBrand.id === contact.brand) {
      dispatch(
        confirmation({
          message: 'Delete Assignee',
          description: 'Are your sure about deleting this Assignee?',
          confirmLabel: 'Yes, I do',
          appearance: 'danger',
          onConfirm: () => {
            deleteAssignee(id)
          }
        })
      )
    }
  }

  const deleteAssignee = async (id: UUID) => {
    if (contact.assignees) {
      let removedAssignees = contact?.assignees?.filter(
        assignee => assignee.id !== id
      )

      let newAssignees: IAssigneeReturnData[] = []

      removedAssignees.map(assignee => {
        newAssignees.push({
          user: assignee?.user?.id,
          brand: assignee?.brand?.id
        })
      })

      try {
        const { data } = await addAssignee(contact.id, {
          assignees: newAssignees
        })

        submitCallback(data)
        setShowActionId(null)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const open = Boolean(anchorEl)
  const id = open ? 'assignee-popover' : undefined

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={showEmailDialog}>
        <DialogContent className={classes.dialogContainer}>
          <Typography variant="h6" component="h1">
            {currentAgent?.display_name} is notified about{' '}
            {contact?.display_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can also send an email to introduce {contact?.display_name} and{' '}
            {currentAgent?.display_name} if you'd like.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowEmailDialog(false)}>Skip</Button>
          <Button
            onClick={() => {
              setShowEmailDialog(false)
              setShowEmailDrawer(true)
            }}
          >
            Send Intro Email
          </Button>
        </DialogActions>
      </Dialog>
      {contact && currentAgent && currentAgent.email && (
        <AssigneeEmail
          isOpen={showEmailDrawer}
          onClose={() => setShowEmailDrawer(false)}
          currentAgentEmail={currentAgent.email}
          currentAgentName={currentAgent.display_name}
          contactName={contact.display_name}
        />
      )}

      <BasicSection title="Assignee" marginTop>
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
                />
              </ListItemIcon>
              <ListItemText primary={assignee.user?.display_name} />
              {activeBrand.id === contact.brand && (
                <div
                  className={classes.videoModeActionBar}
                  style={{
                    visibility:
                      showActionId === assignee.id ? 'visible' : 'hidden'
                  }}
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
            onClick={handleClick}
            label="Add new assignee"
            icon={mdiPlus}
          />
        )}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
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
            <TeamAgents
              flattenTeams={false}
              isPrimaryAgent={false}
              criteria={searchCriteria}
            >
              {({ isLoading, isEmptyState, teams }) => (
                <>
                  {isLoading && (
                    <Box
                      display="flex"
                      height="100%"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CircularProgress />
                    </Box>
                  )}
                  {isEmptyState && (
                    <Box my={2} textAlign="center">
                      We could not find any agent in your brand
                    </Box>
                  )}
                  {!isEmptyState && !isLoading && (
                    <AgentsList
                      teams={teams}
                      searchCriteria={searchCriteria}
                      selectedAgents={selectedAgent}
                      multiSelection={false}
                      onSelectAgent={handleSelectAgent}
                      onChangeCriteria={debouncedSetSearchCriteria}
                    />
                  )}
                </>
              )}
            </TeamAgents>
          </div>
        </Popover>
      </BasicSection>
    </>
  )
}
export default Assignee
