import React, { useState } from 'react'
import isEqual from 'lodash/isEqual'
import { useDispatch } from 'react-redux'
import { addNotification as notify } from 'reapop'
import {
  Box,
  Button,
  List,
  ListSubheader,
  makeStyles,
  Theme
} from '@material-ui/core'

import { setViewAsFilter } from '../../../../../store_actions/user/set-view-as-filter'

import { MemberItem } from '../Item'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      minWidth: 250
    },
    header: {
      lineHeight: `${theme.spacing(5)}px`
    }
  }),
  { name: 'ViewAsList' }
)

interface Props {
  user: IUser
  disabled?: boolean
  teamMembers: IUser[]
  selectedMembers: UUID[]
  initialSelectedMembers: UUID[]
  onChangeSelectedMembers(members: UUID[]): void
}

export const MemberList = ({
  user,
  teamMembers,
  selectedMembers,
  disabled = false,
  onChangeSelectedMembers,
  initialSelectedMembers
}: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const membersId: string[] = teamMembers.map(member => member.id)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSelectMember = (id: UUID) => {
    if (selectedMembers.includes(id)) {
      if (selectedMembers.length === 1) {
        return dispatch(
          notify({
            message: 'you should select at least one team member or all.',
            status: 'warning'
          })
        )
      }

      onChangeSelectedMembers(selectedMembers.filter(member => member !== id))

      return
    }

    onChangeSelectedMembers([...selectedMembers, id])
  }

  const handleSelectAllMembers = () => {
    if (selectedMembers.length === membersId.length) {
      return dispatch(
        notify({
          message:
            'Is not possible to deselect all team member, you should select at least one team member or all.',
          status: 'warning'
        })
      )
    }

    onChangeSelectedMembers(membersId)
  }

  const handleApplyChanges = async () => {
    if (isEqual(selectedMembers, initialSelectedMembers)) {
      return
    }

    setIsSubmitting(true)

    await dispatch(setViewAsFilter(user, selectedMembers))

    window.location.reload()
  }

  return (
    <List className={classes.root}>
      <ListSubheader className={classes.header}>View as</ListSubheader>
      {teamMembers.length > 1 && (
        <MemberItem
          title="Everyone on team"
          disabled={isSubmitting || disabled}
          onChange={handleSelectAllMembers}
          checked={selectedMembers.length === teamMembers.length}
        />
      )}
      {teamMembers.map((member, index) => {
        const memberId = member.id
        const title = `${member.first_name} ${member.last_name}${
          memberId === user.id ? ' (you)' : ''
        }`

        return (
          <MemberItem
            key={memberId}
            title={title}
            disabled={isSubmitting || disabled}
            checked={selectedMembers.includes(memberId)}
            onChange={() => handleSelectMember(memberId)}
          />
        )
      })}
      <Box px={2} py={1}>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleApplyChanges}
          disabled={isSubmitting || disabled}
        >
          Apply
        </Button>
      </Box>
    </List>
  )
}
