import React from 'react'
import _ from 'underscore'

import importPdfJs from 'utils/import-pdf-js'
import uuid from 'utils/uuid'

import { getValue } from '../../utils/types'

import { FormInputs } from './FormInputs'
import { FormContexts } from './FormContexts'

export default class Annotations extends React.Component {
  state = {
    isLoaded: false
  }

  componentDidMount() {
    setTimeout(() => this.init(), 10)
  }

  inputs = []

  contexts = []

  roles = {
    all: [],
    single: []
  }

  init = async () => {
    await this.indexAnnotations()

    this.setState({ isLoaded: true })
  }

  async indexAnnotations() {
    const PDFJS = await importPdfJs()

    this.page = await this.props.document.getPage(this.props.page)

    // get width of actual viewport
    const { width } = this.page.getViewport(this.props.scale)

    this.viewport = this.page.getViewport(
      this.props.displayWidth / (width / this.props.scale)
    )

    const annotations = await this.page.getAnnotations()

    this.annotations = _.sortBy(annotations, item => item.order)

    this.annotations = this.annotations.map(annotation => ({
      ...annotation,
      rect: PDFJS.Util.normalizeRect(
        this.viewport.convertToViewportRectangle(annotation.rect)
      )
    }))

    const info = this.annotations.map(this.getInfo)

    // get contexts
    const contexts = _.filter(info, { type: 'Context' })

    this.inputs = _.filter(info, { type: 'Input' })
    this.contexts = _.groupBy(contexts, 'context')

    this.roles.all = _.chain(info)
      .filter({ type: 'Roles' })
      .groupBy('role')
      .value()

    this.roles.single = _.chain(info)
      .filter({ type: 'Role' })
      .groupBy('role')
      .value()

    this.setDefaultValues()
    this.props.onCalculateContextAnnotations(contexts)
  }

  setDefaultValues = () => {
    const defaultValues = {}

    this.annotations.forEach(annotation => {
      defaultValues[annotation.fieldName] = getValue(annotation)
    })

    this.props.onSetValues(defaultValues, true)
  }

  getInfo = annotation => {
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

    const { type } = calculated

    if (!type) {
      return normalInput
    }

    return {
      group: uuid(),
      order: 0,
      ...calculated,
      annotation
    }
  }

  render() {
    if (!this.state.isLoaded) {
      return false
    }

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        }}
      >
        <FormInputs
          inputs={this.inputs}
          values={this.props.values}
          annotations={this.annotations}
          onValueUpdate={this.props.onValueUpdate}
          onSetValues={this.props.onSetValues}
        />

        <FormContexts
          deal={this.props.deal}
          contexts={this.contexts}
          roles={this.roles}
          values={this.props.values}
          onSetValues={this.props.onSetValues}
          onClick={this.props.onClick}
        />
      </div>
    )
  }
}
