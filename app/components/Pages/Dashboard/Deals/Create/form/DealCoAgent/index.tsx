import React, { useState } from 'react'
import {
  Box,
  CircularProgress,
  Button,
  makeStyles,
  TextField,
  Theme
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { selectDealRoles } from 'reducers/deals/roles'

import { deleteRole } from 'actions/deals'

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
  const dispatch = useDispatch()

  const [selectedRole, setSelectedRole] = useState<
    Nullable<Partial<IDealFormRole>>
  >(null)
  const [searchCriteria, setSearchCriteria] = useState<string>('')

  const allowedRoles = getAllowedRoles(agentSide)

  const roles = useSelector<IAppState, IDealRole[]>(({ deals }) => {
    return context.deal
      ? (selectDealRoles(
          deals.roles,
          context.deal
        ).filter((client: IDealRole) =>
          allowedRoles.includes(client.role)
        ) as IDealRole[])
      : []
  })

  const handleRemove = async (role: IDealRole) => {
    return dispatch(deleteRole(context.deal!.id, role.id))
  }

  const handleContinue = () => {
    wizard.next()
  }

  if (wizard.lastVisitedStep < step!) {
    return null
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>{title}</QuestionTitle>

      {selectedRole ? (
        <Box mt={1}>
          <DealRole
            isOpen
            deal={context.deal}
            user={context.user}
            dealSide={context.form.side}
            form={selectedRole}
            allowedRoles={allowedRoles}
            isCommissionRequired={isCommissionRequired}
            onClose={() => setSelectedRole(null)}
          />
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap">
          {roles.map(agent => (
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
            display: !selectedRole ? 'block' : 'none'
          }}
        >
          <TeamAgents
            flattenTeams
            isPrimaryAgent={false}
            criteria={searchCriteria}
          >
            {({ teams, isLoading }) =>
              isLoading ? (
                <CircularProgress disableShrink />
              ) : (
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
