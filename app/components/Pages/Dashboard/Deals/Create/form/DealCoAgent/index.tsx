import React, { useState } from 'react'
import { Box, Button, makeStyles, TextField, Theme } from '@material-ui/core'

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
}

export function DealCoAgent({
  step,
  title,
  agentSide,
  isCommissionRequired
}: Props) {
  const classes = useStyles()
  const wizard = useWizardForm()
  const context = useFormContext()

  const [selectedRole, setSelectedRole] = useState<
    Nullable<Partial<IDealFormRole>>
  >(null)
  const [searchCriteria, setSearchCriteria] = useState<string>('')

  // const list = []

  if (wizard.lastVisitedStep < step!) {
    return null
  }

  const allowedRoles = getAllowedRoles(agentSide)

  const handleUpsert = async (agent: IDealFormRole) => {}

  const handleRemove = (agent: IDealFormRole) => {}

  const handleContinue = () => {
    wizard.next()
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
          {/* {list.map(agent => (
            <RoleCard
              key={agent.id}
              agent={agent}
              onClickEdit={() => setSelectedRole(agent)}
              onClickRemove={() => handleRemove(agent)}
            />
          ))} */}
        </Box>
      )}

      <QuestionForm>
        <Box
          style={{
            display: !selectedRole ? 'block' : 'none'
          }}
        >
          <TeamAgents
            flattenTeams
            isPrimaryAgent={false}
            criteria={searchCriteria}
          >
            {({ teams, isLoading }) =>
              !isLoading && (
                <div className={classes.root}>
                  <TextField
                    fullWidth
                    onChange={e => setSearchCriteria(e.target.value)}
                    placeholder="Search Agents"
                    size="medium"
                    className={classes.searchInput}
                  />

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

        <Button
          variant="contained"
          color="secondary"
          className={classes.continueButton}
          onClick={handleContinue}
        >
          Continue
        </Button>
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
