import React, { useState } from 'react'

import {
  Box,
  Button,
  Tooltip,
  List,
  ListSubheader,
  makeStyles,
  Theme
} from '@material-ui/core'
import isEqual from 'lodash/isEqual'
import { useDispatch } from 'react-redux'

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
  const membersIds: string[] = teamMembers.map(member => member.id)
  const [isAllSelected, setIsAllSelected] = useState<boolean>(
    selectedMembers.length === membersIds.length
  )
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSelectMember = (id: UUID) => {
    if (selectedMembers.includes(id)) {
      setIsAllSelected(false)
      onChangeSelectedMembers(selectedMembers.filter(member => member !== id))

      return
    }

    if (selectedMembers.length + 1 === teamMembers.length) {
      setIsAllSelected(true)
    }

    onChangeSelectedMembers([...selectedMembers, id])
  }

  const handleSelectAllMembers = () => {
    if (isAllSelected) {
      if (selectedMembers.length >= 1) {
        onChangeSelectedMembers(membersIds)
      }

      if (selectedMembers.length === membersIds.length) {
        onChangeSelectedMembers([])
        setIsAllSelected(false)
      }

      return
    }

    setIsAllSelected(true)
    onChangeSelectedMembers(membersIds)
  }

  const handleApplyChanges = async () => {
    if (
      isEqual(selectedMembers, initialSelectedMembers) ||
      selectedMembers.length === 0
    ) {
      return
    }

    const payload = isAllSelected ? null : selectedMembers

    setIsSubmitting(true)
    await dispatch(setViewAsFilter(payload))

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
          checked={isAllSelected}
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
            checked={isAllSelected || selectedMembers.includes(memberId)}
            onChange={() => handleSelectMember(memberId)}
          />
        )
      })}
      <Box px={2} py={1}>
        <Tooltip
          title={
            selectedMembers.length === 0
              ? 'Is not possible to deselect all team member'
              : ''
          }
        >
          <div>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleApplyChanges}
              disabled={
                isSubmitting || disabled || selectedMembers.length === 0
              }
            >
              Apply
            </Button>
          </div>
        </Tooltip>
      </Box>
    </List>
  )
}
