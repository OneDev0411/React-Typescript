import { RawWaitFor } from '../../../types'
import { defaultWaitForValue } from './Fields'

export const convertToServerInput = ({
  value,
  unit,
  triggerAt
}: RawWaitFor): IBrandFlowStepInput['wait_for'] => {
  return {
    [unit]: triggerAt === 'before' ? value * -1 : value
  }
}

export const convertToWebInput = (
  value: IBrandFlowStepInput['wait_for']
): RawWaitFor => {
  const flattenValue = Object.entries(value)[0]

  if (!flattenValue) {
    return defaultWaitForValue
  }

  const number = flattenValue[1] || 0
  const isNegative = number < 0

  return {
    value: Math.abs(number),
    unit: flattenValue[0] as WaitForField,
    triggerAt: isNegative ? 'before' : 'after'
  }
}
