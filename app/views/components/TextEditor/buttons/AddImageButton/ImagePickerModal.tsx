import * as React from 'react'

import Flex from 'styled-flex-component'

import { Modal, ModalHeader } from 'components/Modal'
import UploaderModal from 'components/ImageUploader/UploaderModal'

interface Props {
  title?: string
  isOpen: boolean
  onClose: () => void
  onFileSelected: (file: File) => void
  accept?: string
  minSize?: number
  maxSize?: number
  showRules?: boolean
}

/**
 * A component to be used for picking images to be used. in the editor.
 * It can support other sources like a file
 */
export function ImagePickerModal({
  title = 'Add an image',
  accept = 'image/*',
  minSize = 0,
  maxSize = Infinity,
  showRules = false,
  isOpen,
  onClose,
  onFileSelected
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          width: '56.25rem',
          maxWidth: '95%',
          maxHeight: '95%'
        }
      }}
    >
      <ModalHeader title={title} closeHandler={onClose} />
      <Flex style={{ height: 'calc(100% - 4.625rem)' }}>
        <UploaderModal
          accept={accept}
          onDrop={onFileSelected}
          minSize={minSize}
          maxSize={maxSize}
          notes=""
          showRules={showRules}
        />
      </Flex>
    </Modal>
  )
}
