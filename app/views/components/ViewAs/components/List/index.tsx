import React, { useState } from 'react'
import isEqual from 'lodash/isEqual'
import { useDispatch } from 'react-redux'
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
  setSelectedMembers(members: UUID[]): void
}

export const MemberList = ({
  user,
  teamMembers,
  selectedMembers,
  disabled = false,
  setSelectedMembers,
  initialSelectedMembers
}: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const membersId: Array<string> = teamMembers.map(member => member.id)
  const [isSubmitting, setSubmitting] = useState<boolean>(false)

  const onChange = (id: UUID) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(member => member !== id))

      return
    }

    setSelectedMembers([...selectedMembers, id])
  }

  const handleSelectAllMembers = () => {
    if (selectedMembers.length === membersId.length) {
      setSelectedMembers([])

      return
    }

    setSelectedMembers(membersId)
  }

  const onApply = async () => {
    if (isEqual(selectedMembers, initialSelectedMembers)) {
      return
    }

    setSubmitting(true)

    await dispatch(setViewAsFilter(user, selectedMembers))

    window.location.reload(true)
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
            key={index}
            title={title}
            disabled={isSubmitting || disabled}
            checked={selectedMembers.includes(memberId)}
            onChange={() => onChange(memberId)}
          />
        )
      })}
      <Box px={2} py={1}>
        <Button
          size="small"
          variant="outlined"
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
