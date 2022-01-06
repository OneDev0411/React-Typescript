import { useState } from 'react'

import { Box, Button } from '@material-ui/core'

import DealRoleForm from 'components/DealRole/Form'
import {
  QuestionSection,
  QuestionTitle,
  QuestionForm,
  useWizardContext,
  useSectionContext
} from 'components/QuestionWizard'

import { AgentsList } from '../../components/AgentsList'
import { ContactRoles } from '../../components/ContactRoles'
import { RoleCard } from '../../components/RoleCard'
import { useCreationContext } from '../../context/use-creation-context'
import { useStyles } from '../../hooks/use-styles'
import type { IDealFormRole } from '../../types'

interface Props {
  concurrentMode?: boolean
  dealSide: IDeal['deal_type']
  error?: string
  title?: string | React.ReactNode
  role: IDealRoleDefinition
  rolesList: IDealRole[]
  onChange?: (role: IDealRole, type: 'create' | 'update' | 'delete') => void
}

export function DealRequiredRole({
  role,
  error,
  title,
  rolesList,
  dealSide,
  concurrentMode = false,
  onChange
}: Props) {
  const classes = useStyles()
  const { checklist } = useCreationContext()
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const [selectedRole, setSelectedRole] =
    useState<Nullable<Partial<IDealFormRole>>>(null)

  const isCoAgentRole = ['CoSellerAgent', 'CoBuyerAgent'].includes(role.role)

  const handleUpsertRole = (role: IDealRole, type: 'create' | 'update') => {
    wizard.setStep(step)

    if (role.deal) {
      return
    }

    onChange?.(role, type)
  }

  const handleNext = () => {
    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  const handleDeleteRole = (role: IDealRole) => {
    if (rolesList.filter(item => item.role === role.role).length === 1) {
      wizard.setStep(step)
    }

    onChange?.(role, 'delete')
  }

  return (
    <QuestionSection error={error}>
      <QuestionTitle>
        {title || (
          <>
            What's the{' '}
            <span className={classes.brandedTitle}>
              {role.title}'s Legal Name
            </span>
          </>
        )}
      </QuestionTitle>

      <QuestionForm>
        {selectedRole ? (
          <DealRoleForm
            isOpen
            compact
            showSaveContactButton
            checklist={checklist}
            dealSide={dealSide}
            form={selectedRole}
            defaultRole={role.role}
            allowedRoles={[role.role]}
            onUpsertRole={handleUpsertRole}
            onDeleteRole={handleDeleteRole}
            onClose={() => setSelectedRole(null)}
          />
        ) : (
          <Box display="flex" flexWrap="wrap" width="100%">
            {rolesList
              .filter(item => item.role === role.role)
              .map(role => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onClickEdit={() => setSelectedRole(role)}
                  onClickRemove={() => handleDeleteRole(role)}
                />
              ))}
          </Box>
        )}

        <Box
          style={{
            display: !selectedRole ? 'block' : 'none'
          }}
        >
          {isCoAgentRole && (
            <AgentsList
              flattenTeams
              useTeamBrandId
              isPrimaryAgent={false}
              onSelectRole={setSelectedRole}
            />
          )}

          {!isCoAgentRole && (
            <ContactRoles
              placeholder={`Type ${role.title}`}
              onSelectRole={setSelectedRole}
            />
          )}
        </Box>

        {!concurrentMode && !selectedRole && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            mt={4}
          >
            <Button
              variant="contained"
              color="secondary"
              disabled={rolesList.length === 0}
              onClick={handleNext}
            >
              Continue
            </Button>
          </Box>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}
