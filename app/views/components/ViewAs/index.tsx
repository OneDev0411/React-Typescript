import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Avatar } from '@material-ui/core'
import AvatarGroup from '@material-ui/lab/AvatarGroup'

import {
  viewAs,
  isBackOffice,
  getActiveTeam,
  getTeamAvailableMembers
} from '../../../utils/user-teams'
import { IAppState } from '../../../reducers'

import { MemberList } from './components/List'
// const useStyles = makeStyles((theme: Theme) => ({}), { name: 'ViewAs' })

interface Props {}

export const ViewAs = (props: Props) => {
  const user: IUser = useSelector((store: IAppState) => store.user)
  const team: IUserTeam | null = getActiveTeam(user)
  const teamMembers: IUser[] = getTeamAvailableMembers(team)
  const initialSelectedMembers: UUID[] = useMemo(() => viewAs(user, team), [
    user,
    team
  ])
  const [selectedMembers, setSelectedMembers] = useState<UUID[]>(
    initialSelectedMembers
  )

  if (isBackOffice(user) || teamMembers.length === 1) {
    return null
  }

  return (
    <>
      <AvatarGroup max={3}>
        <Avatar
          alt="Remy Sharp"
          src="https://material-ui.com/static/images/avatar/1.jpg"
        />
        <Avatar
          alt="Travis Howard"
          src="https://material-ui.com/static/images/avatar/2.jpg"
        />
        <Avatar
          alt="Cindy Baker"
          src="https://material-ui.com/static/images/avatar/3.jpg"
        />
        <Avatar
          alt="Agnes Walker"
          src="https://material-ui.com/static/images/avatar/4.jpg"
        />
        <Avatar
          alt="Trevor Henderson"
          src="https://material-ui.com/static/images/avatar/5.jpg"
        />
      </AvatarGroup>
      <MemberList
        user={user}
        teamMembers={teamMembers}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        initialSelectedMembers={initialSelectedMembers}
      />
    </>
  )
}
