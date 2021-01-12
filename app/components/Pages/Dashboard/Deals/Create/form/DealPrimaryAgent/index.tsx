import React, { useState } from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import DealRole from 'components/DealRole'

import TeamAgents from 'components/TeamAgents'
import { useWizardForm } from 'components/QuestionWizard/use-context'

import { useFormContext } from '../../context/use-form-context'
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
  step?: number
  title: string
  agentSide: IDealType
  isCommissionRequired: boolean
  finishStepCallback?: (agents: IDealFormRole[]) => Promise<void>
}

export function DealPrimaryAgent({
  step,
  title,
  agentSide,
  isCommissionRequired,
  finishStepCallback
}: Props) {
  const classes = useStyles()
  const wizard = useWizardForm()
  const context = useFormContext()

  const [selectedRole, setSelectedRole] = useState<
    Nullable<Partial<IDealFormRole>>
  >(null)

  if (wizard.lastVisitedStep < step!) {
    return null
  }

  const allowedRoles = getAllowedRoles(agentSide)

  const list = Object.values(context.form.primaryAgents ?? {}).filter(agent =>
    allowedRoles.includes(agent.role)
  )

  const handleUpsert = async (agent: IDealFormRole) => {
    const agents = {
      ...list,
      [agent.id]: agent
    }

    context.updateForm({
      primaryAgents: agents
    })

    if (finishStepCallback) {
      wizard.setShowLoading(true)
      await finishStepCallback(agents)
      wizard.setShowLoading(false)

      wizard.next(0)
    } else {
      wizard.next()
    }
  }

  const handleRemove = (agent: IDealFormRole) => {
    context.updateForm({
      primaryAgents: Object.entries(list).reduce((acc, [id, item]) => {
        if (item.id === agent.id) {
          return acc
        }

        return {
          ...acc,
          [id]: item
        }
      }, {})
    })
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>{title}</QuestionTitle>

      {selectedRole ? (
        <Box mt={1}>
          <DealRole
            isOpen
            user={context.user}
            dealSide={context.form.side}
            form={selectedRole}
            allowedRoles={allowedRoles}
            isCommissionRequired={isCommissionRequired}
            onUpsertRole={handleUpsert}
            onClose={() => setSelectedRole(null)}
          />
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap">
          {list.map(agent => (
            <RoleCard
              key={agent.id}
              role={agent}
              onClickEdit={() => setSelectedRole(agent)}
              onClickRemove={() => handleRemove(agent)}
            />
          ))}
        </Box>
      )}

      <QuestionForm>
        <Box
          style={{
            display:
              Object.keys(list).length === 0 && !selectedRole ? 'block' : 'none'
          }}
        >
          <TeamAgents flattenTeams isPrimaryAgent>
            {({ teams, isLoading }) =>
              !isLoading && (
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

function getAllowedRoles(type: IDealType): string[] {
  if (type === 'Buying') {
    return ['BuyerAgent']
  }

  if (type === 'Selling') {
    return ['SellerAgent']
  }

  return []
}
