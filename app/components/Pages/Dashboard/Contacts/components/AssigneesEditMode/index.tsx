import { useState } from 'react'

import {
  makeStyles,
  Button,
  CircularProgress,
  DialogActions
} from '@material-ui/core'
import { useDebouncedCallback } from 'use-debounce/lib'

import { addAssignee } from '@app/models/assignees/add-assignee'
import TeamAgents from '@app/views/components/TeamAgents'
import { AgentsList } from '@app/views/components/TeamAgentsDrawer/List'

import { assigneesToBrandedUsers } from './helpers/assignees-to-branded-users'
import IntroduceAssigneesEmailCompose from './IntroduceAssigneesEmailCompose'
import IntroduceDialog from './IntroduceDialog'

const useStyles = makeStyles(
  theme => ({
    root: {
      width: '400px',
      height: '430px'
    },
    list: {
      height: '385px'
    },
    loading: {
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    emptyState: {
      margin: theme.spacing(2, 0),
      textAlign: 'center'
    }
  }),
  { name: 'AssigneesEditMode' }
)

interface Props {
  contact: INormalizedContact
  onSave: (newContact: INormalizedContact) => void
  onClose: () => void
}

export function AssigneesEditMode({ contact, onClose, onSave }: Props) {
  const classes = useStyles()
  const [showIntroduceDialog, setShowIntroduceDialog] = useState<boolean>(false)
  const [showEmailComposeDrawer, setShowEmailComposeDrawer] =
    useState<boolean>(false)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [selectedAgents, setSelectedAgents] = useState<BrandedUser[]>(
    assigneesToBrandedUsers(contact.assignees)
  )

  const [searchCriteria, setSearchCriteria] = useState('')
  const [debouncedSetSearchCriteria] = useDebouncedCallback(
    setSearchCriteria,
    500
  )

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const { data } = await addAssignee(contact.id, {
        assignees: selectedAgents.map(assignee => ({
          user: assignee.id,
          brand: assignee.brand_id
        }))
      })

      onSave(data)

      // Email feature is only available if the contact has an email
      if (selectedAgents.length > 0 && contact.email) {
        setShowIntroduceDialog(true)
      } else {
        onClose()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
      setIsDirty(false)
    }
  }

  const handleSelectAgent = (agent: BrandedUser) => {
    setIsDirty(true)

    const isSelected = selectedAgents.some(
      assignee =>
        assignee.id === agent.id && assignee.brand_id === agent.brand_id
    )

    const newAssignees = isSelected
      ? selectedAgents.filter(
          assignee =>
            assignee.id !== agent.id || assignee.brand_id !== agent.brand_id
        )
      : [...selectedAgents, agent]

    setSelectedAgents(newAssignees)
  }

  const handleOpenIntroduceDialog = () => {
    setShowIntroduceDialog(false)
    setShowEmailComposeDrawer(true)
  }

  const handleCloseIntroduceDialog = () => {
    setShowIntroduceDialog(false)
    onClose()
  }

  const handleCloseIntroduceAssigneesEmailCompose = () => {
    setShowEmailComposeDrawer(false)
    onClose()
  }

  return (
    <div className={classes.root}>
      {contact.email && (
        <>
          <IntroduceDialog
            open={showIntroduceDialog}
            assignees={selectedAgents}
            contactName={contact?.display_name}
            onClose={handleCloseIntroduceDialog}
            onConfirm={handleOpenIntroduceDialog}
          />
          <IntroduceAssigneesEmailCompose
            isOpen={showEmailComposeDrawer}
            onClose={handleCloseIntroduceAssigneesEmailCompose}
            contactEmail={contact.email}
            assignees={selectedAgents}
            contactName={contact.display_name}
            firstName={contact.first_name}
          />
        </>
      )}
      <TeamAgents flattenTeams={false} isPrimaryAgent criteria={searchCriteria}>
        {({ isLoading, isEmptyState, teams }) => (
          <>
            {isLoading && (
              <div className={classes.loading}>
                <CircularProgress />
              </div>
            )}
            {isEmptyState && (
              <div className={classes.emptyState}>
                We could not find any agent in your brand
              </div>
            )}
            {!isEmptyState && !isLoading && (
              <>
                <div className={classes.list}>
                  <AgentsList
                    teams={teams}
                    searchCriteria={searchCriteria}
                    selectedAgents={selectedAgents}
                    multiSelection
                    onSelectAgent={handleSelectAgent}
                    onChangeCriteria={debouncedSetSearchCriteria}
                  />
                </div>
                <DialogActions>
                  <Button
                    variant="text"
                    color="default"
                    disabled={isSaving}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={!isDirty || isSaving}
                    onClick={handleSave}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </DialogActions>
              </>
            )}
          </>
        )}
      </TeamAgents>
    </div>
  )
}
