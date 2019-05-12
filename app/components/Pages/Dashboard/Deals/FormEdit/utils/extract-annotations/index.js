import _ from 'underscore'

import DealContext from 'models/Deal/helpers/dynamic-context'

import uuid from 'utils/uuid'
import importPdfJs from 'utils/import-pdf-js'

let PDFJS

export async function extractAnnotations(document, options) {
  PDFJS = await importPdfJs()

  const pages = await Promise.all(
    new Array(10)
      .fill(null)
      .map((v, index) => getPageAnnotations(document, index + 1, options))
  )

  return {
    annotations: pages.map(page => page.annotations),
    values: serializeValues(pages)
  }
}

async function getPageAnnotations(document, pageNumber, options) {
  const page = await document.getPage(pageNumber)

  // get width of actual viewport
  const { width } = page.getViewport(options.scale)

  const viewport = page.getViewport(
    options.displayWidth / (width / options.scale)
  )

  const annotations = await page.getAnnotations()

  const info = _.chain(annotations)
    .sortBy(annotation => annotation.order)
    .map(annotation => {
      const item = {
        ...annotation,
        page: pageNumber,
        rect: PDFJS.Util.normalizeRect(
          viewport.convertToViewportRectangle(annotation.rect)
        )
      }

      return getAnnotationInfo(item)
    })
    .value()

  return {
    values: info.map(item => ({
      name: item.annotation.fieldName,
      value: item.annotation.fieldValue
    })),
    annotations: {
      inputs: info.filter(item => item.type === 'Input'),
      addresses: normalizeContexts(info, 'Address'),
      contexts: normalizeContexts(info, 'Context'),
      roles: normalizeRoles(info)
    }
  }
}

function serializeValues(pages) {
  const list = {}

  pages.forEach(page =>
    page.values.forEach(item => {
      list[item.name] = item.value
    })
  )

  return list
}

function normalizeRoles(list) {
  const grouped = {}

  const normalized = _.chain(list)
    .filter(item => ['Role', 'Roles'].includes(item.type))
    .groupBy('role')
    .value()

  _.each(normalized, (data, context_name) => {
    grouped[context_name] = _.groupBy(
      normalized[context_name],
      item =>
        `${item.role
          .sort()
          .join('')
          .toLowerCase()}${item.attribute}${item.group}`
    )
  })

  return grouped
}

function normalizeContexts(list, type) {
  const grouped = {}

  const normalized = _.chain(list)
    .filter(item => item.type === type)
    .groupBy(item => item.context)
    .value()

  _.each(normalized, (data, context_name) => {
    grouped[context_name] = _.groupBy(normalized[context_name], 'group')
  })

  return grouped
}

function getAnnotationInfo(annotation) {
  const jsCode =
    annotation.additional && annotation.additional.calculate
      ? annotation.additional.calculate.JS
      : null

  const normalInput = {
    type: 'Input',
    group: Symbol(''),
    order: 0,
    annotation
  }

  if (!jsCode) {
    return normalInput
  }

  let calculated

  try {
    calculated = JSON.parse(jsCode)
  } catch (e) {}

  if (!calculated) {
    return normalInput
  }

  let { type } = calculated

  if (DealContext.isAddressField(calculated.context)) {
    type = 'Address'
  }

  if (!type) {
    return normalInput
  }

  return {
    group: uuid(),
    order: 0,
    annotation,
    ...calculated,
    type
  }
}
