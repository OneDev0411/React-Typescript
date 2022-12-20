import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { TestBed } from 'tests/unit/TestBed'

import { frequencyOptions } from './constants'
import { frequencyToString } from './helper'

import { ManageRelationship } from './index'

describe('ManageRelationship', () => {
  let value: Nullable<number>
  const onChange = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()

    value = null
  })

  describe('ManageRelationship menu', () => {
    it('should open the menu when user clicks the button', async () => {
      render(
        <TestBed>
          <ManageRelationship value={value} onChange={onChange} />
        </TestBed>
      )

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()

        Object.values(frequencyOptions).forEach(option => {
          expect(screen.getByText(option)).toBeInTheDocument()
        })

        expect(screen.getByText('Custom')).toBeInTheDocument()
      })
    })
    it('should change the touch frequency when user clicks on Every week item', async () => {
      render(
        <TestBed>
          <ManageRelationship value={value} onChange={onChange} />
        </TestBed>
      )

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Every week'))

      await waitFor(() => {
        expect(onChange).toBeCalledTimes(1)
        expect(onChange).toBeCalledWith(7)
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
    it('should change the touch frequency when user enter custom value', async () => {
      render(
        <TestBed>
          <ManageRelationship value={value} onChange={onChange} />
        </TestBed>
      )

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Custom'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        expect(
          screen.getByLabelText('Remind to touch every')
        ).toBeInTheDocument()
      })

      fireEvent.input(screen.getByLabelText('Remind to touch every'), {
        target: { value: '121' }
      })
      fireEvent.click(screen.getByTitle('Save'))

      await waitFor(() => {
        expect(onChange).toBeCalledTimes(1)
        expect(onChange).toBeCalledWith(121)

        expect(screen.queryByTitle('Save')).not.toBeInTheDocument()
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
    it('should reset the touch frequency when user enter 0 custom value', async () => {
      render(
        <TestBed>
          <ManageRelationship value={value} onChange={onChange} />
        </TestBed>
      )

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Custom'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        expect(
          screen.getByLabelText('Remind to touch every')
        ).toBeInTheDocument()
      })

      fireEvent.input(screen.getByLabelText('Remind to touch every'), {
        target: { value: '0' }
      })
      fireEvent.click(screen.getByTitle('Save'))

      await waitFor(() => {
        expect(onChange).toBeCalledTimes(1)
      })
    })
    it('should reset the touch frequency when user enter empty custom value', async () => {
      render(
        <TestBed>
          <ManageRelationship value={value} onChange={onChange} />
        </TestBed>
      )

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Custom'))

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        expect(
          screen.getByLabelText('Remind to touch every')
        ).toBeInTheDocument()
      })

      fireEvent.input(screen.getByLabelText('Remind to touch every'), {
        target: { value: '' }
      })
      fireEvent.click(screen.getByTitle('Save'))

      await waitFor(() => {
        expect(onChange).toBeCalledTimes(1)
      })
    })
  })
})

describe('frequencyToString helper', () => {
  it('should return default value when frequency is null', () => {
    expect(frequencyToString(null, 'default')).toContain('default')
  })

  it('should return preset default value when frequency is null', () => {
    expect(frequencyToString(null)).toContain('Add auto remind')
  })

  it('should return default when frequency is 0', () => {
    expect(frequencyToString(0, 'default')).toContain('default')
  })

  it('should return option when frequency is 7', () => {
    expect(frequencyToString(7)).toContain(frequencyOptions[7])
  })

  it('should return option when frequency is 30', () => {
    expect(frequencyToString(30)).toContain(frequencyOptions[30])
  })

  it('should return option when frequency is 60', () => {
    expect(frequencyToString(60)).toContain(frequencyOptions[60])
  })

  it('should return option when frequency is 90', () => {
    expect(frequencyToString(90)).toContain(frequencyOptions[90])
  })

  it('should return option when frequency is 180', () => {
    expect(frequencyToString(180)).toContain(frequencyOptions[180])
  })

  it('should return option when frequency is 365', () => {
    expect(frequencyToString(365)).toContain(frequencyOptions[365])
  })

  it('should return exact days when frequency is 121', () => {
    expect(frequencyToString(121)).toContain('Every 121 Days')
  })

  it('should return exact day (singular) when frequency is 1', () => {
    expect(frequencyToString(1)).toContain('Every 1 Day')
  })
})
