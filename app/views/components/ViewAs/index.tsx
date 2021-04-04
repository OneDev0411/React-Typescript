import React, { useState, useMemo, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, Popover, makeStyles, Tooltip, Theme } from '@material-ui/core'
import AvatarGroup from '@material-ui/lab/AvatarGroup'

import { selectUser } from 'selectors/user'

import { getContactNameInitials } from 'models/contacts/helpers'

import {
  viewAs,
  isBackOffice,
  getActiveTeam,
  getTeamAvailableMembers
} from '../../../utils/user-teams'

import { MemberList } from './components/List'

const useStyles = makeStyles(
  (theme: Theme) => ({
    avatarContainer: {
      cursor: 'pointer'
    },
    tooltip: {
      '& span': {
        display: 'block'
      }
    }
  }),
  { name: 'ViewAs' }
)

export const ViewAs = props => {
  const classes = useStyles()
  const user: IUser = useSelector(selectUser)
  const team: IUserTeam | null = getActiveTeam(user)
  const teamMembers: IUser[] = getTeamAvailableMembers(team)
  const initialSelectedMembers: UUID[] = useMemo(
    () => viewAs(user, true, team),
    [team, user]
  )
  const [selectedMembers, setSelectedMembers] = useState<UUID[]>(
    initialSelectedMembers
  )
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'viewas-popover' : undefined
  const tooltipTitle = useMemo(() => {
    if (selectedMembers.length === 0) {
      return 'No One is selected'
    }

    const selectedNames: string[] = []

    teamMembers.forEach(member => {
      if (selectedMembers.includes(member.id)) {
        selectedNames.push(member.display_name)
      }
    })

    return (
      <div className={classes.tooltip}>
        <span>View As:</span>
        {selectedNames.map(name => (
          <span key={name}>{name}</span>
        ))}
      </div>
    )
  }, [classes.tooltip, selectedMembers, teamMembers])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const renderSelectedAvatar = (): ReactNode => {
    const selectedTeamMemeber = teamMembers.filter(member =>
      initialSelectedMembers.includes(member.id)
    )

    return selectedTeamMemeber.map(member => {
      const src = member.profile_image_url || undefined

      return (
        <Avatar key={member.id} alt={member.display_name} src={src}>
          {getContactNameInitials(member)}
        </Avatar>
      )
    })
  }

  if (isBackOffice(user) || teamMembers.length === 1) {
    return null
  }

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <AvatarGroup
          max={4}
          className={classes.avatarContainer}
          onClick={handleClick}
        >
          {renderSelectedAvatar()}
          {initialSelectedMembers.length < 4 && <Avatar>+</Avatar>}
        </AvatarGroup>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <MemberList
          user={user}
          teamMembers={teamMembers}
          selectedMembers={selectedMembers}
          onChangeSelectedMembers={setSelectedMembers}
          initialSelectedMembers={initialSelectedMembers}
        />
      </Popover>
    </>
  )
}
