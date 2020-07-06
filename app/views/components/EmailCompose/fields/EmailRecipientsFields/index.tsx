import React, { ComponentProps, HTMLProps, useState } from 'react'
import { TextFieldProps } from '@material-ui/core/TextField'

import EmailRecipientsChipsInput from 'components/EmailRecipientsChipsInput'
import { EmailRecipientQuickSuggestions } from 'components/EmailRecipientQuickSuggestions'

import { EmailFormValues } from '../../types'
import { From } from '../../components/From'
import { CcBccButtons } from '../../components/CcBccButtons'

import { useRecipientFields } from './use-recipient-fields'

interface Props {
  values: EmailFormValues
  disableAddNewRecipient?: boolean
  includeQuickSuggestions?: boolean
  deal?: IDeal
  senderAccounts?: IOAuthAccount[]
  EmailRecipientsChipsInputProps?: Partial<
    ComponentProps<typeof EmailRecipientsChipsInput>
  >
  users: IUser[]
}

export function EmailRecipientsFields({
  EmailRecipientsChipsInputProps = {},
  deal,
  disableAddNewRecipient = false,
  includeQuickSuggestions = true,
  senderAccounts,
  values,
  users
}: Props) {
  const fields = useRecipientFields()
  const [ccVisibility, setCcVisibility] = useState(false)
  const [bccVisibility, setBccVisibility] = useState(false)
  const [lastFocusedSendType, setLastFocusedSendType] = useState<
    IEmailRecipientSendType
  >('To')

  const isCcShown = ccVisibility || (values.cc || []).length > 0
  const isBccShown = bccVisibility || (values.bcc || []).length > 0

  const commonProps: typeof EmailRecipientsChipsInputProps = {
    TextFieldProps: {
      inputProps: {
        autoFocus: true
      } as HTMLProps<HTMLInputElement>
    } as TextFieldProps,
    ...EmailRecipientsChipsInputProps
  }

  return (
    <>
      <From users={users} accounts={senderAccounts}>
        <CcBccButtons
          showCc={!isCcShown}
          showBcc={!isBccShown}
          onCcAdded={() => setCcVisibility(true)}
          onBccAdded={() => setBccVisibility(true)}
        />
      </From>
      <EmailRecipientsChipsInput
        label="To"
        {...fields.to}
        readOnly={disableAddNewRecipient}
        {...commonProps}
        onFocus={() => setLastFocusedSendType('To')}
      />
      {isCcShown && (
        <EmailRecipientsChipsInput
          label="Cc"
          {...fields.cc}
          {...commonProps}
          onFocus={() => setLastFocusedSendType('CC')}
        />
      )}
      {isBccShown && (
        <EmailRecipientsChipsInput
          label="Bcc"
          {...fields.bcc}
          {...commonProps}
          onFocus={() => setLastFocusedSendType('BCC')}
        />
      )}
      {includeQuickSuggestions && (
        <>
          <EmailRecipientQuickSuggestions
            deal={deal}
            currentRecipients={[
              ...(fields.to.input.value || []),
              ...(fields.cc.input.value || []),
              ...(fields.bcc.input.value || [])
            ]}
            onSelect={(
              recipient,
              sendType: IEmailRecipientSendType = lastFocusedSendType
            ) => {
              const field = fields[sendType.toLowerCase()]

              field.input.onChange([...(field.input.value || []), recipient])
            }}
          />
        </>
      )}
    </>
  )
}
