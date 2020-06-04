import React, { ComponentProps, HTMLProps, useState } from 'react'
import { Field, FieldRenderProps } from 'react-final-form'
import { OnFocus } from 'react-final-form-listeners'
import { TextFieldProps } from '@material-ui/core/TextField'

import EmailRecipientsChipsInput from 'components/EmailRecipientsChipsInput'
import { EmailRecipientQuickSuggestions } from 'components/EmailRecipientQuickSuggestions'

import { EmailFormValues } from '../../types'
import { From } from '../../components/From'
import { CcBccButtons } from '../../components/CcBccButtons'

interface Props {
  values: EmailFormValues
  disableAddNewRecipient?: boolean
  includeQuickSuggestions?: boolean
  deal?: IDeal
  senderAccounts?: IOAuthAccount[]
  EmailRecipientsChipsInputProps?: Partial<
    ComponentProps<typeof EmailRecipientsChipsInput>
  >
}

export function EmailRecipientsFields({
  values,
  disableAddNewRecipient = false,
  includeQuickSuggestions = true,
  senderAccounts,
  deal,
  EmailRecipientsChipsInputProps = {}
}: Props) {
  const [hasCc, setCc] = useState(false)
  const [hasBcc, setBcc] = useState(false)
  const [lastFocusedSendType, setLastFocusedSendType] = useState<
    IEmailRecipientSendType
  >('To')

  const isCcShown = hasCc || (values.cc || []).length > 0
  const isBccShown = hasBcc || (values.bcc || []).length > 0

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
      <Field
        name="from"
        render={({ input }) => (
          <From user={input.value as IUser} accounts={senderAccounts}>
            <CcBccButtons
              showCc={!isCcShown}
              showBcc={!isBccShown}
              onCcAdded={() => setCc(true)}
              onBccAdded={() => setBcc(true)}
            />
          </From>
        )}
      />
      <Field
        label="To"
        name="to"
        render={toFieldProps => (
          <EmailRecipientsChipsInput
            {...toFieldProps}
            readOnly={disableAddNewRecipient}
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
      {includeQuickSuggestions && (
        <Field
          name="bcc"
          render={bccFieldProps => (
            <Field
              name="cc"
              render={ccFieldProps => (
                <Field
                  label="To"
                  name="to"
                  render={toFieldProps => {
                    return (
                      <>
                        <OnFocus name="to">
                          {() => setLastFocusedSendType('To')}
                        </OnFocus>
                        <OnFocus name="cc">
                          {() => {
                            console.log('cc focused')
                            setLastFocusedSendType('CC')
                          }}
                        </OnFocus>
                        <OnFocus name="bcc">
                          {() => setLastFocusedSendType('BCC')}
                        </OnFocus>
                        <EmailRecipientQuickSuggestions
                          deal={deal}
                          currentRecipients={[
                            ...(toFieldProps.input.value || []),
                            ...(ccFieldProps.input.value || []),
                            ...(bccFieldProps.input.value || [])
                          ]}
                          onSelect={(
                            recipient,
                            sendType: IEmailRecipientSendType = lastFocusedSendType
                          ) => {
                            const fieldProps: FieldRenderProps<any> = {
                              To: toFieldProps,
                              CC: ccFieldProps,
                              BCC: bccFieldProps
                            }[sendType]

                            fieldProps.input.onChange([
                              ...(fieldProps.input.value || []),
                              recipient
                            ] as any)
                          }}
                        />
                      </>
                    )
                  }}
                />
              )}
            />
          )}
        />
      )}
    </>
  )
}
