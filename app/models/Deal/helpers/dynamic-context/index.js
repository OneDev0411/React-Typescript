import moment from 'moment'
import _ from 'underscore'

import store from '../../../../stores'
import { getContext, getField, getFormattedPrice } from '../context'

/**
 * returns list of all contexts
 */
export function getList(list_id) {
  const state = store.getState()
  const { deals } = state

  const contexts = deals && deals.contexts

  if (contexts.byBrand[list_id]) {
    return contexts.byBrand[list_id]
  }

  if (contexts.byDeal[list_id]) {
    return contexts.byDeal[list_id]
  }

  return []
}

/**
 * search context by key
 */
export function searchContext(list_id, key) {
  if (!key) {
    return false
  }

  const context = _.find(getList(list_id), { key })

  if (!context) {
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
export function getFactsheetSection(listId, deal, section) {
  const items = getItems(
    listId,
    deal.deal_type,
    deal.property_type,
    deal.has_active_offer
  )

  const list = items.filter(item => item.section === section)

  if (section === 'Dates') {
    const fieldsWithValue = list
      .filter(field => !!getField(deal, field.key))
      .sort((a, b) => getField(deal, a.key) - getField(deal, b.key))

    const fieldsWithoutValue = list.filter(field => !getField(deal, field.key))

    return [...fieldsWithValue, ...fieldsWithoutValue]
  }

  return list
}

/**
 * return context items
 */
export function getItems(
  list_id,
  deal_type,
  property_type,
  hasActiveOffer = false
) {
  const requiredFields = getRequiredItems(
    list_id,
    deal_type,
    property_type,
    hasActiveOffer
  )

  const optionalFields = getOptionalItems(
    list_id,
    deal_type,
    property_type,
    hasActiveOffer
  ).filter(
    field => requiredFields.some(({ key }) => field.key === key) === false
  )

  return _.sortBy([].concat(requiredFields, optionalFields), 'order')
}

/**
 * return required context
 */
export function getRequiredItems(
  list_id,
  deal_type,
  property_type,
  hasActiveOffer = false
) {
  return getList(list_id)
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
  list_id,
  deal_type,
  property_type,
  hasActiveOffer = false
) {
  return getList(list_id)
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
  const contexts = getList(deal.id)

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
  has_active_offer,
  filter_by
) {
  const definition = context[filter_by] || []

  if (definition.length === 0) {
    return false
  }

  return (
    definition.includes(deal_type) &&
    definition.includes(property_type) &&
    (deal_type === 'Buying' ||
      has_active_offer ||
      !definition.includes('Active Offer'))
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

  const contextValue = getField(deal, field.key)

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
 * key is field key
 * origin is context origin (mls or deal)
 */
export function getValueByContext(list_id, key, context) {
  const contextInfo = getList(list_id).find(ctx => ctx.key === key)

  if (contextInfo.data_type === 'Date') {
    return moment.unix(context.value).format('MMM DD, YYYY')
  }

  if (isCurrency({ key })) {
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
function getValidationFunction(key) {
  return (
    {
      year_built: validateYearBuilt
    }[key] || validate
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
        value === null ||
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
  if (!value) {
    return !ctx.mandatory
  }

  return parseFloat(value) >= 1000 && parseFloat(value) <= 9999
}

export function getFieldProperties(key) {
  return (
    {
      year_built: {
        placeholder: 'YYYY',
        mask: [/[1-2]/, /\d/, /\d/, /\d/]
      }
    }[key] || {}
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
  list_id,
  list,
  deal_type,
  property_type,
  hasActiveOffer
) {
  const dealContexts = getItems(
    list_id,
    deal_type,
    property_type,
    hasActiveOffer
  )

  return _.every(dealContexts, ctx => ctx.validate(ctx, list[ctx.key]))
}

export function isAddressField(key) {
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
  ].includes(key)
}

export function getDefinitionId(list_id, key) {
  const definition = getDefinition(list_id, key)

  return definition && definition.id
}

export function getDefinition(list_id, key) {
  return _.find(getList(list_id), { key })
}

export function getChecklist(deal, key) {
  // debugger

  const dealContext = getContext(deal, key)
  const field = query(deal, item => item.key === key)[0]

  if (dealContext && dealContext.checklist) {
    return dealContext.checklist
  }

  const isRequired = filterByStatus(
    field,
    deal.deal_type,
    deal.property_type,
    deal.has_active_offer,
    'required'
  )

  const condition = isRequired ? field.required : field.optional
  const checklists = getChecklists()

  if (
    deal.deal_type === 'Selling' &&
    condition.includes('Active Offer') &&
    deal.has_active_offer
  ) {
    return deal.checklists.find(
      id =>
        checklists[id].is_active_offer &&
        checklists[id].is_deactivated === false &&
        checklists[id].is_terminated === false
    )
  }

  return deal.checklists.find(
    id =>
      checklists[id].is_deactivated === false &&
      checklists[id].is_terminated === false
  )
}

export function createUpsertObject(deal, field, value, approved = false) {
  const definition = getDefinitionId(deal.id, field)

  if (!definition) {
    return null
  }

  return {
    definition,
    checklist: getChecklist(deal, field),
    value,
    approved
  }
}

export function getStatusField(deal) {
  return getField(deal, 'contract_status')
    ? 'contract_status'
    : 'listing_status'
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
  getDefinition,
  getDefinitionId,
  getChecklist,
  query,
  getHasActiveOffer,
  filterByStatus,
  isCurrency,
  getValue,
  getValueByContext,
  getDateValue,
  getStatusField,
  parseDate,
  getDateFormatString,
  validate,
  validateDate,
  validateList,
  isAddressField,
  createUpsertObject
}
