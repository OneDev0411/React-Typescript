import React from 'react'
import { render } from '@testing-library/react'

import ConfirmationModalProvider from 'components/ConfirmationModal/context/Provider'
import ConfirmationModal from 'components/ConfirmationModal'

function renderWithConfirmationModal(component) {
  return render(
    <ConfirmationModalProvider>
      {component}
      <ConfirmationModal />
    </ConfirmationModalProvider>
  )
}

export default renderWithConfirmationModal
