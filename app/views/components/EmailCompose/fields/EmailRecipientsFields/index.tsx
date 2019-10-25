import React, { ComponentProps, HTMLProps, useState } from 'react'

import { Field } from 'react-final-form'

import { TextFieldProps } from '@material-ui/core/TextField'

import { EmailFormValues } from '../../types'

import { From } from '../From'
import { CcBccButtons } from '../../components/CcBccButtons'

import EmailRecipientsChipsInput from '../../../EmailRecipientsChipsInput'

interface Props {
  values: EmailFormValues
  disableAddNewRecipient?: boolean
  includeQuickSuggestions?: boolean
  deal?: IDeal
  fromOptions?: EmailFormValues['from'][]
  EmailRecipientsChipsInputProps?: Partial<
    ComponentProps<typeof EmailRecipientsChipsInput>
  >
}

export function EmailRecipientsFields({
  values,
  disableAddNewRecipient = false,
  includeQuickSuggestions = true,
  fromOptions,
  deal,
  EmailRecipientsChipsInputProps = {}
}: Props) {
  const [hasCc, setCc] = useState(false)
  const [hasBcc, setBcc] = useState(false)

  const isCcShown = hasCc || (values.cc || []).length > 0
  const isBccShown = hasBcc || (values.bcc || []).length > 0

  const commonProps: typeof EmailRecipientsChipsInputProps = {
    deal,
    ...EmailRecipientsChipsInputProps
  }

  return (
    <>
      <Field component={From} name="from" options={fromOptions}>
        <CcBccButtons
          showCc={!isCcShown}
          showBcc={!isBccShown}
          onCcAdded={() => setCc(true)}
          onBccAdded={() => setBcc(true)}
        />
      </Field>

      <Field
        name="bcc"
        render={bccFieldProps => (
          <Field
            label="To"
            name="to"
            render={toFieldProps => (
              <EmailRecipientsChipsInput
                {...toFieldProps}
                deal={deal}
                includeQuickSuggestions={includeQuickSuggestions}
                readOnly={disableAddNewRecipient}
                currentlyUsedQuickSuggestions={[
                  ...(toFieldProps.input.value || []),
                  ...(bccFieldProps.input.value || [])
                ]}
                // we need to do this weird stuff because of the weird UX
                // which is to show suggestions under `To` field but for some
                // of them we want to add them to bcc!
                // So The logic for handling quick suggestion selection
                // cannot be handled in the EmailRecipientsChipsInput itself
                // and the event needs to bubble up to be handled at upper levels
                // in this case.
                // Hopefully we revise it and remove such weirdness
                onQuickSuggestionSelected={(
                  recipient,
                  sendType: IEmailRecipientSendType
                ) => {
                  const fieldProps =
                    sendType === 'BCC' ? bccFieldProps : toFieldProps

                  fieldProps.input.onChange([
                    ...(fieldProps.input.value || []),
                    recipient
                  ] as any)
                }}
                TextFieldProps={
                  {
                    inputProps: {
                      autoFocus: true
                    } as HTMLProps<HTMLInputElement>
                  } as TextFieldProps
                }
                {...commonProps}
              />
            )}
          />
        )}
      />
      {isCcShown && (
        <Field
          label="Cc"
          name="cc"
          component={EmailRecipientsChipsInput as any}
          {...commonProps}
        />
      )}
      {isBccShown && (
        <Field
          label="Bcc"
          name="bcc"
          component={EmailRecipientsChipsInput as any}
          {...commonProps}
        />
      )}
    </>
  )
}
