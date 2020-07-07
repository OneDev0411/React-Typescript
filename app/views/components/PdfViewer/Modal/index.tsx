import React from 'react'

import BareModal from 'components/BareModal'
import { ModalHeader } from 'components/ModalHeader'

import { PdfViewer } from '..'
import { Container } from './styled'

interface Props {
  isOpen: boolean
  title: string
  url: string
  menuRenderer?: () => React.ReactNode
  onClose: () => void
}

export function PdfViewerModal({
  isOpen,
  title,
  url,
  onClose,
  menuRenderer
}: Props) {
  return (
    <BareModal
      isOpen={isOpen}
      className="c-preview-pdf-modal u-scrollbar--self"
      contentLabel={title}
      onRequestClose={onClose}
    >
      <ModalHeader
        title={title}
        menuRenderer={menuRenderer}
        onClose={onClose}
      />
      <Container>{isOpen && <PdfViewer url={url} />}</Container>
    </BareModal>
  )
}
