import { useState } from 'react'

import { Box, CircularProgress } from '@material-ui/core'
import { useDebouncedCallback } from 'use-debounce/lib'

import { addAssignee } from '@app/models/assignees/add-assignee'
import TeamAgents from '@app/views/components/TeamAgents'
import { AgentsList } from '@app/views/components/TeamAgentsDrawer/List'

import AssigneeDialog from './AssigneeDialog'
import AssigneeEmail from './AssigneeEmail'

interface Props {
  contact: INormalizedContact
  onChange: (newContact: INormalizedContact) => void
}

export function AssigneesEditMode({ contact, onChange }: Props) {
  const [currentAgent, setCurrentAgent] = useState<Nullable<BrandedUser>>(null)
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false)
  const [showEmailDrawer, setShowEmailDrawer] = useState<boolean>(false)
  const [selectedAgent] = useState<BrandedUser[]>([])
  const [searchCriteria, setSearchCriteria] = useState('')
  const [debouncedSetSearchCriteria] = useDebouncedCallback(
    setSearchCriteria,
    500
  )

  const handleSelect = async (agent: BrandedUser) => {
    if (!agent && !contact.assignees) {
      return
    }

    const assignees = Array.isArray(contact.assignees)
      ? contact.assignees.map(assignee => ({
          user: assignee?.user?.id,
          brand: assignee?.brand?.id
        }))
      : []

    try {
      const { data } = await addAssignee(contact.id, {
        assignees: [...assignees, { brand: agent.brand_id, user: agent.id }]
      })

      setCurrentAgent(agent)

      // Email feature is only available if the contact has an email
      if (contact.email) {
        setShowEmailDialog(true)
      }

      onChange(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCloseDialog = () => setShowEmailDialog(false)

  const handleSendEmail = () => {
    setShowEmailDialog(false)
    setShowEmailDrawer(true)
  }

  return (
    <>
      <AssigneeDialog
        open={showEmailDialog}
        currentAgentName={currentAgent?.display_name}
        currentContactName={contact?.display_name}
        handleClose={handleCloseDialog}
        handleConfirm={handleSendEmail}
      />
      {contact?.email && currentAgent?.email && (
        <AssigneeEmail
          isOpen={showEmailDrawer}
          onClose={() => setShowEmailDrawer(false)}
          contactEmail={contact.email}
          currentAgentName={currentAgent.display_name}
          currentAgentEmail={currentAgent.email}
          contactName={contact.display_name}
        />
      )}
      <TeamAgents flattenTeams={false} isPrimaryAgent criteria={searchCriteria}>
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
                onSelectAgent={agent => {
                  handleSelect(agent)
                }}
                onChangeCriteria={debouncedSetSearchCriteria}
              />
            )}
          </>
        )}
      </TeamAgents>
    </>
  )
}
