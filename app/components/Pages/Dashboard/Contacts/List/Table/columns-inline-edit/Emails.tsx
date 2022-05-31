import { useCallback } from 'react'

import { Tooltip, Theme, makeStyles } from '@material-ui/core'
import { mdiEmailOutline } from '@mdi/js'

import { normalizeContactsForEmailCompose } from '@app/models/email/helpers/normalize-contact'
import { isEmail } from '@app/utils/validations'
import SendEmailButton from '@app/views/components/SendEmailButton'
import { SvgIcon, muiIconSizes } from '@app/views/components/SvgIcons'

import { InlineEditAttributeCell } from './AttributeCell'
import { InlineEditColumnsProps as EmailsInlineEditProps } from './type'

const useStyles = makeStyles(
  (theme: Theme) => ({
    emailButton: {
      cursor: 'pointer',
      color: theme.palette.action.disabled,
      '&:hover': {
        color: theme.palette.grey[800]
      }
    }
  }),
  {
    name: 'EmailInlineEdit'
  }
)

export function EmailsInlineEdit({ contact, callback }: EmailsInlineEditProps) {
  const classes = useStyles()
  const updateContact = useCallback(() => {
    callback?.(contact.id)
  }, [callback, contact.id])

  return (
    <InlineEditAttributeCell
      attributeName="email"
      addLabel={
        (contact.emails || []).length >= 1
          ? 'Add Another Email Address'
          : 'Add An Email Address'
      }
      contact={contact}
      callback={updateContact}
      validateRules={{
        text: (value: string) => isEmail(value)
      }}
      actions={attribute => {
        const targetContact = attribute
          ? { ...contact, email: attribute.text }
          : contact

        return (
          <SendEmailButton
            recipients={normalizeContactsForEmailCompose([
              targetContact as unknown as IContact
            ])}
            render={({ onClick, testId }) => (
              <Tooltip title="Send an Email">
                <div
                  onClick={onClick}
                  data-test={testId}
                  className={classes.emailButton}
                >
                  <SvgIcon path={mdiEmailOutline} size={muiIconSizes.small} />
                </div>
              </Tooltip>
            )}
          />
        )
      }}
    />
  )
}
