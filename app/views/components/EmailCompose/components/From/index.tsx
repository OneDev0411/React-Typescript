import React, { useMemo, ReactNode } from 'react'

import {
  Box,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core'
import { useField } from 'react-final-form'

import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from 'constants/oauth-accounts'

import { Item } from './Item'

interface Props {
  users: IUser[]
  accounts?: IOAuthAccount[]
  children?: ReactNode
}

/**
 * NOTE: The API for sending email is somehow not intuitive.
 * `from` should always exist in form of UUID of a user.n the form data too.
 */

export function From({ accounts, children, users }: Props) {
  const fromField = useField('from')
  const error = fromField.meta.error

  const items = useMemo(
    () => [...(accounts || []), ...users],
    [users, accounts]
  )

  const renderItemToValue = (item: IUser | IOAuthAccount) => {
    switch (item.type) {
      case 'user':
        return userToEmailAddress(item)
      case GOOGLE_CREDENTIAL:
      case MICROSOFT_CREDENTIAL:
        return accountToString(item)
      default:
        return <Typography color="error">Unknown Address</Typography>
    }
  }

  const handleChange = (event: React.ChangeEvent<{ value: UUID }>) => {
    const id = event.target.value
    const item = items.find(item => item.id === id)

    if (!item) {
      return false
    }

    fromField.input.onChange(item)
  }

  return (
    <Box display="flex" alignItems="center" my={1}>
      <FormLabel style={{ marginBottom: 0 }}>From</FormLabel>
      <Box flex="1" px={2}>
        <Select
          required
          error={error}
          disableUnderline
          value={fromField.input.value}
          onChange={handleChange}
          renderValue={renderItemToValue}
        >
          {items.map(item => (
            <MenuItem key={item.id} value={item.id}>
              <Item item={item} />
            </MenuItem>
          ))}
        </Select>
        {error && (
          <FormHelperText error style={{ marginTop: 0 }}>
            {error}
          </FormHelperText>
        )}
      </Box>
      {children}
    </Box>
  )
}

function userToEmailAddress(user: IUser) {
  return user.display_name ? `${user.display_name} <${user.email}>` : user.email
}

function accountToString(account: IOAuthAccount): string {
  return `${account.display_name} <${account.email}>`
}
