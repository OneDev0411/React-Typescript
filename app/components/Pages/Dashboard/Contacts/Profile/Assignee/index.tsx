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
// eslint-disable-next-line import/no-unresolved
import { IContactAttributeDef, INormalizedContact } from 'types/Contact'
import useDebouncedCallback from 'use-debounce/lib/callback'

import { addAssignee } from '@app/models/assignees/add-assignee'
import { SingleEmailComposeDrawer } from '@app/views/components/EmailCompose'
import { muiIconSizes } from '@app/views/components/SvgIcons'
import TeamAgents from '@app/views/components/TeamAgents'
import { BrandedUser } from '@app/views/components/TeamAgents/types'
import { AgentsList } from '@app/views/components/TeamAgentsDrawer/List'
import UserAvatar from '@app/views/components/UserAvatar'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { BasicSection } from '../components/Section/Basic'
import { SectionButton } from '../components/Section/Button'

import { ViewModeActionBar } from './style'

interface Props {
  contact: INormalizedContact
  submitCallback: (
    newContact: INormalizedContact,
    updatedAttribute: IContactAttributeDef
  ) => void
}

const useStyles = makeStyles(
  theme => ({
    dialogContainer: {
      textAlign: 'center'
    },
    popoverContainer: {
      width: '500px',
      height: '300px',
      maxHeight: '300px'
    },
    actionContainer: {
      display: 'flex',
      alignItems: 'center',
      background: theme.palette.background.paper,
      padding: theme.spacing(0.5),
      borderRadius: `${theme.shape.borderRadius}px`,
      boxShadow:
        '0px 0px 8px rgba(0, 0, 0, 0.25), 0px 16px 16px -8px rgba(0, 0, 0, 0.25)'
    },
    action: {
      padding: theme.spacing(0, 2),
      background: theme.palette.background.paper,
      borderRadius: `${theme.shape.borderRadius}px`,
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
    }
  }),
  { name: 'InlineEditFieldViewMode' }
)

const Assignee = ({ contact, submitCallback }: Props) => {
  const classes = useStyles()
  // Need To Find how this submit callback works
  // Then Refect the Contact after adding the assignee
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [selectedAgent, setSelectedAgents] = useState<BrandedUser[]>(
    [] as BrandedUser[]
  )
  const [currentAgent, setCurrentAgent] = useState<BrandedUser | null>(null)
  const [showActionId, setShowActionId] = useState<UUID | null>('')
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false)
  const [showEmailDrawer, setShowEmailDrawer] = useState<boolean>(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const [searchCriteria, setSearchCriteria] = useState<string>('')
  const [debouncedSetSearchCriteria] = useDebouncedCallback(
    setSearchCriteria,
    500
  )

  const handleSelectAgent = async (user: BrandedUser) => {
    let oldAssignees = []

    if (contact.assignees) {
      contact.assignees.map(assignee => {
        oldAssignees.push({
          user: assignee?.user?.id,
          brand: assignee?.brand?.id
        })
      })
    }

    if (user) {
      const data = await addAssignee(contact.id, {
        assignees: [...oldAssignees, { brand: user.brand_id, user: user.id }]
      })

      if (data.code === 'OK') {
        setCurrentAgent(user)
        setShowEmailDialog(true)
        setSelectedAgents(data.references.user)
        submitCallback(data?.data, data?.data)
        handleClose()
      }
    }
  }

  const handleDelete = async (id: UUID) => {
    if (contact.assignees) {
      let RemovedAssignees = contact?.assignees?.filter(
        assignee => assignee.id !== id
      )

      let newAssignees = []

      RemovedAssignees.map(assignee => {
        newAssignees.push({
          user: assignee?.user?.id,
          brand: assignee?.brand?.id
        })
      })

      const data = await addAssignee(contact.id, {
        assignees: newAssignees
      })

      if (data.code === 'OK') {
        setSelectedAgents(data.references.user)
        submitCallback(data?.data, data?.data)
        setShowActionId(null)
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
            {currentAgent?.first_name} is notified about {contact.first_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can also send an email to introduce {contact.first_name} and{' '}
            {currentAgent?.first_name} if you'd like.
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
      {currentAgent && (
        <SingleEmailComposeDrawer
          isOpen={showEmailDrawer}
          onClose={() => setShowEmailDrawer(false)}
          emailId={currentAgent?.email}
          initialValues={{
            subject: 'Would you refer me to friend or family member?',
            to: [
              {
                email: `${currentAgent.display_name} <${currentAgent.email}>`,
                recipient_type: 'Email'
              }
            ],
            body: `Hi ${currentAgent?.first_name},
          Can you help me out?
          As I so often turn to you for advice when it comes to my business, I'd love if you could help in finding me some new Clients.
  
          If you could refer anyone in your network that you think would benefit from my help or services, please send them my way.

          I know your good word goes a long way with these things, and because of your insight on my business, you know what a qualified client looks like for me!

          I appreciate it!

          Cheers,
          ${contact.first_name}
          `
          }}
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
              <ViewModeActionBar show={showActionId === assignee.id}>
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
              </ViewModeActionBar>
            </ListItem>
          ))}
        </List>
        <SectionButton
          aria-describedby={id}
          onClick={handleClick}
          label="Add new assignee"
          icon={mdiPlus}
        />
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
