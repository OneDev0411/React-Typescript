import moment from 'moment'
import _ from 'underscore'
import store from '../stores'
import Deal from './Deal'

const Context = {}

/**
 * returns list of all contexts
 */
Context.getList = function() {
  const state = store.getState()
  const { deals } = state
  return deals && deals.contexts
}

/**
 * returns list of all checklists
 */
Context.getChecklists = function() {
  const state = store.getState()
  const { deals } = state
  return deals && deals.checklists
}

/**
 * returns deal type flag
 */
Context.getDealTypeFlag = function(deal_type) {
  if (deal_type === 'Selling') {
    return 1
  } else if (deal_type === 'Buying') {
    return 2
  } else {
    return null
  }
}

/**
 * returns property type flag
 */
Context.getPropertyTypeFlag = function(property_type) {
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
Context.getFactsheetSection = function(deal, name) {
  const criteria = (ctx) => ctx.section === name
  const hasActiveOffer = Context.hasActiveOffer(deal)

  return Context
    .query(criteria)
    .filter(ctx => Context.filterByFlags(
      ctx,
      deal.deal_type,
      deal.property_type,
      hasActiveOffer,
      'show_on_fact_sheet'
    ))
}

/**
 * return context items
 */
Context.getItems = function(deal_type, property_type, hasActiveOffer = false) {
  const requiredFields = Context.getRequiredItems(deal_type, property_type, hasActiveOffer)
  const optionalFields = Context.getOptionalItems(deal_type, property_type, hasActiveOffer)
  return []
    .concat(requiredFields, optionalFields)
    .sort(ctx => ctx.data_type === 'Date' ? 1 : -1)
}

/**
 * return required context
 */
Context.getRequiredItems = function(deal_type, property_type, hasActiveOffer = false) {
  return Context
    .getList()
    .filter(ctx => Context.filterByFlags(
      ctx,
      deal_type,
      property_type,
      hasActiveOffer,
      'required'
    ))
    .map(ctx => ({
      ...ctx,
      validate: Context.validate,
      mandatory: true
    }))
}

/**
 * return optional context
 */
Context.getOptionalItems = function(deal_type, property_type, hasActiveOffer = false) {
  return Context
    .getList()
    .filter(ctx => Context.filterByFlags(
      ctx,
      deal_type,
      property_type,
      hasActiveOffer,
      'optional'
    ))
    .map(ctx => ({
      ...ctx,
      validate: Context.validate,
      mandatory: false
    }))
}

/**
 * return list of filtered contexts based on given criteria
 */
Context.query = function (criteria) {
  const contexts = Context.getList()

  return _
    .chain(contexts)
    .filter(ctx => criteria(ctx))
    .map(ctx => ({
      ...ctx,
      validate: Context.validate,
      disabled: Context.isDisabled(ctx)
    }))
    .value()
}

/**
 * check deal has active offer
 */
Context.hasActiveOffer = function(deal) {
  const checklists = Context.getChecklists()
  const filtered = deal.checklists.filter(id => {
    const checklist = checklists[id]

    return !checklist.is_deactivated &&
      !checklist.is_terminated &&
      checklist.checklist_type === 'Buying'
  })

  return filtered.length > 0
}

/**
 * return list of filtered contexts based on given criteria
 */
Context.filterByFlags = function (context, deal_type, property_type, hasActiveOffer, filterBy) {
  const flag = context[filterBy]
  const dealTypeFlag = Context.getDealTypeFlag(deal_type)
  const propertyTypeFlag = Context.getPropertyTypeFlag(property_type)
  const isSellingDeal = deal_type === 'Selling'

  if ((flag & dealTypeFlag) !== dealTypeFlag) {
    return false
  }

  if ((flag & propertyTypeFlag) !== propertyTypeFlag) {
    return false
  }

  if (isSellingDeal && (hasActiveOffer || flag & 131072 === 0)) {
    return false
  }

  return true
}

/**
 * returns check context is currency
 */
Context.isCurrency = function(field) {
  return ['list_price', 'sales_price'].indexOf(field.name) > -1
}

/**
 * returns check context is disabled
 */
Context.isDisabled = function(field) {
  return ['list_price'].indexOf(field.name) > -1
}

/**
 * returns value of context
 */
Context.getValue = function(deal, field) {
  if (field.data_type === 'Date') {
    return Context.getDateValue(deal, field)
  }

  if (field.name === 'property_type') {
    return {
      value: deal.property_type
    }
  }

  // get field
  const contextValue = Deal.get.field(deal, field.name)

  const dataObject = {
    value: contextValue,
    rawValue: contextValue
  }

  if (Context.isCurrency(field)) {
    dataObject.contextValue = Deal.get.formattedPrice(contextValue)
  }

  return dataObject
}

/**
 * returns date value of context
 */
Context.getDateValue = function(deal, field) {
  const date = Deal.get.field(deal, field.name)

  return {
    value: date ? Context.parseDate(date).format('MMM DD, YYYY') : ''
  }
}

Context.parseDate = function(date) {
  return moment.unix(date).utc()
}

/**
 * validate a context
 */
Context.validate = function(ctx, value) {
  if (value === undefined || value.length === 0) {
    return !ctx.mandatory
  }

  switch (ctx.data_type) {
    case 'Number':
      return parseFloat(value) > 0
    case 'String':
      return value.length > 0
    case 'Date':
      return Context.validateDate(value)
  }
}

/**
 * validate a date context
 */
Context.validateDate = function(value) {
  if (typeof value === 'object' && value instanceof Date) {
    return true
  }

  const date = moment(value)
  return date && date.isValid()
}

/**
 * validate given contexts
 */
Context.validateList = function(list, deal_type, property_type, hasActiveOffer) {
  const dealContexts = Context.getItems(deal_type, property_type, hasActiveOffer)
  return _.every(dealContexts, ctx => ctx.validate(ctx, list[ctx.name]))
}

/**
 * get valid contexts
 */
Context.getValidItems = function(list, deal_type, property_type, hasActiveOffer = false) {
  const dealContexts = _.indexBy(
    Context.getItems(deal_type, property_type, hasActiveOffer),
    'name'
  )

  return _.pick(list, (value, name) =>
    Context.validate(dealContexts[name], value))
}

export default Context
