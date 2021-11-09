import { useState } from 'react'

import { Button } from '@material-ui/core'
import { useField } from 'react-final-form'

import { NotifyOfficeConfirmation } from '../../../../Create/components/NotifyOfficeConfirmation'

interface Props {
  deal: IDeal
  isSubmitting: boolean
  valid: boolean
  onSubmit: () => void
}

export function SubmitButton({ deal, isSubmitting, valid, onSubmit }: Props) {
  const field = useField('auto_notify')

  const [isNotifyOfficeDialogOpen, setIsNotifyOfficeDialogOpen] =
    useState(false)

  const onClick = () => {
    setIsNotifyOfficeDialogOpen(true)
  }

  const onConfirmNotifyOffice = () => {
    field.input.onChange(true)
    submit()
  }

  const onCancelNotifyOffice = () => {
    field.input.onChange(false)
    submit()
  }

  const submit = () => {
    setIsNotifyOfficeDialogOpen(false)
    onSubmit()
  }

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={onClick}
        disabled={isSubmitting || !valid}
      >
        {isSubmitting ? 'Please Wait...' : 'Next: View in Docusign'}
      </Button>

      <NotifyOfficeConfirmation
        title="Should we ask office to review once it’s signed?"
        deal={deal}
        isOpen={isNotifyOfficeDialogOpen}
        onCancel={onCancelNotifyOffice}
        onConfirm={onConfirmNotifyOffice}
      />
    </>
  )
}
