import React, { useMemo, ReactNode } from 'react'
import { useField } from 'react-final-form'
import {
  Box,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core'

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

export function From({ accounts, children, users }: Props) {
  const fromField = useField('from')
  const error = fromField.meta.error

  const items = useMemo(() => {
    let items: IUser[] | IOAuthAccount[] = []

    if (accounts) {
      items = [...accounts]
    }

    return [...items, ...users]
  }, [users, accounts])

  const renderItemToString = (item: IUser | IOAuthAccount) => {
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
          renderValue={renderItemToString}
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
