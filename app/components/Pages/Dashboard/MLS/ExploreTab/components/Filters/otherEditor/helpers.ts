import { isEqual } from 'lodash'

import { ZipcodeOption } from './zipcodeGroup'

export function createYearArray({
  start = new Date().getFullYear(),
  end = 1990,
  min,
  max
}: {
  start?: number
  end?: number
  length?: number
  min?: Nullable<number>
  max?: Nullable<number>
}) {
  if (min && max) {
    throw new Error('You cant have both min and max')
  }

  const rawArray = [
    null,
    ...Array.from({ length: (end - start) / -1 + 1 }, (_, i) => start + i * -1)
  ]

  if (min) {
    return rawArray.filter(item => item === null || item > min)
  }

  if (max) {
    return rawArray.filter(item => item === null || item < max)
  }

  return rawArray
}

export function filterGroupChangesCount<T>(
  object: T,
  base: Partial<T>,
  groups: Partial<Record<keyof T, string>>
): number {
  let count = 0
  let activeGroups: Record<string, boolean> = {}

  Object.keys(object).forEach(key => {
    if (
      typeof base[key as keyof T] !== 'undefined' &&
      !isEqual(object[key as keyof T], base[key as keyof T]) &&
      groups[key as keyof T] &&
      !activeGroups[groups[key]]
    ) {
      activeGroups[groups[key]] = true
      count++
    }
  })

  return count
}

export const preventNonNumbricOnKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  const key = e.key

  if (
    !(e.metaKey || e.ctrlKey) &&
    key.length === 1 &&
    Number.isNaN(parseInt(key, 10)) &&
    e.key !== 'Backspace'
  ) {
    e.preventDefault()
  }
}

export const mapPostcodesToOptions = (
  postcodes: OptionalNullable<string[]>
): ZipcodeOption[] => {
  if (!postcodes) {
    return []
  }

  return postcodes.reduce((acc: ZipcodeOption[], postcode) => {
    if (!postcode || postcode.trim() === '') {
      return acc
    }

    return [
      ...acc,
      {
        id: postcode,
        title: postcode
      }
    ]
  }, [])
}
