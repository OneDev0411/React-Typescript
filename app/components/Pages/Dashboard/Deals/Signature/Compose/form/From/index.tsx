import React, { useMemo } from 'react'

import {
  Box,
  Avatar,
  Typography,
  MenuList,
  MenuItem,
  Theme
} from '@material-ui/core'
import { useField } from 'react-final-form'

import { useSelector } from 'react-redux'

import { useTheme } from '@material-ui/styles'

import { IAppState } from 'reducers'

import { BaseDropdown } from 'components/BaseDropdown'
import {
  InputContainer,
  InputLabel,
  InputRequired
} from 'components/Forms/styled'
import { getTeamAvailableMembers, getActiveTeam } from 'utils/user-teams'
import { selectDealRoles } from 'reducers/deals/roles'

interface Props {
  deal: IDeal
}

export function From({ deal }: Props) {
  const field = useField('owner')
  const theme = useTheme<Theme>()
  const { user, roles } = useSelector<
    IAppState,
    {
      user: IUser
      roles: IDealRole[]
    }
  >(({ user, deals }) => {
    return {
      user,
      roles: selectDealRoles(deals.roles, deal)
    }
  })

  const members = useMemo(() => {
    return getTeamAvailableMembers(getActiveTeam(user)).filter(
      member =>
        member.id === user.id ||
        (member.user_type === 'Agent' &&
          member.has_docusign &&
          roles.some(role => role?.user?.id === member.id))
    )
  }, [user, roles])

  return (
    <>
      <InputContainer
        style={{
          paddingBottom: 0
        }}
      >
        <InputLabel hasError={field.meta.submitFailed && field.meta.error}>
          From:
          <InputRequired>*</InputRequired>
        </InputLabel>
      </InputContainer>

      <BaseDropdown
        buttonLabel={`${field.input.value.display_name} <${field.input.value.email}>`}
        renderMenu={({ close }) => {
          return (
            <MenuList>
              {members.map((member, index) => (
                <MenuItem
                  key={index}
                  selected={member.id === field.input.value.id}
                  onClick={() => {
                    close()
                    field.input.onChange(member)
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      alt={member.display_name}
                      src={member.profile_image_url ?? undefined}
                      style={{
                        width: theme.spacing(5),
                        height: theme.spacing(5),
                        marginRight: theme.spacing(1)
                      }}
                    />

                    <div>
                      <Typography variant="body1">
                        {member.display_name}
                      </Typography>

                      <Typography variant="body2">{member.email}</Typography>
                    </div>
                  </Box>
                </MenuItem>
              ))}
            </MenuList>
          )
        }}
      />
    </>
  )
}
