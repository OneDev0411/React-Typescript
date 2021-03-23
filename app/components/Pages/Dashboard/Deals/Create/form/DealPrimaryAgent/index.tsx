import React, { useState, useEffect } from 'react'
import { Box } from '@material-ui/core'

import { useDispatch } from 'react-redux'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import DealRole from 'components/DealRole/Form'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { deleteRole } from 'models/Deal/role'

import { useCreationContext } from '../../context/use-creation-context'

import { RoleCard } from '../../components/RoleCard'
import { ContactRoles } from '../../components/ContactRoles'

import { AgentsList } from './AgentsList'

import type { IDealFormRole } from '../../types'

interface Props {
  title: string
  side: IDealType
  isCommissionRequired: boolean
  isOfficeDoubleEnded?: boolean
  shouldPickRoleFromContacts?: boolean
  roles?: IDealRole[]
  onChange: (role: IDealRole, type: 'create' | 'update' | 'delete') => void
}

export function DealPrimaryAgent({
  title,
  side,
  isCommissionRequired,
  roles = [],
  isOfficeDoubleEnded = false,
  shouldPickRoleFromContacts = false,
  onChange = () => {}
}: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal, user } = useCreationContext()

  const dispatch = useDispatch()

  const [selectedRole, setSelectedRole] = useState<
    Nullable<Partial<IDealFormRole>>
  >(null)

  const allowedRoles = getRoles(side)
  const agentRoles = roles.filter(client => allowedRoles.includes(client.role))

  useEffect(() => {
    if (
      agentRoles.length > 0 &&
      wizard.currentStep === step &&
      wizard.isLoading === false
    ) {
      wizard.next()
    }
  }, [step, wizard, agentRoles])

  const handleUpsertRole = (role: IDealFormRole, type: 'create' | 'update') => {
    onChange(role, type)
  }

  const handleDeleteRole = (role: IDealFormRole) => {
    if (deal) {
      dispatch(deleteRole(deal!.id, role.id))

      return
    }

    onChange?.(role, 'delete')
  }

  if (wizard.lastVisitedStep < step) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>{title}</QuestionTitle>

      <QuestionForm>
        {selectedRole ? (
          <DealRole
            isOpen
            compact
            deal={deal}
            user={user}
            dealSide={side}
            form={selectedRole}
            allowedRoles={allowedRoles}
            isCommissionRequired={
              shouldPickRoleFromContacts ? false : isCommissionRequired
            }
            onUpsertRole={handleUpsertRole}
            onDeleteRole={handleDeleteRole}
            onClose={() => setSelectedRole(null)}
          />
        ) : (
          <Box display="flex" flexWrap="wrap">
            {agentRoles.map(role => (
              <RoleCard
                key={role.id}
                role={role}
                readonly={!deal && !!role.deal}
                onClickEdit={() => setSelectedRole(role)}
                onClickRemove={() => handleDeleteRole(role)}
              />
            ))}
          </Box>
        )}

        <Box
          style={{
            display: agentRoles.length === 0 && !selectedRole ? 'block' : 'none'
          }}
        >
          {shouldPickRoleFromContacts ? (
            <ContactRoles onSelectRole={setSelectedRole} />
          ) : (
            <AgentsList
              isOfficeDoubleEnded={isOfficeDoubleEnded}
              onSelectRole={setSelectedRole}
            />
          )}
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}

function getRoles(type: IDealType): string[] {
  if (type === 'Buying') {
    return ['BuyerAgent']
  }

  if (type === 'Selling') {
    return ['SellerAgent']
  }

  return []
}
