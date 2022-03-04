import { useState, useMemo, ReactNode, CSSProperties, MouseEvent } from 'react'

import { Avatar, Popover, makeStyles, Tooltip, Theme } from '@material-ui/core'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import { useSelector } from 'react-redux'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { getContactNameInitials } from 'models/contacts/helpers'
import { selectUser } from 'selectors/user'
import { isBackOffice } from 'utils/acl'
import { viewAs, getTeamAvailableMembers } from 'utils/user-teams'

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

interface Props {
  containerStyle?: CSSProperties
}

export const ViewAs = ({ containerStyle }: Props) => {
  const classes = useStyles()
  const user: IUser = useSelector(selectUser)
  const activeTeam: Nullable<IUserTeam> = useUnsafeActiveTeam()

  const {
    initialSelectedMembers,
    teamMembers
  }: { initialSelectedMembers: UUID[]; teamMembers: IUser[] } = useMemo(
    () => ({
      initialSelectedMembers: viewAs(activeTeam, true),
      teamMembers: getTeamAvailableMembers(activeTeam)
    }),
    [activeTeam]
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

  const handleClick = (event: MouseEvent<HTMLElement>) => {
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

  if (isBackOffice(activeTeam) || teamMembers.length === 1) {
    return null
  }

  const renderAvatarGroup = () => {
    const base = (
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
    )

    if (containerStyle) {
      return <div style={containerStyle}>{base}</div>
    }

    return base
  }

  return (
    <>
      {renderAvatarGroup()}
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
