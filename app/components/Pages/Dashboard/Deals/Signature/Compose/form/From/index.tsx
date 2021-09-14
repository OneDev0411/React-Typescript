import { useMemo } from 'react'

import {
  Box,
  Typography,
  MenuList,
  MenuItem,
  Theme,
  Avatar
} from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import uniqBy from 'lodash/uniqBy'
import { useField } from 'react-final-form'
import { useSelector } from 'react-redux'

import { getAccountAvatar } from 'components/Avatar/helpers/get-avatar'
import { BaseDropdown } from 'components/BaseDropdown'
import {
  InputContainer,
  InputLabel,
  InputRequired
} from 'components/Forms/styled'
import { getContactNameInitials } from 'models/contacts/helpers'
import { IAppState } from 'reducers'
import { selectDealRoles } from 'reducers/deals/roles'
import { selectUser } from 'selectors/user'

interface Props {
  deal: IDeal
}

export function From({ deal }: Props) {
  const field = useField('owner')
  const theme = useTheme<Theme>()
  const dealRoles = useSelector<IAppState, IDealRole[]>(({ deals }) =>
    selectDealRoles(deals.roles, deal)
  )
  const user = useSelector(selectUser)

  const users = useMemo(() => {
    return uniqBy(
      [
        user,
        ...dealRoles.filter(role => role?.user?.docusign).map(role => role.user)
      ],
      user => user.docusign?.id
    )
  }, [user, dealRoles])

  const getButtonLabel = (user: IUser) => {
    if (!user.docusign) {
      return `${user.display_name} <${user.email}>`
    }

    // eslint-disable-next-line max-len
    return `${user.docusign.first_name} ${user.docusign.last_name} <${user.docusign.email}>`
  }

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
        buttonLabel={getButtonLabel(field.input.value)}
        renderMenu={({ close }) => {
          return (
            <MenuList>
              {users.map((user, index) => (
                <MenuItem
                  key={index}
                  selected={user.id === field.input.value.id}
                  onClick={() => {
                    close()
                    field.input.onChange(user)
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={getAccountAvatar(user)}
                      style={{
                        width: theme.spacing(5),
                        height: theme.spacing(5),
                        marginRight: theme.spacing(1)
                      }}
                    >
                      {getContactNameInitials(user)}
                    </Avatar>

                    <div>
                      <Typography variant="body1">
                        {user.docusign ? (
                          <>
                            {user.docusign.first_name} {user.docusign.last_name}
                          </>
                        ) : (
                          user.email
                        )}
                      </Typography>

                      <Typography variant="body2">
                        {user.docusign?.email ?? user.email}
                      </Typography>
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
