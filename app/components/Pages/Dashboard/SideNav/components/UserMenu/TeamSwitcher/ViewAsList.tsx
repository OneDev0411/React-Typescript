import React, { useState, useMemo } from 'react'
import isEqual from 'lodash/isEqual'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, List, ListSubheader, makeStyles } from '@material-ui/core'

import { selectUser } from 'selectors/user'

import {
  viewAs,
  isBackOffice,
  getTeamAvailableMembers
} from '../../../../../../../utils/user-teams'

import { setViewAsFilter } from '../../../../../../../store_actions/user/set-view-as-filter'

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
  disabled: boolean
  team: IUserTeam
}

export function ViewAsList({ disabled, team }: Props) {
  const classes = useStyle()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const brandMembers = getTeamAvailableMembers(team)
  const allMembersId = brandMembers.map(m => m.id)
  const initialSelectedMembers = useMemo(() => viewAs(user, team), [user, team])
  const [selectedMembers, setSelectedMembers] = useState(initialSelectedMembers)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isBackOffice(user) || brandMembers.length === 1) {
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

  const onApply = async () => {
    if (isEqual(selectedMembers, initialSelectedMembers)) {
      return
    }

    setIsSubmitting(true)

    await dispatch(setViewAsFilter(user, selectedMembers))

    window.location.reload(true)
  }

  return (
    <List classes={{ root: classes.list }}>
      <ListSubheader>View as</ListSubheader>
      {brandMembers.length > 1 && (
        <ViewAsMember
          title="Everyone on team"
          disabled={isSubmitting || disabled}
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
            disabled={isSubmitting || disabled}
            checked={selectedMembers.includes(memberId)}
            onChange={() => onChangeMember(memberId)}
          />
        )
      })}
      <Box px={2} py={1}>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          fullWidth
          onClick={onApply}
          disabled={isSubmitting || disabled}
        >
          Apply
        </Button>
      </Box>
    </List>
  )
}
