import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@material-ui/core'
import pluralize from 'pluralize'

import Drawer from 'components/OverlayDrawer'

import { getTeamAvailableMembers } from 'utils/user-teams'

import Team from './Team'

interface TeamWithMembers {
  team: IUserTeam
  members: IUser[]
}

interface Props {
  user: IUser
  title?: string
  onSelectTeams(teams: UUID[]): void
  onClose(): void
}

export default function UserTeams({
  user,
  title = 'Select Teams',
  onClose,
  onSelectTeams
}: Props) {
  const [teamsWithMembers, setTeamsWithMembers] = useState<TeamWithMembers[]>(
    []
  )
  const [selectedTeams, setSelectedTeams] = useState<UUID[]>([])

  useEffect(() => {
    function getteamsWithMembers(): TeamWithMembers[] {
      if (!user.teams) {
        return []
      }

      return user.teams.map(team => {
        return {
          team,
          members: getTeamAvailableMembers(team)
        }
      })
    }

    setTeamsWithMembers(getteamsWithMembers())
  }, [user.teams])

  const handleSelectChange = useCallback(
    (team: IUserTeam) => {
      if (selectedTeams.includes(team.brand.id)) {
        setSelectedTeams(selectedTeams.filter(id => id !== team.brand.id))

        return
      }

      setSelectedTeams([...selectedTeams, team.brand.id])
    },
    [selectedTeams]
  )

  const getActionButtonCopy = useCallback(() => {
    if (selectedTeams.length === 0) {
      return 'No teams selected'
    }

    return `Save for ${pluralize('team', selectedTeams.length, true)}`
  }, [selectedTeams.length])

  return (
    <Drawer open onClose={onClose}>
      <Drawer.Header title={title} />
      <Drawer.Body>
        {teamsWithMembers.map(({ team, members }) => {
          const isSelected = selectedTeams.includes(team.brand.id)

          return (
            <Team
              key={`${team.brand.id}-${isSelected}`}
              team={team}
              members={members}
              isSelected={isSelected}
              onSelectChange={handleSelectChange}
            />
          )
        })}
      </Drawer.Body>
      <Drawer.Footer style={{ flexDirection: 'row-reverse' }}>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedTeams.length === 0}
          onClick={() => onSelectTeams(selectedTeams)}
        >
          {getActionButtonCopy()}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}
