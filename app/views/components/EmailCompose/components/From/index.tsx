import { useField } from 'react-final-form'
import * as React from 'react'
import { ReactNode } from 'react'
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

/**
 * NOTE: The API for sending email is somehow not intuitive.
 * `from` should always exist in form of UUID of a user.
 * In addition, either `google_credential` or `microsoft_credential` can
 * optionally be set.
 * - If `google_credential` is set the email is sent from gmail account
 * - If `microsoft_credential` is set the email is sent from outlook account
 * - If neither `google_credential` nor `microsoft_credential` is set, the email
 * is sent from Mailgun
 *
 * This has some faults:
 * `from`, `google_credential` and `microsoft_credential` are basically
 * defining ONE thing, which is the `from` field in the sent email.
 * This not only unnecessarily complicates the API, but also opens the
 * way for illegal states like when `google_credential` and
 * `microsoft_credential` have value, which may lead to unknown result.
 * The argument for using such structure in the API is that the `from`
 * being a user id is a hard-to-change design decision, and there are
 * lots of places which count on this.
 *
 * A better design would be to have `from` field like this:
 * {
 *   type: 'user',
 *   userId: '...'
 * }
 * {
 *   type: 'google_credential',
 *   google_credential_id: '...'
 * }
 * {
 *   type: 'microsoft_credential',
 *   microsoft_credential_id: '...'
 * }
 *
 * One approach is to consider this design in UI and convert it to what API
 * likes when sending email, but there is a problem with this approach:
 * server always requires `from` and this if we take the approach above,
 * when google or microsoft credentials are used, we lose the user which
 * cause problems in editing email.
 * So we stick with the API data structure and keep it in the form data too.
 */
interface Props {
  user: IUser
  accounts?: IOAuthAccount[]
  children?: ReactNode
}

export function From({ accounts, children, user }: Props) {
  const googleField = useField(GOOGLE_CREDENTIAL)
  const outlookField = useField(MICROSOFT_CREDENTIAL)
  const hasAccounts = accounts && accounts.length > 0

  function getSelectedAccount(id: string) {
    return (accounts || []).find(account => account.id === id)
  }

  const getValue = () => {
    if (!hasAccounts) {
      return ''
    }

    const isCredentialValid = credential =>
      accounts && accounts.some(a => a.type === credential)

    if (googleField.input.value && isCredentialValid(GOOGLE_CREDENTIAL)) {
      return googleField.input.value
    }

    if (outlookField.input.value && isCredentialValid(MICROSOFT_CREDENTIAL)) {
      return outlookField.input.value
    }
  }

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    const selectedAccount = getSelectedAccount(event.target.value)

    googleField.input.onChange(
      selectedAccount && selectedAccount.type === GOOGLE_CREDENTIAL
        ? (selectedAccount.id as UUID)
        : null
    )
    outlookField.input.onChange(
      selectedAccount && selectedAccount.type === MICROSOFT_CREDENTIAL
        ? (selectedAccount.id as UUID)
        : null
    )
  }

  const error = googleField.meta.error || outlookField.meta.error

  const isUsingConnectedAccount = !!(
    outlookField.input.value || googleField.input.value
  )

  return (
    <Box display="flex" alignItems="center" my={1}>
      <FormLabel style={{ marginBottom: 0 }}>From</FormLabel>
      <Box flex="1" px={2}>
        {hasAccounts || isUsingConnectedAccount ? (
          /*
             NOTE: we can remove this ternary and always render  a combo-box
             if it's ok product-wise.
             */
          <>
            <Select
              required
              value={getValue()}
              error={error}
              onChange={handleChange}
              displayEmpty
              renderValue={(value: string) => {
                if (!value) {
                  if (accounts && accounts.length > 0) {
                    return '-- select --'
                  }

                  return userToEmailAddress(user)
                }

                const selectedAccount = getSelectedAccount(value)

                if (selectedAccount) {
                  return accountToString(selectedAccount)
                }

                return <Typography color="error">Unknown Address</Typography>
              }}
              disableUnderline
            >
              {!hasAccounts && (
                <MenuItem value="">{userToEmailAddress(user)}</MenuItem>
              )}
              {accounts &&
                accounts.map(account => (
                  <MenuItem key={account.id} value={account.id}>
                    {accountToString(account)}
                  </MenuItem>
                ))}
            </Select>
            {error && (
              <FormHelperText error style={{ marginTop: 0 }}>
                {error}
              </FormHelperText>
            )}
          </>
        ) : (
          // Right now we don't offer options for user
          // but we can easily add it. we need to accept
          // it as a form input instead of `user` prop
          (user && userToEmailAddress(user)) || ' - '
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
