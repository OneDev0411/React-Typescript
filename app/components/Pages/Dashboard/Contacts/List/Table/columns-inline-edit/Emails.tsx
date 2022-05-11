import { makeStyles, Theme } from '@material-ui/core'
import { mdiEmailOutline } from '@mdi/js'

import { normalizeContactsForEmailCompose } from '@app/models/email/helpers/normalize-contact'
import { isEmail } from '@app/utils/validations'
import SendEmailButton from '@app/views/components/SendEmailButton'
import { SvgIcon, muiIconSizes } from '@app/views/components/SvgIcons'

import { InlineEditAttributeCell } from './AttributeCell'

interface Props {
  contact: IContactWithAssoc<'contact.attributes'>
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    emailButton: {
      cursor: 'pointer',
      color: theme.palette.action.disabled
    }
  }),
  {
    name: 'EmailInlineEdit'
  }
)

export function EmailsInlineEdit({ contact }: Props) {
  const classes = useStyles()

  return (
    <InlineEditAttributeCell
      attributeName="email"
      addLabel="Add Another Email"
      contact={contact}
      validateRules={{
        text: (value: string) => isEmail(value),
        label: () => undefined
      }}
      actions={
        <SendEmailButton
          recipients={normalizeContactsForEmailCompose([
            contact as unknown as IContact
          ])}
          render={({ onClick, testId }) => (
            <div
              onClick={onClick}
              data-test={testId}
              className={classes.emailButton}
            >
              <SvgIcon path={mdiEmailOutline} size={muiIconSizes.small} />
            </div>
          )}
        />
      }
    />
  )
}
