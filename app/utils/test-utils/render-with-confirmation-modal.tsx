import React from 'react'

import { render } from '@testing-library/react'

import ConfirmationModal from 'components/ConfirmationModal'
import ConfirmationModalProvider from 'components/ConfirmationModal/context/Provider'

function renderWithConfirmationModal(component) {
  return render(
    <ConfirmationModalProvider>
      {component}
      <ConfirmationModal />
    </ConfirmationModalProvider>
  )
}

export default renderWithConfirmationModal
