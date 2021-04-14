import { groupBy } from 'views/utils/object-helpers'

import uuid from 'utils/uuid'
import importPdfJs from 'utils/import-pdf-js'

import { isAddressContext } from 'utils/is-address-context'

import { populateFormValues } from '../populate-form-values'

let PDFJS

export async function parseAnnotations(document, options) {
  PDFJS = await importPdfJs()

  const pages = await Promise.all(
    new Array(document.numPages)
      .fill(null)
      .map((v, index) => getPageAnnotations(document, index + 1, options))
  )

  const annotations = pages.map(page => page.annotations)

  return {
    annotations,
    fields: populateFormValues(annotations, serializeValues(pages), options)
  }
}

async function getPageAnnotations(document, pageNumber, options) {
  const page = await document.getPage(pageNumber)

  // get width of actual viewport
  const { width } = page.getViewport({
    scale: options.scale
  })

  const viewport = page.getViewport({
    scale: options.displayWidth / (width / options.scale)
  })

  const annotations = await page.getAnnotations()

  const info = Object.entries(annotations)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([, annotation]) => {
      const item = {
        ...annotation,
        page: pageNumber,
        rect: PDFJS.Util.normalizeRect(
          viewport.convertToViewportRectangle(annotation.rect)
        )
      }

      return getAnnotationInfo(item)
    })

  return {
    values: info.map(item => ({
      name: item.annotation.fieldName,
      value: item.annotation.fieldValue
    })),
    annotations: {
      inputs: normalizeInputs(info, options.defaultValues),
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
  const normalized = groupBy(
    Object.entries(list)
      .filter(([, item]) => ['Role', 'Roles'].includes(item.type))
      .map(([, item]) => item),
    'role'
  )

  return Object.entries(normalized).reduce((current, [context_name]) => {
    current[context_name] = groupBy(normalized[context_name], item => {
      const attrs = [].concat(item.attributes).sort()
      const role = [].concat(item.role).sort().concat(attrs).join('_')

      return `${item.group}_${role}`
    })

    return current
  }, {})
}

function normalizeInputs(inputs, defaultValues) {
  return inputs
    .filter(item => ['Input', 'Date', 'Number'].includes(item.type))
    .map(item => {
      return {
        ...item,
        annotation: {
          ...item.annotation,
          fieldValue:
            defaultValues[item.annotation.fieldName] ??
            item.annotation.fieldValue
        }
      }
    })
}

function normalizeContexts(list, type) {
  const normalized = groupBy(
    Object.entries(list)
      .filter(([, item]) => item.type === type)
      .map(([, item]) => item),
    item => item.context
  )

  return Object.entries(normalized).reduce((current, [context_name]) => {
    current[context_name] = groupBy(normalized[context_name], 'group')

    return current
  }, {})
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
  } catch (e) {
    console.log(`Form annotation JS code parse error - ${e}`)
  }

  if (!calculated) {
    return normalInput
  }

  let { type } = calculated

  if (isAddressContext(calculated.context)) {
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
