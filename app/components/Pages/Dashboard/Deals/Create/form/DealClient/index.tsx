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

import DealRoleForm from 'components/DealRole'

import { RoleCard } from '../../components/RoleCard'

import { useCreationContext } from '../../context/use-creation-context'

import { ContactRoles } from '../../components/ContactRoles'

import type { IDealFormRole } from '../../types'

interface Props {
  title: string
  side: IDealType
  roles: IDealRole[]
  onChange?: (role: IDealRole, type: 'update' | 'create' | 'delete') => void
}

export function DealClient({ side, title, roles, onChange }: Props) {
  const { deal, user, checklist } = useCreationContext()
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const dispatch = useDispatch()

  const allowedRoles = getRoles(side)
  const clientRoles = roles.filter(client => allowedRoles.includes(client.role))

  /**
   * list of all existence roles
   */

  const [selectedRole, setSelectedRole] = useState<
    Nullable<Partial<IDealFormRole>>
  >(null)

  const handleNext = () => {
    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

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

  if (wizard.lastVisitedStep < step) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>{title}</QuestionTitle>

      <QuestionForm>
        {selectedRole ? (
          <Box mt={1}>
            <DealRoleForm
              isOpen
              user={user}
              deal={deal}
              checklist={checklist}
              dealSide={side}
              form={selectedRole}
              allowedRoles={allowedRoles}
              onUpsertRole={handleUpsertRole}
              onDeleteRole={handleDeleteRole}
              onClose={() => setSelectedRole(null)}
            />
          </Box>
        ) : (
          <Box display="flex" flexWrap="wrap" width="100%">
            {clientRoles.map(role => (
              <RoleCard
                key={role.id}
                role={role}
                /* readonly prop only is valid in Create Offer flow
                 * and makes readonly the roles that have been already created
                 */
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
          <ContactRoles onSelectRole={setSelectedRole} />
        </Box>

        {!selectedRole && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            mt={4}
          >
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
    return ['Buyer', 'BuyerPowerOfAttorney', 'Tenant', 'TenantPowerOfAttorney']
  }

  if (type === 'Selling') {
    return [
      'Seller',
      'SellerPowerOfAttorney',
      'Landlord',
      'LandlordPowerOfAttorney'
    ]
  }

  return []
}
