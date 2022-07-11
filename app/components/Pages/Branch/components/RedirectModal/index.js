import { Modal, ModalContent } from 'components/Modal'

const RedirectModal = ({ children }) => {
  return (
    <div>
      <Modal isOpen autoHeight className="c-confirm-modal">
        <ModalContent>{children}</ModalContent>
      </Modal>
    </div>
  )
}

export default RedirectModal
