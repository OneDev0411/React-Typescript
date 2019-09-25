import React, { ComponentProps, HTMLProps, useState } from 'react'

import { Field } from 'react-final-form'

import { InputProps } from '@material-ui/core/Input'

import { TextFieldProps } from '@material-ui/core/TextField'

import { EmailFormValues } from '../../types'

import { From } from '../From'
import { CcBccButtons } from '../../components/CcBccButtons'

import EmailRecipientsChipsInput from '../../../EmailRecipientsChipsInput'

interface Props {
  values: EmailFormValues
  disableAddNewRecipient?: boolean
  includeQuickSuggestions?: boolean
  EmailRecipientsChipsInputProps?: Partial<
    ComponentProps<typeof EmailRecipientsChipsInput>
  >
}

export function EmailRecipientsFields({
  values,
  disableAddNewRecipient = false,
  includeQuickSuggestions = true,
  EmailRecipientsChipsInputProps = {}
}: Props) {
  const [hasCc, setCc] = useState(false)
  const [hasBcc, setBcc] = useState(false)

  const isCcShown = hasCc || (values.cc || []).length > 0
  const isBccShown = hasBcc || (values.bcc || []).length > 0

  return (
    <>
      <Field
        component={From}
        name="from"
        InputProps={
          {
            endAdornment: disableAddNewRecipient ? null : (
              <CcBccButtons
                showCc={!isCcShown}
                showBcc={!isBccShown}
                onCcAdded={() => setCc(true)}
                onBccAdded={() => setBcc(true)}
              />
            )
          } as InputProps
        }
      />

      <Field
        name="bcc"
        render={bccInputProps => (
          <Field
            label="To"
            name="to"
            component={EmailRecipientsChipsInput as any}
            readOnly={disableAddNewRecipient}
            includeQuickSuggestions={includeQuickSuggestions}
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
            {...EmailRecipientsChipsInputProps}
          />
        )}
      />
      {isCcShown && (
        <Field
          label="Cc"
          name="cc"
          component={EmailRecipientsChipsInput as any}
          {...EmailRecipientsChipsInputProps}
        />
      )}
      {isBccShown && (
        <Field
          label="Bcc"
          name="bcc"
          component={EmailRecipientsChipsInput as any}
          {...EmailRecipientsChipsInputProps}
        />
      )}
    </>
  )
}
