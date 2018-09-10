import React from 'react'
import _ from 'underscore'
import styled from 'styled-components'

import importPdfJs from '../../../../../../../utils/import-pdf-js'

import FormInputs from './form-inputs'
import FormContexts from './form-contexts'

const AnnotationsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* background-color: rgba(255, 0, 0, 0.1); */
`

export default class Annotations extends React.Component {
  state = {
    isLoaded: false
  }

  componentDidMount() {
    this.init()
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
    this.viewport = this.page.getViewport(this.props.scale)

    const annotations = await this.page.getAnnotations()

    this.annotations = _.sortBy(annotations, item => item.order)

    this.annotations = this.annotations.map(annotation => ({
      ...annotation,
      rect: PDFJS.Util.normalizeRect(
        this.viewport.convertToViewportRectangle(annotation.rect)
      )
    }))

    const info = this.annotations.map(this.getInfo)

    this.inputs = _.filter(info, { type: 'Input' })

    this.contexts = _.chain(info)
      .filter({ type: 'Context' })
      .groupBy('context')
      .value()

    this.roles.all = _.chain(info)
      .filter({ type: 'Roles' })
      .groupBy('role')
      .value()

    this.roles.single = _.chain(info)
      .filter({ type: 'Role' })
      .groupBy('role')
      .value()
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
      // TODO: Security. Easy code injection can happen here.
      // It should be sandboxed. Later.
      calculated = eval(`(${jsCode})`)
    } catch (e) {}

    if (!calculated) {
      return normalInput
    }

    const { type } = calculated

    if (!type) {
      return normalInput
    }

    return {
      group: Symbol(''),
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
      <AnnotationsContainer>
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
      </AnnotationsContainer>
    )
  }
}
