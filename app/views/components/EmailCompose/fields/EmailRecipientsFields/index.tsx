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
        render={bccInputProps => (
          <Field
            label="To"
            name="to"
            component={EmailRecipientsChipsInput as any}
            readOnly={disableAddNewRecipient}
            deal={deal}
            // See issue description here for the logic behind adding
            // `!deal &&` part: https://gitlab.com/rechat/web/issues/3467
            includeQuickSuggestions={!deal && includeQuickSuggestions}
            // we need to do this weird stuff because of the weird UX
            // which is to show suggestions under too but add them to bcc!
            // Hopefully we revise it and remove such weirdness
            currentlyUsedQuickSuggestions={bccInputProps.input.value}
            onQuickSuggestionSelected={recipient =>
              bccInputProps.input.onChange([
                ...(bccInputProps.input.value || []),
                recipient
              ] as any)
            }
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
