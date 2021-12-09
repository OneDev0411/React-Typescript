import { useState } from 'react'

import { Box } from '@material-ui/core'

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
  dealSide: IDeal['deal_type']
  error: string
  role: IDealRoleDefinition
  rolesList: IDealRole[]
  onChange?: (role: IDealRole, type: 'create' | 'update' | 'delete') => void
}

export function DealRequiredRole({
  role,
  error,
  rolesList,
  dealSide,
  onChange
}: Props) {
  const classes = useStyles()
  const { checklist } = useCreationContext()
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const [selectedRole, setSelectedRole] =
    useState<Nullable<Partial<IDealFormRole>>>(null)

  const isPrimaryAgentRole = ['SellerAgent', 'BuyerAgent'].includes(role.role)
  const isCoAgentRole = ['CoSellerAgent', 'CoBuyerAgent'].includes(role.role)

  const handleUpsertRole = (role: IDealRole, type: 'create' | 'update') => {
    wizard.setStep(step)

    if (role.deal) {
      return
    }

    onChange?.(role, type)
  }

  const handleDeleteRole = (role: IDealRole) => {
    onChange?.(role, 'delete')
  }

  return (
    <QuestionSection error={error}>
      <QuestionTitle>
        What's the{' '}
        <span className={classes.brandedTitle}>{role.title}'s Legal Name</span>
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

          {!isPrimaryAgentRole && !isCoAgentRole && (
            <ContactRoles
              placeholder={`Type ${role.title}`}
              onSelectRole={setSelectedRole}
            />
          )}
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}
