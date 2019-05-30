import * as React from 'react'
import { useMemo } from 'react'

import EditOutlineIcon from 'components/SvgIcons/EditOutline/EditOutlineIcon'
import EditRolesIcon from 'components/SvgIcons/EditRoles/EditRolesIcon'
import DeleteOutlineIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import Tooltip from 'components/tooltip'
import PageHeader from 'components/PageHeader'

import { ITeam, ITeamRole } from 'models/BrandConsole/types'

import { Container, IconButton } from './styled'
import { TeamMember } from './components/TeamMember'
import { getTeamUsers } from '../helpers/get-team-users'

interface Props {
  team: ITeam
  updateRoles: (team: ITeam, userId: string, roles: ITeamRole[]) => void
  updatingUserIds: string[]
  onEdit: (event: React.MouseEvent) => void
  onDelete: (event: React.MouseEvent) => void
}

export const TeamView = React.memo(
  ({ team, updateRoles, updatingUserIds, onEdit, onDelete }: Props) => {
    const teamUsers = useMemo(() => getTeamUsers(team), [team])

    return (
      <Container>
        <PageHeader isFlat>
          <PageHeader.Title showBackButton={false}>
            <PageHeader.Heading>{team.name}</PageHeader.Heading>
          </PageHeader.Title>

          <PageHeader.Menu>
            <Tooltip placement="bottom" caption="Edit Roles">
              <IconButton>
                <EditRolesIcon style={{ padding: '.1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip placement="bottom" caption="Edit Team">
              <IconButton onClick={onEdit}>
                <EditOutlineIcon style={{ padding: '.1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip placement="bottom" caption="Delete Team">
              <IconButton onClick={onDelete}>
                <DeleteOutlineIcon style={{ padding: '.1rem' }} />
              </IconButton>
            </Tooltip>
          </PageHeader.Menu>
        </PageHeader>

        <div>
          {teamUsers.map(teamUser => (
            <TeamMember
              key={teamUser.user.id}
              user={teamUser.user}
              userRoles={teamUser.roles || []}
              allRoles={team.roles || []}
              isSaving={updatingUserIds.includes(teamUser.user.id)}
              onRolesChanged={newRoles =>
                updateRoles(team, teamUser.user.id, newRoles)
              }
            />
          ))}
        </div>
      </Container>
    )
  }
)
