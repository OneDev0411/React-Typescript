import { useState } from 'react'

import { Button } from '@material-ui/core'

import { PreviewActionButton } from '@app/views/components/DocumentsRepository/components/row-actions/PreviewActionButton'
import { DocumentsRepositoryDialog } from '@app/views/components/DocumentsRepository/Dialog'

export function DocumentsRepositoryButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="outlined" size="large" onClick={() => setIsOpen(true)}>
        Download Forms
      </Button>

      <DocumentsRepositoryDialog
        isOpen={isOpen}
        RowActionsBuilder={({ form }) => <PreviewActionButton form={form} />}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
