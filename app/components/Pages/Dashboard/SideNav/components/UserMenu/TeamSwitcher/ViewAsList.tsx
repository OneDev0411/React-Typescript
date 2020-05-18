import React, { useState, useMemo } from 'react'
import isEqual from 'lodash/isEqual'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, List, ListSubheader, makeStyles } from '@material-ui/core'

import {
  viewAs,
  isBackOffice,
  getTeamAvailableMembers
} from '../../../../../../../utils/user-teams'

import { setViewAsFilter } from '../../../../../../../store_actions/user/set-view-as-filter'
import { IAppState } from '../../../../../../../reducers'

import { ViewAsMember } from './ViewAsMember'

const useStyle = makeStyles(
  theme => ({
    list: {
      backgroundColor: theme.palette.grey['50']
    }
  }),
  { name: 'ViewAsList' }
)

interface Props {
  team: IUserTeam
}

export function ViewAsList({ team }: Props) {
  const classes = useStyle()
  const dispatch = useDispatch()
  const user = useSelector((store: IAppState) => store.user)
  const brandMembers = getTeamAvailableMembers(team)
  const allMembersId = brandMembers.map(m => m.id)
  const initialSelectedMembers = useMemo(() => viewAs(user) || [], [user])
  const [selectedMembers, setSelectedMembers] = useState(initialSelectedMembers)

  if (isBackOffice(user)) {
    return null
  }

  const onChangeMember = (id: UUID) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(member => member !== id))

      return
    }

    setSelectedMembers([...selectedMembers, id])
  }

  const onChangeSelectAllMembers = () => {
    if (selectedMembers.length === allMembersId.length) {
      setSelectedMembers([])

      return
    }

    setSelectedMembers(allMembersId)
  }

  const onApply = () => {
    if (isEqual(selectedMembers, initialSelectedMembers)) {
      return
    }

    dispatch(setViewAsFilter(user, selectedMembers))
  }

  return (
    <List classes={{ root: classes.list }}>
      <ListSubheader>View as</ListSubheader>
      {brandMembers.length > 1 && (
        <ViewAsMember
          title="Everyone on team"
          onChange={() => onChangeSelectAllMembers()}
          checked={selectedMembers.length === brandMembers.length}
        />
      )}
      {brandMembers.map((member, index) => {
        const memberId = member.id
        const title = `${member.first_name} ${member.last_name}${
          memberId === user.id ? ' (you)' : ''
        }`

        return (
          <ViewAsMember
            key={index}
            title={title}
            checked={selectedMembers.includes(memberId)}
            onChange={() => onChangeMember(memberId)}
          />
        )
      })}
      <Box px={2} pb={1}>
        <Button size="small" variant="outlined" fullWidth onClick={onApply}>
          Apply
        </Button>
      </Box>
    </List>
  )
}
