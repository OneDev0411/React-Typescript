import React, { useState, useEffect } from 'react'
import { Box, CircularProgress, makeStyles, Theme } from '@material-ui/core'

import { useDispatch } from 'react-redux'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import DealRole from 'components/DealRole'

import TeamAgents from 'components/TeamAgents'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { deleteRole } from 'models/Deal/role'

import { useCreationContext } from '../../context/use-creation-context'
import { convertUserAgentToRole } from '../../helpers/convert-user-to-role'

import { UserRow } from '../../components/UserRow'
import { RoleCard } from '../../components/RoleCard'

import type { IDealFormRole } from '../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      maxHeight: '40vh',
      overflow: 'auto'
    },

    selectedAgent: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(1, 0.5, 0.5, 0)
    },
    searchInput: {
      padding: theme.spacing(1.5)
    },
    continueButton: {
      margin: theme.spacing(2, 0)
    }
  }),
  {
    name: 'CreateDeal-PrimaryAgent'
  }
)

interface Props {
  title: string
  side: IDealType
  isCommissionRequired: boolean
  roles?: IDealRole[]
  onChange: (role: IDealRole, type: 'create' | 'update' | 'delete') => void
  onFinishStep?: () => Promise<void>
}

export function DealPrimaryAgent({
  title,
  side,
  roles = [],
  isCommissionRequired,
  onFinishStep,
  onChange = () => {}
}: Props) {
  const classes = useStyles()
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

  const handleUpsertRole = async (
    role: IDealFormRole,
    type: 'create' | 'update'
  ) => {
    wizard.setLoading(true)

    onChange(role, type)

    onFinishStep && (await onFinishStep())

    wizard.setLoading(false)
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
    <QuestionSection disabled={!!deal}>
      <QuestionTitle>{title}</QuestionTitle>

      {selectedRole ? (
        <Box mt={1}>
          <DealRole
            isOpen
            deal={deal}
            user={user}
            dealSide={side}
            form={selectedRole}
            allowedRoles={allowedRoles}
            isCommissionRequired={isCommissionRequired}
            onUpsertRole={handleUpsertRole}
            onDeleteRole={handleDeleteRole}
            onClose={() => setSelectedRole(null)}
          />
        </Box>
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

      <QuestionForm>
        <Box
          style={{
            display: agentRoles.length === 0 && !selectedRole ? 'block' : 'none'
          }}
        >
          <TeamAgents flattenTeams isPrimaryAgent>
            {({ teams, isLoading }) =>
              isLoading ? (
                <CircularProgress disableShrink />
              ) : (
                <div className={classes.root}>
                  {teams.map((team, index) => (
                    <div key={index}>
                      {team.users.map(agent => (
                        <UserRow
                          key={agent.id}
                          name={agent.display_name}
                          email={agent.email}
                          avatarUrl={agent.profile_image_url!}
                          onClick={() =>
                            setSelectedRole(convertUserAgentToRole(agent))
                          }
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )
            }
          </TeamAgents>
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
