import React, { useState } from 'react'
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'

import { isContextApproved } from '../../helpers/is-context-approved'

import { ContextField } from '../../types'

interface Props {
  deal: IDeal
  field: ContextField
  isBackOffice: boolean
  onClick(): void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      padding: 0,
      margin: 0
    }
  })
)

export function ApproveButton(props: Props) {
  const classes = useStyles()
  const [isSaving, setIsSaving] = useState<boolean>(false)

  if (!props.isBackOffice || isContextApproved(props.deal, props.field)) {
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)

    await props.onClick()

    setIsSaving(false)
  }

  return (
    <Button
      color="secondary"
      size="small"
      className={classes.button}
      disabled={isSaving}
      onClick={handleSave}
    >
      Approve
    </Button>
  )
}
