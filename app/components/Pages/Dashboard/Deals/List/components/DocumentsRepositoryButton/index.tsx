import { useState } from 'react'

import { Button } from '@material-ui/core'

import { DocumentsRepositoryDialog } from '@app/views/components/DocumentsRepository/Dialog'

export function DocumentsRepositoryButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="outlined" onClick={() => setIsOpen(true)}>
        Download Forms
      </Button>

      <DocumentsRepositoryDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
