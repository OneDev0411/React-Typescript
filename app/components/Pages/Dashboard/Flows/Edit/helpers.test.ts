// @ts-ignore
import flowData from 'fixtures/flows/flow' // eslint-disable-line

import {
  humanizeSeconds,
  formatTimeDigits,
  timeToSeconds,
  getUpdatedStepsOnMove,
  ONE_DAY_IN_SECONDS
} from './helpers'
import { convertStepToStepInput } from '../helpers'

const flow: IBrandFlow = flowData

describe('Flows edit helpers', () => {
  it('humanizeSeconds', () => {
    expect(humanizeSeconds(86400)).toEqual({
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0
    })
    expect(humanizeSeconds(86401)).toEqual({
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 1
    })
    expect(humanizeSeconds(86399)).toEqual({
      days: 0,
      hours: 23,
      minutes: 59,
      seconds: 59
    })
    expect(humanizeSeconds(172801)).toEqual({
      days: 2,
      hours: 0,
      minutes: 0,
      seconds: 1
    })
    expect(humanizeSeconds(3661)).toEqual({
      days: 0,
      hours: 1,
      minutes: 1,
      seconds: 1
    })
  })

  it('formatTimeDigits', () => {
    expect(formatTimeDigits(0)).toEqual('00')
    expect(formatTimeDigits(1)).toEqual('01')
    expect(formatTimeDigits(9)).toEqual('09')
    expect(formatTimeDigits(10)).toEqual('10')
    expect(formatTimeDigits(1000)).toEqual('1000')
  })

  it('timeToSeconds', () => {
    expect(timeToSeconds('00:00')).toEqual(0)
    expect(timeToSeconds('8:10')).toEqual(29400)
    expect(timeToSeconds('23:0')).toEqual(82800)
  })

  it('getUpdatedStepsOnMove', () => {
    const steps = flow.steps!

    expect(getUpdatedStepsOnMove(steps, 0, 0)).toEqual([])
    expect(getUpdatedStepsOnMove(steps, 1, 1)).toEqual([])
    expect(getUpdatedStepsOnMove(steps, 2, 2)).toEqual([])

    expect(getUpdatedStepsOnMove(steps, 0, 1)).toEqual([
      [
        steps[1].id,
        {
          ...convertStepToStepInput(steps[1]),
          due_in: steps[1].due_in - ONE_DAY_IN_SECONDS * 1
        }
      ],
      [
        steps[0].id,
        {
          ...convertStepToStepInput(steps[0]),
          due_in: steps[0].due_in + ONE_DAY_IN_SECONDS * 2
        }
      ]
    ])
    expect(getUpdatedStepsOnMove(steps, 0, 2)).toEqual([
      [
        steps[1].id,
        {
          ...convertStepToStepInput(steps[1]),
          due_in: steps[1].due_in - ONE_DAY_IN_SECONDS * 1
        }
      ],
      [
        steps[2].id,
        {
          ...convertStepToStepInput(steps[2]),
          due_in: steps[2].due_in - ONE_DAY_IN_SECONDS * 1
        }
      ],
      [
        steps[0].id,
        {
          ...convertStepToStepInput(steps[0]),
          due_in: steps[0].due_in + ONE_DAY_IN_SECONDS * 3
        }
      ]
    ])
    expect(getUpdatedStepsOnMove(steps, 1, 0)).toEqual([
      [
        steps[0].id,
        {
          ...convertStepToStepInput(steps[0]),
          due_in: steps[0].due_in + ONE_DAY_IN_SECONDS * 2
        }
      ],
      [
        steps[1].id,
        {
          ...convertStepToStepInput(steps[1]),
          due_in: steps[1].due_in - ONE_DAY_IN_SECONDS * 1
        }
      ]
    ])
    expect(getUpdatedStepsOnMove(steps, 1, 2)).toEqual([
      [
        steps[2].id,
        {
          ...convertStepToStepInput(steps[2]),
          due_in: steps[2].due_in - ONE_DAY_IN_SECONDS * 2
        }
      ],
      [
        steps[1].id,
        {
          ...convertStepToStepInput(steps[1]),
          due_in: steps[1].due_in + ONE_DAY_IN_SECONDS * 1
        }
      ]
    ])
    expect(getUpdatedStepsOnMove(steps, 2, 0)).toEqual([
      [
        steps[0].id,
        {
          ...convertStepToStepInput(steps[0]),
          due_in: steps[0].due_in + ONE_DAY_IN_SECONDS * 1
        }
      ],
      [
        steps[1].id,
        {
          ...convertStepToStepInput(steps[1]),
          due_in: steps[1].due_in + ONE_DAY_IN_SECONDS * 1
        }
      ],
      [
        steps[2].id,
        {
          ...convertStepToStepInput(steps[2]),
          due_in: steps[2].due_in - ONE_DAY_IN_SECONDS * 3
        }
      ]
    ])
    expect(getUpdatedStepsOnMove(steps, 2, 1)).toEqual([
      [
        steps[1].id,
        {
          ...convertStepToStepInput(steps[1]),
          due_in: steps[1].due_in + ONE_DAY_IN_SECONDS * 1
        }
      ],
      [
        steps[2].id,
        {
          ...convertStepToStepInput(steps[2]),
          due_in: steps[2].due_in - ONE_DAY_IN_SECONDS * 2
        }
      ]
    ])
  })
})
