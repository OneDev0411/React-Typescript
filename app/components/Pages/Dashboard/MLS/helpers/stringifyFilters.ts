import pluralize from 'pluralize'

import { shortFormatPrice } from '@app/utils/listing'

interface IStringifyMinMaxFilters {
  filters: Partial<AlertFilters>
  title: string
  minElement: keyof AlertFilters
  maxElement: keyof AlertFilters
  formatter?: (n: number) => string
  pluralizer?: (s: string, n?: number) => string
  anyText?: string
}

export const stringifyFilters = (
  filters: Nullable<Partial<AlertFilters>>
): string => {
  if (!filters || !Object.keys(filters).length) {
    return ''
  }

  const functionsArray = [
    stringifyPropertyTypeFilters,
    stringifyPostalCodesFilters,
    stringifyPriceFilters,
    stringifyBedFilters,
    stringifyBathFilters,
    stringifyAreaFilters
  ]

  const stringifiedFiltersArray = functionsArray.reduce((acc, fn) => {
    const stringifiedItem = fn(filters)

    return stringifiedItem ? [...acc, stringifiedItem.trim()] : acc
  }, [])

  return stringifiedFiltersArray.join(', ')
}

const stringifyMinMaxFiltersGenerator = ({
  filters,
  title,
  minElement,
  maxElement,
  formatter = (n: number) => n.toString(),
  pluralizer = (s: string) => s,
  anyText = `Any ${pluralizer(title, 0)}`
}: IStringifyMinMaxFilters): string => {
  const maxValue = filters[maxElement] as OptionalNullable<number>
  const minValue = filters[minElement] as OptionalNullable<number>
  const hasMaxValue = !!maxValue
  const hasMinValue = !!minValue

  if (!hasMaxValue && !hasMinValue) {
    return anyText
  }

  if (hasMinValue && !hasMaxValue) {
    return `+ ${formatter(minValue!)} ${pluralizer(title, minValue!)}`
  }

  if (hasMaxValue && !hasMinValue) {
    return `- ${formatter(maxValue!)} ${pluralizer(title, maxValue!)}`
  }

  return `${formatter(minValue!)}-${formatter(maxValue!)} ${pluralizer(
    title,
    maxValue!
  )}`
}

const stringifyPropertyTypeFilters = (
  filters: Partial<AlertFilters>
): string => {
  return filters?.property_types?.length
    ? filters?.property_types.join(' - ')
    : ''
}

const stringifyPostalCodesFilters = (
  filters: Partial<AlertFilters>
): string => {
  return filters?.postal_codes?.length
    ? `In ${filters.postal_codes.join(' - ')}`
    : ''
}

const stringifyPriceFilters = (filters: Partial<AlertFilters>): string => {
  return stringifyMinMaxFiltersGenerator({
    filters,
    title: '',
    minElement: 'minimum_price',
    maxElement: 'maximum_price',
    formatter: (n: number) => `$${shortFormatPrice(n)}`,
    anyText: 'Any $'
  })
}

const stringifyBedFilters = (filters: Partial<AlertFilters>): string => {
  return stringifyMinMaxFiltersGenerator({
    filters,
    title: 'Bed',
    maxElement: 'maximum_bedrooms',
    minElement: 'minimum_bedrooms',
    pluralizer: (s, n) => pluralize(s, n)
  })
}

const stringifyBathFilters = (filters: Partial<AlertFilters>): string => {
  return stringifyMinMaxFiltersGenerator({
    filters,
    title: 'Bath',
    maxElement: 'maximum_bathrooms',
    minElement: 'minimum_bathrooms',
    pluralizer: (s, n) => pluralize(s, n)
  })
}

const stringifyAreaFilters = (filters: Partial<AlertFilters>): string => {
  return stringifyMinMaxFiltersGenerator({
    filters,
    title: 'Square meters',
    maxElement: 'maximum_square_meters',
    minElement: 'minimum_square_meters',
    anyText: ''
  })
}
