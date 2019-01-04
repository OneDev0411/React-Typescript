import moment from 'moment'
import _ from 'underscore'

import store from '../../../../stores'
import { getContext, getField, getFormattedPrice } from '../context'

/**
 * returns list of all contexts
 */
export function getList(brand_id) {
  const state = store.getState()
  const { deals } = state

  return (deals && deals.contexts[brand_id]) || []
}

/**
 * search context by name
 */
export function searchContext(brand_id, name) {
  if (!name) {
    return false
  }

  const context = _.find(getList(brand_id), { name })

  if (!context) {
    console.warn(`Could not find context: ${context}`)

    return null
  }

  return {
    ...context,
    validate: getValidationFunction(context.key),
    properties: getFieldProperties(context.key),
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
 * return list of section
 */
export function getFactsheetSection(deal, name) {
  const items = getItems(
    deal.brand.id,
    deal.deal_type,
    deal.property_type,
    getHasActiveOffer(deal)
  )

  return items.filter(item => item.section === name)
}

/**
 * return context items
 */
export function getItems(
  brand_id,
  deal_type,
  property_type,
  hasActiveOffer = false
) {
  const requiredFields = getRequiredItems(
    brand_id,
    deal_type,
    property_type,
    hasActiveOffer
  )

  const optionalFields = getOptionalItems(
    brand_id,
    deal_type,
    property_type,
    hasActiveOffer
  )

  return _.sortBy([].concat(requiredFields, optionalFields), 'order')
}

/**
 * return required context
 */
export function getRequiredItems(
  brand_id,
  deal_type,
  property_type,
  hasActiveOffer = false
) {
  return getList(brand_id)
    .filter(ctx =>
      filterByStatus(ctx, deal_type, property_type, hasActiveOffer, 'required')
    )
    .map(ctx => ({
      ...ctx,
      validate: getValidationFunction(ctx.key),
      properties: getFieldProperties(ctx.key),
      getFormattedValue: getFormattedValue.bind(ctx),
      mandatory: true
    }))
}

/**
 * return optional context
 */
export function getOptionalItems(
  brand_id,
  deal_type,
  property_type,
  hasActiveOffer = false
) {
  return getList(brand_id)
    .filter(ctx =>
      filterByStatus(ctx, deal_type, property_type, hasActiveOffer, 'optional')
    )
    .map(ctx => ({
      ...ctx,
      validate: getValidationFunction(ctx.key),
      properties: getFieldProperties(ctx.key),
      getFormattedValue: getFormattedValue.bind(ctx),
      mandatory: false
    }))
}

/**
 * return list of filtered contexts based on given criteria
 */
export function query(deal, criteria) {
  const contexts = getList(deal.brand.id)

  return _.chain(contexts)
    .filter(ctx => criteria(ctx))
    .map(ctx => ({
      ...ctx,
      validate: getValidationFunction(ctx.key),
      properties: getFieldProperties(ctx.key),
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
export function filterByStatus(
  context,
  deal_type,
  property_type,
  hasActiveOffer,
  filterBy
) {
  const definition = context[filterBy]

  if (definition.length === 0) {
    return false
  }

  return (
    definition.includes(deal_type) &&
    definition.includes(property_type) &&
    (hasActiveOffer || !definition.includes('Active Offer'))
  )
}

/**
 * returns check context is currency
 */
export function isCurrency(field) {
  return ['list_price', 'sales_price'].indexOf(field.key) > -1
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

  if (field.key === 'property_type') {
    return {
      value: deal.property_type
    }
  }

  // get field
  const defaultContext =
    isAddressField(field.key) && deal.listing ? deal.mls_context : null

  const contextValue = getField(deal, field.key, defaultContext)

  const dataObject = {
    value: contextValue,
    rawValue: contextValue
  }

  if (isCurrency(field)) {
    dataObject.value = getFormattedPrice(contextValue)
  }

  return dataObject
}

/**
 * returns value of a origin
 * name is field name
 * origin is context origin (mls or deal)
 */
export function getValueByContext(brand_id, name, context) {
  const contextInfo = getList(brand_id).find(ctx => ctx.key === name)

  if (contextInfo.data_type === 'Date') {
    return moment.unix(context.value).format('MMM DD, YYYY')
  }

  if (isCurrency({ name })) {
    return getFormattedPrice(context.value)
  }

  return context.value
}

/**
 * returns date value of context
 */
export function getDateValue(deal, field) {
  const date = getField(deal, field.key)

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
        max: 2018,
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
export function validateList(
  brand_id,
  list,
  deal_type,
  property_type,
  hasActiveOffer
) {
  const dealContexts = getItems(
    brand_id,
    deal_type,
    property_type,
    hasActiveOffer
  )

  return _.every(dealContexts, ctx => ctx.validate(ctx, list[ctx.key]))
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

export function getDefinitionId(brand_id, key) {
  return _.find(getList(brand_id), { key }).id
}

export function getChecklist(deal, fieldKey) {
  const dealContext = getContext(deal, fieldKey)
  const field = query(deal, item => item.key === fieldKey)[0]

  if (dealContext && dealContext.checklist) {
    return dealContext.checklist
  }

  const isRequired = filterByStatus(
    field,
    deal.deal_type,
    deal.property_type,
    getHasActiveOffer(deal),
    'required'
  )

  const condition = isRequired ? field.required : field.optional

  if (
    deal.deal_type === 'Selling' &&
    condition.includes('Active Offer') &&
    getHasActiveOffer(deal)
  ) {
    const checklists = getChecklists()

    return deal.checklists.find(id => checklists[id].is_active_offer)
  }

  return deal.checklists[0]
}

function getFormattedValue(value) {
  if (!value) {
    return value
  }

  if (this.format === 'Currency') {
    return getFormattedPrice(parseFloat(value), 'currency', 0)
  }

  return value
}

export default {
  getList,
  searchContext,
  getChecklists,
  getFactsheetSection,
  getItems,
  getRequiredItems,
  getOptionalItems,
  getDefinitionId,
  getChecklist,
  query,
  getHasActiveOffer,
  filterByStatus,
  isCurrency,
  getValue,
  getValueByContext,
  getDateValue,
  parseDate,
  getDateFormatString,
  validate,
  validateDate,
  validateList,
  isAddressField
}
