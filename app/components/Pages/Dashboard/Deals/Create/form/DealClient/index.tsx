import React, { useState } from 'react'
import { Box, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { deleteRole } from 'actions/deals'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import DealRoleForm from 'components/DealRole/Form'

import { RoleCard } from '../../components/RoleCard'

import { useCreationContext } from '../../context/use-creation-context'

import { ContactRoles } from '../../components/ContactRoles'
import { BUYER_ROLES, SELLER_ROLES } from '../../helpers/roles'

import type { IDealFormRole } from '../../types'

interface Props {
  title: React.ReactNode
  side: IDealType
  propertyType: IDealPropertyType
  roles: IDealRole[]
  predefinedRoles?: IDealRole[]
  skippable?: boolean
  concurrentMode?: boolean
  onChange?: (role: IDealRole, type: 'update' | 'create' | 'delete') => void
}

export function DealClient({
  side,
  title,
  roles,
  concurrentMode = false,
  propertyType,
  predefinedRoles = [],
  skippable = false,
  onChange
}: Props) {
  const { user, checklist } = useCreationContext()
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const dispatch = useDispatch()

  const allowedRoles = getRoles(side)
  const clientRoles = Array.isArray(roles)
    ? roles.filter(client => allowedRoles.includes(client.role))
    : []
  const predefinedClientRoles = predefinedRoles.filter(client =>
    allowedRoles.includes(client.role)
  )

  /**
   * list of all existence roles
   */

  const [selectedRole, setSelectedRole] = useState<
    Nullable<Partial<IDealFormRole>>
  >(null)

  const getSearchInputPlaceholder = () => {
    const type =
      side === 'Selling'
        ? propertyType?.is_lease
          ? 'Landlord'
          : 'Seller'
        : propertyType?.is_lease
        ? 'Tenant'
        : 'Buyer'

    return `Type ${clientRoles.length > 0 ? 'Co-' : ''}${type} Name`
  }

  const handleNext = () => {
    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  const handleUpsertRole = (role: IDealRole, type: 'create' | 'update') => {
    wizard.setStep(step)

    if (role.deal) {
      return
    }

    onChange?.(role, type)
  }

  const handleDeleteRole = (role: IDealRole) => {
    if (role.deal) {
      dispatch(deleteRole(role.deal, role.id))

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
          <DealRoleForm
            isOpen
            compact
            showSaveContactButton
            user={user}
            checklist={checklist}
            dealSide={side}
            form={selectedRole}
            allowedRoles={allowedRoles}
            onUpsertRole={handleUpsertRole}
            onDeleteRole={handleDeleteRole}
            onClose={() => setSelectedRole(null)}
          />
        ) : (
          <Box display="flex" flexWrap="wrap" width="100%">
            {predefinedClientRoles.map(role => (
              <RoleCard key={role.id} role={role} readonly />
            ))}

            {clientRoles.map(role => (
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
          <ContactRoles
            placeholder={getSearchInputPlaceholder()}
            onSelectRole={setSelectedRole}
          />
        </Box>

        {!concurrentMode && !selectedRole && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            mt={4}
          >
            {skippable && (
              <Box mr={1}>
                <Button
                  variant="outlined"
                  color="secondary"
                  disabled={clientRoles.length > 0}
                  onClick={handleNext}
                >
                  Skip
                </Button>
              </Box>
            )}

            <Button
              variant="contained"
              color="secondary"
              disabled={clientRoles.length === 0}
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

function getRoles(type?: IDealType) {
  if (!type) {
    return []
  }

  if (type === 'Buying') {
    return BUYER_ROLES
  }

  if (type === 'Selling') {
    return SELLER_ROLES
  }

  return []
}
