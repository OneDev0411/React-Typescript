import { Field, FieldRenderProps } from 'react-final-form'
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
  const hasAccounts = accounts && accounts.length > 0

  function getSelectedAccount(id: string) {
    return (accounts || []).find(account => account.id === id)
  }

  const render = ({
    microsoft,
    google
  }: {
    microsoft: FieldRenderProps<any>
    google: FieldRenderProps<any>
  }) => {
    const getValue = () => {
      if (!hasAccounts) {
        return ''
      }

      const isCredentialValid = credential =>
        accounts!.some(a => a.type === credential)

      if (google.input.value && isCredentialValid('google_credential')) {
        return google.input.value
      }

      if (microsoft.input.value && isCredentialValid('microsoft_credential')) {
        return microsoft.input.value
      }
    }

    const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
      const selectedAccount = getSelectedAccount(event.target.value)

      google.input.onChange(
        selectedAccount && selectedAccount.type === 'google_credential'
          ? (selectedAccount.id as any)
          : null
      )
      microsoft.input.onChange(
        selectedAccount && selectedAccount.type === 'microsoft_credential'
          ? (selectedAccount.id as any)
          : null
      )
    }

    const error = google.meta.error || microsoft.meta.error

    const isUsingConnectedAccount = !!(
      microsoft.input.value || google.input.value
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

  return (
    // It would be more simpler with useField if react-final-form was updated
    <Field
      name="google_credential"
      render={googleProps => (
        <Field
          name="microsoft_credential"
          render={microsoftProps =>
            render({
              microsoft: microsoftProps,
              google: googleProps
            })
          }
        />
      )}
    />
  )
}

function userToEmailAddress(user: IUser) {
  return user.display_name ? `${user.display_name} <${user.email}>` : user.email
}

function accountToString(account: IOAuthAccount): string {
  return `${account.display_name} <${account.email}>`
}
