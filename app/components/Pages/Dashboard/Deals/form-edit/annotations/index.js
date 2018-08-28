import React from 'react'
import _ from 'lodash'
import TextAnnotation from './text'
import CheckboxAnnotation from './checkbox'
import ContextAnnotation from './context'
import PDFJS from 'pdfjs-dist'
import Deal from '../../../../../../models/Deal'


class Annotations extends React.Component {
  constructor(props) {
    super(props);
    this.TEXT_ANNOTATION = 1
    this.RADIO_ANNOTATION = 2
    this.CHECKBOX_ANNOTATION = 3
    this.UNKNOWN_ANNOTATION = 4

    this.state = {
      loaded: false
    }


    this._context = {} // context is reserved fo react
    this.role = {}
    this.roles = {}
  }

  componentDidMount() {
    this.indexAnnotations()
    .then(() => {
      this.setDefaultValues()
      this.setState({loaded: true})
    })
  }

  getInfo (annotation) {
    const c = annotation.additional
      && annotation.additional
      && annotation.additional.calculate ? annotation.additional.calculate.JS : null

    const normal = {
      type: 'Input',
      group: Symbol(),
      order: 0,
      annotation
    }

    if (!c) {
      return normal
    }

    let calculated
    try {
      //TODO: Security. Easy code injection can happen here.
      // It should be sandboxed. Later.
      calculated = eval(`(${c})`)
    } catch(e) {}

    if (!calculated)
      return normal

    const { type } = calculated
    if (!type)
      return normal

    return {
      group: Symbol(),
      order: 0,
      ...calculated,
      annotation
    }
  }

  async indexAnnotations() {
    this.page = await this.props.document.getPage(this.props.page)
    this.viewport = this.page.getViewport(this.props.scale)

    this.annotations = (await this.page.getAnnotations())
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    for(const annotation of this.annotations) {
      annotation.rect = PDFJS.Util.normalizeRect(
        this.viewport.convertToViewportRectangle(annotation.rect)
      )
    }

    const info = this.annotations.map(this.getInfo)

    this.input   = _.filter(info, {type: 'Input'})

    this._context = _.chain(info)
      .filter({type: 'Context'})
      .groupBy('context')
      .value()

    this.roles = _.chain(info)
      .filter({type: 'Roles'})
      .groupBy('role')
      .value()

    this.role = _.chain(info)
      .filter({type: 'Role'})
      .groupBy('role')
      .value()
  }

  setDefaultValues() {
    const values = {}

    for(const annotation of this.annotations) {
      const val = annotation.fieldValue
      if (!val)
        continue

      const name = annotation.fieldName

      values[name] = val
    }

    this.props.setValues(values)
  }

  getType(annotation) {
    if (annotation.fieldType === 'Tx') return this.TEXT_ANNOTATION;

    if (annotation.fieldType === 'Btn') {
      if (annotation.fieldFlags & 32768) return this.RADIO_ANNOTATION;

      return this.CHECKBOX_ANNOTATION;
    }

    return this.UNKOWN_ANNOTATION;
  }

  renderInput(info) {
    const { annotation } = info
    const type = this.getType(annotation)

    const { values } = this.props

    const val = values[annotation.fieldName]

    const onValueUpdate = this.props.onValueUpdate.bind(this, annotation.fieldName)

    if (type === this.CHECKBOX_ANNOTATION)
      return (
        <CheckboxAnnotation
          annotation={annotation}
          value={val}
          key={annotation.fieldName}
          onValueUpdate={ onValueUpdate }
          />
      );

    if (type === this.RADIO_ANNOTATION)
      return (
        <RadioAnnotation
          value={val}
          annotation={annotation}
          key={annotation.fieldName}
          onValueUpdate={ onValueUpdate }
        />
      );

    return (
      <TextAnnotation
        key={annotation.fieldName}
        value={val}
        annotation={annotation}
        onValueUpdate={ onValueUpdate }
      />
    );
  }

  renderContext(context, info) {
    const { deal } = this.props

    const item = Deal.get.context(deal, context)

    let text = ''

    //TODO: Numbers and dates
    if (item && typeof item === 'object')
      text = item.text

    if (item && typeof item === 'string')
      text = item

    return (
      <ContextAnnotation
        annotations={ info.map(i => i.annotation) }
        value={ text }
        maxFontSize={ 20 }
      />
    )
  }

  renderRoles(role_name, info) {
    const { deal, roles } = this.props

    const groups = _.groupBy(info, 'group')
    const c = []

    for(const group in groups) {
      const { attribute } = groups[group][0]

      const text = deal.roles
        .map(id => roles[id])
        .filter(role => role.role === role_name)
        .map(role => role[attribute])
        .join(', ')

      c.push((
        <ContextAnnotation
          annotations={ groups[group].map(i => i.annotation) }
          value={ text }
          maxFontSize={ 20 }
        />
      ))
    }

    return c
  }

  renderRole(role_name, info) {
    const { deal, roles } = this.props

    const groups = _.groupBy(info, 'group')
    const c = []

    for(const group in groups) {
      const { attribute, number } = groups[group][0]

      const text = deal.roles
        .map(id => roles[id])
        .filter(role => role.role === role_name)
        [number][attribute]

      c.push((
        <ContextAnnotation
          key={ group }
          annotations={ groups[group].map(i => i.annotation) }
          value={ text }
          maxFontSize={ 20 }
        />
      ))
    }

    return c
  }

  render() {
    const { loaded } = this.state
    if (!loaded)
      return null

    const style = {
      position: 'absolute'
    }

    return (
      <div style={style}>
        { this.input.map(this.renderInput.bind(this)) }
        { Object.keys(this._context).map(g => this.renderContext(g, this._context[g])) }
        { Object.keys(this.roles).map(r => this.renderRoles(r, this.roles[r])) }
        { Object.keys(this.role).map(r => this.renderRole(r, this.role[r])) }
      </div>
    );
  }
}

export default Annotations