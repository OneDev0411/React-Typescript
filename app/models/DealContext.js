import moment from 'moment'
import _ from 'underscore'

import store from '../stores'
import Deal from './Deal'

/**
 * returns list of all contexts
 */
export function getList() {
  const state = store.getState()
  const { deals } = state

  return deals && deals.contexts
}

/**
 * search context by name
 */
export function searchContext(name) {
  if (!name) {
    return false
  }

  const context = _.find(getList(), { name })

  if (!context) {
    console.warn(`Could not find context: ${context}`)

    return null
  }

  return {
    ...context,
    validate: getValidationFunction(context.name),
    properties: getFieldProperties(context.name),
    getFormattedValue: getFormattedValue.bind(context)
  }
}

/**
 * returns list of all checklists
 */
export function getChecklists() {
  const state = store.getState()
  const { deals } = state

  return deals && deals.checklists
}

/**
 * returns deal type flag
 */
export function getDealTypeFlag(deal_type) {
  if (deal_type === 'Selling') {
    return 1
  } else if (deal_type === 'Buying') {
    return 2
  }

  return null
}

/**
 * returns property type flag
 */
export function getPropertyTypeFlag(property_type) {
  switch (property_type) {
    case 'Resale':
      return 128
    case 'New Home':
      return 256
    case 'Lot / Land':
      return 512
    case 'Commercial Sale':
      return 1024
    case 'Residential Lease':
      return 2048
    case 'Commercial Lease':
      return 4096
    default:
      return null
  }
}

/**
 * return list of section
 */
export function getFactsheetSection(deal, name) {
  const criteria = ctx => ctx.section === name
  const hasActiveOffer = getHasActiveOffer(deal)

  if (hasActiveOffer === null) {
    return []
  }

  return query(deal, criteria).filter(ctx =>
    filterByFlags(
      ctx,
      deal.deal_type,
      deal.property_type,
      hasActiveOffer,
      'show_on_fact_sheet'
    )
  )
}

/**
 * return context items
 */
export function getItems(deal_type, property_type, hasActiveOffer = false) {
  const requiredFields = getRequiredItems(
    deal_type,
    property_type,
    hasActiveOffer
  )
  const optionalFields = getOptionalItems(
    deal_type,
    property_type,
    hasActiveOffer
  )

  const sortTable = _.pluck(getList(), 'name')

  return _.sortBy([].concat(requiredFields, optionalFields), field =>
    sortTable.indexOf(field.name)
  )
}

/**
 * return required context
 */
export function getRequiredItems(
  deal_type,
  property_type,
  hasActiveOffer = false
) {
  return getList()
    .filter(ctx =>
      filterByFlags(ctx, deal_type, property_type, hasActiveOffer, 'required')
    )
    .map(ctx => ({
      ...ctx,
      validate: getValidationFunction(ctx.name),
      properties: getFieldProperties(ctx.name),
      getFormattedValue: getFormattedValue.bind(ctx),
      mandatory: true
    }))
}

/**
 * return optional context
 */
export function getOptionalItems(
  deal_type,
  property_type,
  hasActiveOffer = false
) {
  return getList()
    .filter(ctx =>
      filterByFlags(ctx, deal_type, property_type, hasActiveOffer, 'optional')
    )
    .map(ctx => ({
      ...ctx,
      validate: getValidationFunction(ctx.name),
      properties: getFieldProperties(ctx.name),
      getFormattedValue: getFormattedValue.bind(ctx),
      mandatory: false
    }))
}

/**
 * return list of filtered contexts based on given criteria
 */
export function query(deal, criteria) {
  const contexts = getList()

  return _.chain(contexts)
    .filter(ctx => criteria(ctx))
    .map(ctx => ({
      ...ctx,
      validate: getValidationFunction(ctx.name),
      properties: getFieldProperties(ctx.name),
      getFormattedValue: getFormattedValue.bind(ctx),
      needs_approval: ctx.needs_approval || false
    }))
    .value()
}

/**
 * check deal has active offer
 */
export function getHasActiveOffer(deal) {
  return deal.has_active_offer
}

/**
 * return list of filtered contexts based on given criteria
 */
export function filterByFlags(
  context,
  deal_type,
  property_type,
  hasActiveOffer,
  filterBy
) {
  const flag = context[filterBy]
  const dealTypeFlag = getDealTypeFlag(deal_type)
  const propertyTypeFlag = getPropertyTypeFlag(property_type)
  const isSellingDeal = deal_type === 'Selling'

  if ((flag & dealTypeFlag) !== dealTypeFlag) {
    return false
  }

  if ((flag & propertyTypeFlag) !== propertyTypeFlag) {
    return false
  }

  if (isSellingDeal && !hasActiveOffer && (flag & 131072) === 131072) {
    return false
  }

  return true
}

/**
 * returns check context is currency
 */
export function isCurrency(field) {
  return ['list_price', 'sales_price'].indexOf(field.name) > -1
}

/**
 * returns value of context
 */
export function getValue(deal, field) {
  if (!field) {
    return null
  }

  if (field.data_type === 'Date') {
    return getDateValue(deal, field)
  }

  if (field.name === 'property_type') {
    return {
      value: deal.property_type
    }
  }

  // get field
  const defaultContext =
    isAddressField(field.name) && deal.listing ? deal.mls_context : null

  const contextValue = Deal.get.field(deal, field.name, defaultContext)

  const dataObject = {
    value: contextValue,
    rawValue: contextValue
  }

  if (isCurrency(field)) {
    dataObject.value = Deal.get.formattedPrice(contextValue)
  }

  return dataObject
}

/**
 * returns value of a origin
 * name is field name
 * origin is context origin (mls or deal)
 */
export function getValueByContext(name, context) {
  const contextInfo = getList().find(ctx => ctx.name === name)

  if (contextInfo.data_type === 'Date') {
    return moment.unix(context.value).format('MMM DD, YYYY')
  } else if (isCurrency({ name })) {
    return Deal.get.formattedPrice(context.value)
  }

  return context.value
}

/**
 * returns date value of context
 */
export function getDateValue(deal, field) {
  const date = Deal.get.field(deal, field.name)

  return {
    value: date ? parseDate(date).format(getDateFormatString()) : ''
  }
}

export function parseDate(date) {
  return moment.unix(date).utc()
}

export function getDateFormatString() {
  return 'MMM DD, YYYY'
}

/**
 * get validation function based on given field
 */
function getValidationFunction(name) {
  return (
    {
      year_built: validateYearBuilt
    }[name] || validate
  )
}

/**
 * validate a context
 */
export function validate(ctx, value) {
  const isNumericField = ['Number', 'Numeric'].includes(ctx.data_type)

  if (
    isNumericField === false &&
    (value === undefined || value === null || value.length === 0)
  ) {
    return !ctx.mandatory
  }

  switch (ctx.data_type) {
    case 'Number':
    case 'Numeric':
      return _.isUndefined(value) ||
        (typeof value === 'string' && value.length === 0)
        ? !ctx.mandatory
        : !Number.isNaN(parseFloat(value)) && /^\d*\.?\d*$/.test(value)

    case 'String':
    case 'Text':
      return value.length > 0

    case 'Date':
      return validateDate(value)
  }
}

function validateYearBuilt(ctx, value) {
  const { max } = ctx.properties

  if (value === undefined || value === null) {
    return !ctx.mandatory
  }

  return parseFloat(value) <= max
}

export function getFieldProperties(name) {
  return (
    {
      year_built: {
        max: 9999,
        placeholder: 'YYYY',
        mask: [/[1-2]/, /\d/, /\d/, /\d/]
      }
    }[name] || {}
  )
}

/**
 * validate a date context
 */
export function validateDate(value) {
  if (typeof value === 'object' && value instanceof Date) {
    return true
  }

  const date = moment(value)

  return date && date.isValid()
}

/**
 * validate given contexts
 */
export function validateList(list, deal_type, property_type, hasActiveOffer) {
  const dealContexts = getItems(deal_type, property_type, hasActiveOffer)

  return _.every(dealContexts, ctx => ctx.validate(ctx, list[ctx.name]))
}

/**
 * get valid contexts
 */
export function getValidItems(
  list,
  deal_type,
  property_type,
  hasActiveOffer = false
) {
  const dealContexts = _.indexBy(
    getItems(deal_type, property_type, hasActiveOffer),
    'name'
  )

  return _.pick(list, (value, name) => validate(dealContexts[name], value))
}

export function isAddressField(name) {
  return [
    'street_dir_prefix',
    'street_suffix',
    'street_number',
    'street_name',
    'unit_number',
    'city',
    'county',
    'state',
    'state_code',
    'postal_code',
    'full_address',
    'street_address'
  ].includes(name)
}

function getFormattedValue(value) {
  if (!value) {
    return value
  }

  if (this.format === 'Currency') {
    return Deal.get.formattedPrice(parseFloat(value), 'currency', 0)
  }

  return value
}

export default {
  getList,
  searchContext,
  getChecklists,
  getDealTypeFlag,
  getPropertyTypeFlag,
  getFactsheetSection,
  getItems,
  getRequiredItems,
  getOptionalItems,
  query,
  getHasActiveOffer,
  filterByFlags,
  isCurrency,
  getValue,
  getValueByContext,
  getDateValue,
  parseDate,
  getDateFormatString,
  validate,
  validateDate,
  validateList,
  getValidItems,
  isAddressField
}
