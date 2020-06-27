import React, { useMemo } from 'react'
import { Box, Button, IconButton, Tooltip } from '@material-ui/core'
import {
  mdiAccountEditOutline,
  mdiAccountPlusOutline,
  mdiPencil,
  mdiTrashCanOutline
} from '@mdi/js'

import PageHeader from 'components/PageHeader'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { TeamMember } from '../TeamMember'
import { getTeamUsersWithRoles } from '../../helpers/get-team-users-with-roles'
import { TeamMemberTitle } from '../TeamMember/styled'

interface Props {
  team: IBrand
  updateRoles: (team: IBrand, userId: string, roles: IBrandRole[]) => void
  updatingUserIds: string[]
  onEdit: (event: React.MouseEvent) => void
  onEditRoles: (event: React.MouseEvent) => void
  onDelete: (event: React.MouseEvent) => void
  onAddMember: (event: React.MouseEvent) => void
}

export const TeamView = React.memo(
  ({
    team,
    updateRoles,
    updatingUserIds,
    onEdit,
    onEditRoles,
    onAddMember,
    onDelete
  }: Props) => {
    const teamUsers = useMemo(() => getTeamUsersWithRoles(team), [team])

    return (
      <Box p={3}>
        <PageHeader
          isFlat
          style={{ width: '100%', margin: '0 0 1.5rem', padding: 0 }}
        >
          <PageHeader.Title showBackButton={false}>
            <PageHeader.Heading>{team.name}</PageHeader.Heading>
          </PageHeader.Title>

          <PageHeader.Menu>
            <Tooltip title="Edit Roles">
              <IconButton onClick={onEditRoles}>
                <SvgIcon path={mdiAccountEditOutline} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Team">
              <IconButton onClick={onEdit}>
                <SvgIcon path={mdiPencil} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Team">
              <IconButton onClick={onDelete}>
                <SvgIcon path={mdiTrashCanOutline} />
              </IconButton>
            </Tooltip>
          </PageHeader.Menu>
        </PageHeader>

        <div>
          <Box mb={1} display="flex" justifyContent="flex-end">
            <Button onClick={onAddMember}>
              <SvgIcon path={mdiAccountPlusOutline} rightMargined />
              <TeamMemberTitle>Add New Member</TeamMemberTitle>
            </Button>
          </Box>
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
      </Box>
    )
  }
)
