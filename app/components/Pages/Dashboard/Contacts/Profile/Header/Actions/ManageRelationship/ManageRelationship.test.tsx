import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { frequencyOptions, frequencyToString } from './helper'

import { ManageRelationship } from './index'

jest.mock('@app/models/contacts/update-contact-touch-reminder', () => ({
  updateContactTouchReminder: () => Promise.resolve()
}))

jest.mock('@app/hooks/use-notify')

describe('ManageRelationship', () => {
  let contactId: UUID
  let contactTouchFreq: Nullable<number>
  const onUpdateTouchFreq = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()

    contactId = 'some_id_for_test'
    contactTouchFreq = null
  })

  describe('ManageRelationship button text', () => {
    it('should render button default text when touch_freq is null', async () => {
      render(
        <ManageRelationship
          contactId={contactId}
          contactTouchFreq={contactTouchFreq}
          onUpdateTouchFreq={onUpdateTouchFreq}
        />
      )

      const expectedText = frequencyToString(contactTouchFreq)

      await waitFor(() => {
        expect(screen.getByText(expectedText)).toBeInTheDocument()
      })
    })
    it('should render monthly when touch_freq is 30', async () => {
      contactTouchFreq = 30
      render(
        <ManageRelationship
          contactId={contactId}
          contactTouchFreq={contactTouchFreq}
          onUpdateTouchFreq={onUpdateTouchFreq}
        />
      )

      const expectedText = frequencyToString(contactTouchFreq)

      await waitFor(() => {
        expect(screen.getByText(expectedText)).toBeInTheDocument()
      })
    })
    it('should render exact day when touch_freq is 91', async () => {
      contactTouchFreq = 91
      render(
        <ManageRelationship
          contactId={contactId}
          contactTouchFreq={contactTouchFreq}
          onUpdateTouchFreq={onUpdateTouchFreq}
        />
      )

      const expectedText = frequencyToString(contactTouchFreq)

      await waitFor(() => {
        expect(screen.getByText(expectedText)).toBeInTheDocument()
      })
    })
  })

  describe('ManageRelationship menu', () => {
    it('should open the menu when user clicks the button', async () => {
      render(
        <ManageRelationship
          contactId={contactId}
          contactTouchFreq={contactTouchFreq}
          onUpdateTouchFreq={onUpdateTouchFreq}
        />
      )

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()

        Object.values(frequencyOptions).forEach(option => {
          expect(screen.getByText(option)).toBeInTheDocument()
        })

        expect(screen.getByText('Custom...')).toBeInTheDocument()
      })
    })
    it('should change the touch frequency when user clicks on weekly item', async () => {
      render(
        <ManageRelationship
          contactId={contactId}
          contactTouchFreq={contactTouchFreq}
          onUpdateTouchFreq={onUpdateTouchFreq}
        />
      )

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Weekly'))

      await waitFor(() => {
        expect(onUpdateTouchFreq).toBeCalledTimes(1)
        expect(onUpdateTouchFreq).toBeCalledWith(7)
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
    it('should change the touch frequency when user enter custom value', async () => {
      render(
        <ManageRelationship
          contactId={contactId}
          contactTouchFreq={contactTouchFreq}
          onUpdateTouchFreq={onUpdateTouchFreq}
        />
      )

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Custom...'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        expect(
          screen.getByLabelText('Remind to touch every')
        ).toBeInTheDocument()
      })

      fireEvent.input(screen.getByLabelText('Remind to touch every'), {
        target: { value: '121' }
      })
      fireEvent.click(screen.getByTitle('Change frequency'))

      await waitFor(() => {
        expect(onUpdateTouchFreq).toBeCalledTimes(1)
        expect(onUpdateTouchFreq).toBeCalledWith(121)

        expect(screen.queryByTitle('Change frequency')).not.toBeInTheDocument()
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
    it('should reset the touch frequency when user enter 0 custom value', async () => {
      render(
        <ManageRelationship
          contactId={contactId}
          contactTouchFreq={contactTouchFreq}
          onUpdateTouchFreq={onUpdateTouchFreq}
        />
      )

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Custom...'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        expect(
          screen.getByLabelText('Remind to touch every')
        ).toBeInTheDocument()
      })

      fireEvent.input(screen.getByLabelText('Remind to touch every'), {
        target: { value: '0' }
      })
      fireEvent.click(screen.getByTitle('Change frequency'))

      await waitFor(() => {
        expect(onUpdateTouchFreq).toBeCalledTimes(1)
        expect(onUpdateTouchFreq).toBeCalledWith(null)

        expect(screen.queryByTitle('Change frequency')).not.toBeInTheDocument()
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
    it('should reset the touch frequency when user enter empty custom value', async () => {
      render(
        <ManageRelationship
          contactId={contactId}
          contactTouchFreq={contactTouchFreq}
          onUpdateTouchFreq={onUpdateTouchFreq}
        />
      )

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Custom...'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        expect(
          screen.getByLabelText('Remind to touch every')
        ).toBeInTheDocument()
      })

      fireEvent.input(screen.getByLabelText('Remind to touch every'), {
        target: { value: '' }
      })
      fireEvent.click(screen.getByTitle('Change frequency'))

      await waitFor(() => {
        expect(onUpdateTouchFreq).toBeCalledTimes(1)
        expect(onUpdateTouchFreq).toBeCalledWith(null)

        expect(screen.queryByTitle('Change frequency')).not.toBeInTheDocument()
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
  })
})

describe('frequencyToString helper', () => {
  it('should return default value when frequency is null', () => {
    expect(frequencyToString(null, 'default')).toBe('default')
  })

  it('should return preset default value when frequency is null', () => {
    expect(frequencyToString(null)).toBe('Manage Relationship')
  })

  it('should return "Weekly" when frequency is 7', () => {
    expect(frequencyToString(7)).toBe('Weekly')
  })

  it('should return "Monthly" when frequency is 30', () => {
    expect(frequencyToString(30)).toBe('Monthly')
  })

  it('should return "Bimonthly" when frequency is 60', () => {
    expect(frequencyToString(60)).toBe('Bimonthly')
  })

  it('should return "Quarterly" when frequency is 90', () => {
    expect(frequencyToString(90)).toBe('Quarterly')
  })

  it('should return "Quarterly" when frequency is 180', () => {
    expect(frequencyToString(180)).toBe('Semiannually')
  })

  it('should return "Annually" when frequency is 365', () => {
    expect(frequencyToString(365)).toBe('Annually')
  })

  it('should return exact days when frequency is 121', () => {
    expect(frequencyToString(121)).toBe('Every 121 Days')
  })

  it('should return exact day (singular) when frequency is 1', () => {
    expect(frequencyToString(1)).toBe('Every 1 Day')
  })
})
