import React, { ComponentProps, HTMLProps, useState, useEffect } from 'react'
import { TextFieldProps } from '@material-ui/core'

import EmailRecipientsChipsInput from 'components/EmailRecipientsChipsInput'
import { EmailRecipientQuickSuggestions } from 'components/EmailRecipientQuickSuggestions'
import IndividualModeRecipientLabel from 'components/EmailCompose/components/IndividualModeRecipientLabel'

import { EmailFormValues } from '../../types'
import { From } from '../../components/From'
import { CcBccButtons } from '../../components/CcBccButtons'

import { useRecipientFields } from './use-recipient-fields'

interface Props {
  values: EmailFormValues
  disableAddNewRecipient?: boolean
  includeQuickSuggestions?: boolean
  individualMode?: boolean
  deal?: IDeal
  senderAccounts?: IOAuthAccount[]
  EmailRecipientsChipsInputProps?: Partial<
    ComponentProps<typeof EmailRecipientsChipsInput>
  >
  onToFieldChange?: (to: IDenormalizedEmailRecipientInput[] | undefined) => void
  users: IUser[]
}

export function EmailRecipientsFields({
  values,
  disableAddNewRecipient = false,
  includeQuickSuggestions = true,
  individualMode = false,
  deal,
  senderAccounts,
  EmailRecipientsChipsInputProps = {},
  onToFieldChange,
  users
}: Props) {
  const fields = useRecipientFields()
  const [ccVisibility, setCcVisibility] = useState(false)
  const [bccVisibility, setBccVisibility] = useState(false)
  const [
    lastFocusedSendType,
    setLastFocusedSendType
  ] = useState<IEmailRecipientSendType>('To')

  const isCcShown = ccVisibility || (values.cc || []).length > 0
  const isBccShown = bccVisibility || (values.bcc || []).length > 0

  useEffect(() => {
    if (individualMode) {
      setCcVisibility(false)
      setBccVisibility(false)
    }
  }, [individualMode])

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
        {!individualMode && (
          <CcBccButtons
            showCc={!isCcShown}
            showBcc={!isBccShown}
            onCcAdded={() => setCcVisibility(true)}
            onBccAdded={() => setBccVisibility(true)}
          />
        )}
      </From>
      <EmailRecipientsChipsInput
        label={individualMode ? <IndividualModeRecipientLabel /> : 'To'}
        {...fields.to}
        readOnly={disableAddNewRecipient}
        {...commonProps}
        onChange={onToFieldChange}
        onFocus={() => setLastFocusedSendType('To')}
      />
      {isCcShown && !individualMode && (
        <EmailRecipientsChipsInput
          label="Cc"
          {...fields.cc}
          {...commonProps}
          onFocus={() => setLastFocusedSendType('CC')}
        />
      )}
      {isBccShown && !individualMode && (
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
              const field = individualMode
                ? fields.to
                : fields[sendType.toLowerCase()]

              field.input.onChange([...(field.input.value || []), recipient])
            }}
          />
        </>
      )}
    </>
  )
}
