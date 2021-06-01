import React, { useState } from 'react'
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'

import { isContextApproved } from '../../helpers/is-context-approved'

interface Props {
  deal: IDeal
  context: IDealBrandContext
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

export function ApproveButton({ deal, context, isBackOffice, onClick }: Props) {
  const classes = useStyles()
  const [isSaving, setIsSaving] = useState<boolean>(false)

  if (!isBackOffice || isContextApproved(deal, context)) {
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)

    await onClick()

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
