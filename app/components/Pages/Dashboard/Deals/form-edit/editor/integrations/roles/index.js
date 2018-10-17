import React from 'react'
import { connect } from 'react-redux'

import Flex from 'styled-flex-component'

import OverlayDrawer from '../../../../../../../../views/components/OverlayDrawer'

import ActionButton from 'components/Button/ActionButton'

import { Input } from './styled'

import Roles from '../../../../components/roles'
import { getRolesText, getRoleText } from '../../../utils/get-roles-text'
import { getRoleTooltip } from '../../../utils/get-role-tooltip'
import { getAnnotationsValues } from '../../../utils/word-wrap'

class RolesDrawer extends React.Component {
  constructor(props) {
    super(props)

    const defaultManualValue = this.DefaultManualValue

    this.state = {
      manualValue: defaultManualValue,
      showManualInput:
        defaultManualValue && defaultManualValue !== this.ListValue
    }
  }

  toggleManualInput = () =>
    this.setState(state => ({
      showManualInput: !state.showManualInput
    }))

  handleClose = () => this.props.onClose()

  handleSaveAndClose = () => {
    const { data } = this.props.selectedAnnotation

    const values = getAnnotationsValues(data.annotations, this.ListValue, {
      maxFontSize: 20
    })

    this.props.onSetValues(values, true)
    this.props.onClose()
  }

  handleSaveManualValue = () => {
    const { selectedAnnotation } = this.props
    const { annotations } = selectedAnnotation.data

    const values = getAnnotationsValues(annotations, this.state.manualValue, {
      maxFontSize: 20
    })

    this.props.onSetValues(values, true)
    this.props.onClose()
  }

  handleChangeManualValue = e => this.setState({ manualValue: e.target.value })

  get AllowedRoles() {
    if (!this.props.isOpen) {
      return null
    }

    return this.props.selectedAnnotation.data.roleName.split(',')
  }

  get DefaultManualValue() {
    const { selectedAnnotation } = this.props

    return selectedAnnotation.data.annotations
      .reduce((acc, ann) => `${acc}${this.props.formValues[ann.fieldName]}`, '')
      .trim()
  }

  get ListValue() {
    const { data } = this.props.selectedAnnotation
    const { roleName, annotationContext, contextType } = data

    let text = ''

    if (contextType === 'Roles') {
      text = getRolesText(
        this.props.dealsRoles,
        this.props.deal,
        roleName,
        annotationContext
      )
    } else if (contextType === 'Role') {
      text = getRoleText(
        this.props.dealsRoles,
        this.props.deal,
        roleName,
        annotationContext
      )
    }

    return text.trim()
  }

  get DrawerTitle() {
    const { selectedAnnotation } = this.props

    if (!selectedAnnotation) {
      return false
    }

    const { data } = selectedAnnotation

    return getRoleTooltip(data.annotationContext, data.contextType === 'Roles')
  }

  render() {
    return (
      <OverlayDrawer
        isOpen
        onClose={this.handleClose}
        showFooter={!this.state.showManualInput}
        closeOnBackdropClick={false}
      >
        <OverlayDrawer.Header title={this.DrawerTitle} />
        <OverlayDrawer.Body>
          <ActionButton
            appearance={this.state.showManualInput ? 'outline' : 'primary'}
            onClick={this.toggleManualInput}
            style={{
              margin: '1rem 0'
            }}
          >
            {this.state.showManualInput ? 'Select from list' : 'Manual Input'}
          </ActionButton>

          {this.state.showManualInput ? (
            <Flex full justifyBetween>
              <Input
                style={{ width: '85%', marginRight: '0.25rem' }}
                value={this.state.manualValue}
                onChange={this.handleChangeManualValue}
              />
              <ActionButton onClick={this.handleSaveManualValue}>
                Save
              </ActionButton>
            </Flex>
          ) : (
            <Roles
              showTitle={false}
              deal={this.props.deal}
              allowedRoles={this.AllowedRoles}
              allowDeleteRole
            />
          )}
        </OverlayDrawer.Body>

        <OverlayDrawer.Footer style={{ flexDirection: 'row-reverse' }}>
          <ActionButton onClick={this.handleSaveAndClose}>
            Save and Close
          </ActionButton>
        </OverlayDrawer.Footer>
      </OverlayDrawer>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    dealsRoles: deals.roles
  }
}

export default connect(mapStateToProps)(RolesDrawer)
