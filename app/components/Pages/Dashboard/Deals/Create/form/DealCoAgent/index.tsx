import React, { useState } from 'react'
import {
  Box,
  CircularProgress,
  Button,
  makeStyles,
  TextField,
  Theme
} from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { deleteRole } from 'actions/deals'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import DealRole from 'components/DealRole/Form'

import TeamAgents from 'components/TeamAgents'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

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
    searchInputContainer: {
      backgroundColor: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1
    },
    searchInput: {
      padding: theme.spacing(1.5)
    }
  }),
  {
    name: 'CreateDeal-PrimaryAgent'
  }
)

interface Props {
  title: string
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
  const classes = useStyles()
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal, user } = useCreationContext()
  const dispatch = useDispatch()

  const [selectedRole, setSelectedRole] = useState<
    Nullable<Partial<IDealFormRole>>
  >(null)
  const [searchCriteria, setSearchCriteria] = useState<string>('')

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

      <QuestionForm width={selectedRole ? '80%' : '50%'}>
        {selectedRole ? (
          <DealRole
            isOpen
            compact
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
                  <Box className={classes.searchInputContainer}>
                    <TextField
                      fullWidth
                      onChange={e => setSearchCriteria(e.target.value)}
                      placeholder="Search Agents"
                      size="medium"
                      className={classes.searchInput}
                    />
                  </Box>

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
