import React, { useState } from 'react'
import Flex from 'styled-flex-component'
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
    root: {
      paddingRight: theme.spacing(2),
      marginBottom: theme.spacing(1)
    },
    button: {
      padding: 0,
      margin: 0
    }
  })
)

export function ApproveButton({ deal, context, isBackOffice, onClick }: Props) {
  const { root, button } = useStyles()
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
    <Flex justifyEnd className={root}>
      <Button
        variant="text"
        color="secondary"
        size="small"
        className={button}
        disabled={isSaving}
        onClick={handleSave}
      >
        Approve
      </Button>
    </Flex>
  )
}
