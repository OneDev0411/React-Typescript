import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from '@testing-library/react'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import renderWithConfirmationModal from 'utils/test-utils/render-with-confirmation-modal'

// Creating a test component with a button to open the modal.
function TestComponent(props) {
  const modal = React.useContext(ConfirmationModalContext)
  const [isPopUpOpen, setOpen] = React.useState(false)
  const overrideOptions = props.overrideOptions || {}

  function handleTestClick() {
    if (!isPopUpOpen) {
      modal.setConfirmationModal({
        message: 'Heads up!',
        description: 'You are missing something important. Are you sure?',
        onConfirm: () => {
          setOpen(!isPopUpOpen)
        },
        ...overrideOptions
      })
    } else {
      setOpen(!isPopUpOpen)
    }
  }
  return (
    <button data-test="test-button" onClick={handleTestClick}>
      Open Modal
    </button>
  )
}

afterEach(cleanup)

describe('ConfirmationModal should works', function() {
  it('should render modal properly', async function() {
    const { container, getByTestId } = renderWithConfirmationModal(
      <TestComponent />
    )
    const btn = getByTestId('test-button')
    fireEvent.click(btn)
    expect(container).toMatchSnapshot()
  })

  it('should render anything by default', async function() {
    const { queryByTestId } = renderWithConfirmationModal(<TestComponent />)

    const cancelBtn = queryByTestId('confirmation-modal-cancel-button')
    const confirmBtn = queryByTestId('confirmation-modal-confirm-button')
    const title = queryByTestId('confirmation-modal-title')
    expect(cancelBtn).toBeNull()
    expect(confirmBtn).toBeNull()
    expect(title).toBeNull()
  })

  it('should use confirm options by consumer', async function() {
    const options = {
      confirmLabel: 'Boom!',
      onConfirm: jest.fn()
    }
    const { getByTestId } = renderWithConfirmationModal(
      <TestComponent overrideOptions={options} />
    )
    const btn = getByTestId('test-button')
    fireEvent.click(btn)

    const confirmBtn = getByTestId('confirmation-modal-confirm-button')
    fireEvent.click(confirmBtn)

    // Checking text of confirm button
    expect(confirmBtn.textContent).toBe('Boom!')
    // Checking it's called
    expect(options.onConfirm).toBeCalledTimes(1)
  })

  it('should use cancel options by consumer', async function() {
    const options = {
      cancelLabel: 'This should be cancled!',
      onCancel: jest.fn()
    }
    const { getByTestId, queryByTestId } = renderWithConfirmationModal(
      <TestComponent overrideOptions={options} />
    )
    const btn = getByTestId('test-button')
    fireEvent.click(btn)

    const cancelBtn = getByTestId('confirmation-modal-cancel-button')
    fireEvent.click(cancelBtn)

    const title = queryByTestId('confirmation-modal-title')

    // Checking text of cancel button
    expect(cancelBtn.textContent).toBe('This should be cancled!')
    // Checking it's called
    expect(options.onCancel).toBeCalledTimes(1)

    // it should be closed after pressing cancel
    expect(title).toBeNull()
  })
})
