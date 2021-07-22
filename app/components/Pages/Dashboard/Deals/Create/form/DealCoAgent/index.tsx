import React, { useState } from 'react'

import { Box, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { deleteRole } from 'actions/deals'
// eslint-disable-next-line import/no-named-as-default
import DealRole from 'components/DealRole/Form'
import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

import { AgentsList } from '../../components/AgentsList'
import { RoleCard } from '../../components/RoleCard'
import { useCreationContext } from '../../context/use-creation-context'
import type { IDealFormRole } from '../../types'

interface Props {
  title: React.ReactNode
  side: IDealType
  roles: IDealRole[]
  isCommissionRequired: boolean
  onChange?: (role: IDealRole, type: 'create' | 'update' | 'delete') => void
}

export function DealCoAgent({
  title,
  side,
  roles,
  isCommissionRequired,
  onChange
}: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal } = useCreationContext()
  const dispatch = useDispatch()

  const [selectedRole, setSelectedRole] =
    useState<Nullable<Partial<IDealFormRole>>>(null)
  const allowedRoles = getAllowedRoles(side)
  const agentRoles = roles.filter(client => allowedRoles.includes(client.role))

  const handleUpsertRole = (role: IDealRole, type: 'create' | 'update') => {
    if (role.deal) {
      return
    }

    onChange?.(role, type)
  }

  const handleDeleteRole = (role: IDealRole) => {
    if (role.deal) {
      dispatch(deleteRole(deal!.id, role.id))

      return
    }

    onChange?.(role, 'delete')
  }

  const handleNext = () => {
    if (wizard.currentStep === step) {
      wizard.next()
    }
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
            dealSide={side}
            form={selectedRole}
            allowedRoles={allowedRoles}
            isCommissionRequired={isCommissionRequired}
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
            display: !selectedRole ? 'block' : 'none'
          }}
        >
          <AgentsList
            flattenTeams
            useTeamBrandId
            isPrimaryAgent={false}
            onSelectRole={setSelectedRole}
          />

          {!selectedRole && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              mt={4}
            >
              <Button
                variant="outlined"
                disabled={agentRoles.length > 0}
                onClick={handleNext}
              >
                Skip
              </Button>

              {roles.length > 0 && (
                <Box ml={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNext}
                  >
                    Continue
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}

function getAllowedRoles(type: IDealType): string[] {
  if (type === 'Buying') {
    return ['CoBuyerAgent']
  }

  if (type === 'Selling') {
    return ['CoSellerAgent']
  }

  return []
}
