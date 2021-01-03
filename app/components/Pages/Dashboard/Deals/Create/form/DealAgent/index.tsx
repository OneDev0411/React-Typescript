import React, { useState } from 'react'
import {
  Box,
  Button,
  makeStyles,
  TextField,
  Theme,
  Typography,
  Avatar
} from '@material-ui/core'

import cn from 'classnames'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import TeamAgents from 'components/TeamAgents'
import { useWizardForm } from 'components/QuestionWizard/use-context'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      maxHeight: '40vh',
      overflow: 'auto'
    },
    row: {
      padding: theme.spacing(1)
    },
    hoverable: {
      '&:hover': {
        cursor: 'pointer',
        background: theme.palette.action.hover
      }
    },
    selectedAgent: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(1, 0.5, 0.5, 0)
    },
    avatarContainer: {
      paddingRight: theme.spacing(2)
    },
    email: {
      color: theme.palette.grey['500']
    },
    searchInput: {
      padding: theme.spacing(1.5)
    },
    submitButton: {
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
  type: 'primary' | 'co-agent'
}

export function DealAgent({ step, type, title }: Props) {
  const classes = useStyles()
  const wizard = useWizardForm()

  const [selectedAgents, setSelectedAgents] = useState<IUser[]>([])
  const [searchCriteria, setSearchCriteria] = useState<string>('')

  const showAgentsList = type === 'primary' ? selectedAgents.length === 0 : true

  const notSelected = (user: IUser) =>
    selectedAgents.every(agent => agent.id !== user.id)

  const handleSelectAgent = (agent: IUser) => {
    setSelectedAgents([...selectedAgents, agent])

    if (type === 'primary') {
      wizard.next()
    }
  }

  const handleNext = () => {
    wizard.next()
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>{title}</QuestionTitle>

      <Box display="flex" flexWrap="wrap">
        {selectedAgents.map(agent => (
          <Box
            key={agent.id}
            display="flex"
            className={cn(classes.row, classes.selectedAgent)}
          >
            <div className={classes.avatarContainer}>
              <Avatar src={agent.profile_image_url!} alt={agent.display_name} />
            </div>
            <div>
              <Typography variant="body2">{agent.display_name}</Typography>
              <Typography variant="body2" className={classes.email}>
                {agent.email}
              </Typography>
            </div>
          </Box>
        ))}
      </Box>

      <QuestionForm>
        {showAgentsList && (
          <TeamAgents
            isPrimaryAgent={type === 'primary'}
            flattenTeams
            criteria={searchCriteria}
          >
            {({ teams, isLoading }) =>
              !isLoading && (
                <div className={classes.root}>
                  {type === 'co-agent' && (
                    <TextField
                      onChange={e => setSearchCriteria(e.target.value)}
                      placeholder="Search Agents"
                      size="medium"
                      className={classes.searchInput}
                      fullWidth
                    />
                  )}

                  {teams.map((team, index) => (
                    <div key={index}>
                      {team.users.filter(notSelected).map(agent => (
                        <Box
                          key={agent.id}
                          display="flex"
                          className={cn(classes.row, classes.hoverable)}
                          onClick={() => handleSelectAgent(agent)}
                        >
                          <div className={classes.avatarContainer}>
                            <Avatar
                              src={agent.profile_image_url!}
                              alt={agent.display_name}
                            />
                          </div>
                          <div>
                            <Typography variant="body2">
                              {agent.display_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              className={classes.email}
                            >
                              {agent.email}
                            </Typography>
                          </div>
                        </Box>
                      ))}
                    </div>
                  ))}
                </div>
              )
            }
          </TeamAgents>
        )}

        {type === 'co-agent' && (
          <Button
            variant="contained"
            color="secondary"
            className={classes.submitButton}
            onClick={handleNext}
          >
            Continue
          </Button>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}
