import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import styled from 'styled-components'

import PDFPage from './pdf-page'
import Annotations from './annotations'

import RolesManager from './integrations/roles'
import AddressForm from './integrations/address'
import ContextForm from './integrations/context'

const Container = styled.div`
  /* text-align: center; */
`

const PageContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`

class PDFPreview extends React.Component {
  state = {
    selectedAnnotation: null
  }

  componentDidMount() {
    this.enableScrolling()
  }

  // roleColors = {}
  contextsAnnotations = {}

  scale = window.devicePixelRatio * 1.2
  displayWidth = Math.min(window.innerWidth - 80, 900)

  get AppContainerSelector() {
    return document.getElementsByClassName('l-app__main')[0]
  }

  enableScrolling = () => {
    this.AppContainerSelector.style.overflow = 'auto'
  }

  disableScrolling = () => {
    this.AppContainerSelector.style.overflow = 'hidden'
  }

  onSelectContext = (type, data) => {
    this.setState({
      selectedAnnotation: { type, data }
    })

    this.props.onSelectContext()

    this.disableScrolling()
  }

  deselectActiveAnnotation = () => {
    this.setState({
      selectedAnnotation: null
    })

    this.enableScrolling()
  }

  setPageContextsAnnotations = contexts => {
    this.contextsAnnotations = {
      ...this.contextsAnnotations,
      ..._.indexBy(contexts, c => c.annotation.fieldName)
    }
  }

  get IsRolesManagerOpen() {
    return (
      this.state.selectedAnnotation &&
      this.state.selectedAnnotation.type === 'Role'
    )
  }

  get IsAddressFormOpen() {
    return (
      this.state.selectedAnnotation &&
      this.state.selectedAnnotation.type === 'Context' &&
      this.state.selectedAnnotation.data.type === 'Address'
    )
  }

  get IsContextFormOpen() {
    return (
      this.state.selectedAnnotation &&
      this.state.selectedAnnotation.type === 'Context' &&
      this.state.selectedAnnotation.data.type === 'Singular'
    )
  }

  // getRoleColor = assignment => {
  //   const { deal, roles } = this.props

  //   const colors = [
  //     '#ffe084',
  //     '#d2dfec',
  //     '#f9caaf',
  //     '#b1d6cf',
  //     '#d0bbdb',
  //     '#c1e5ec'
  //   ]

  //   const matchedRoles = deal.roles
  //     .map(role => roles[role])
  //     .filter(role => assignment.role.includes(role.role))

  //   if (!matchedRoles || matchedRoles.length === 0) {
  //     return false
  //   }

  //   const role = matchedRoles[assignment.number]

  //   if (!role) {
  //     return false
  //   }

  //   if (this.roleColors[role.id]) {
  //     return this.roleColors[role.id]
  //   }

  //   this.roleColors[role.id] = colors[_.size(this.roleColors)]

  //   return this.roleColors[role.id]
  // }

  render() {
    const { document } = this.props
    const { selectedAnnotation } = this.state

    if (!document) {
      return false
    }

    return (
      <Container>
        {Array.apply(null, { length: document.numPages }).map(
          (value, index) => (
            <PageContainer key={index}>
              <Annotations
                // getRoleColor={this.getRoleColor}
                deal={this.props.deal}
                roles={this.props.roles}
                document={document}
                page={index + 1}
                scale={this.scale}
                displayWidth={this.displayWidth}
                values={this.props.values}
                onCalculateContextAnnotations={this.setPageContextsAnnotations}
                onSetValues={this.props.onSetValues}
                onValueUpdate={this.props.onValueUpdate}
                onClick={this.onSelectContext}
              />

              <PDFPage
                document={document}
                page={index + 1}
                scale={this.scale}
                displayWidth={this.displayWidth}
              />
            </PageContainer>
          )
        )}

        {this.IsRolesManagerOpen && (
          <RolesManager
            selectedAnnotation={selectedAnnotation}
            formValues={this.props.values}
            deal={this.props.deal}
            onClose={this.deselectActiveAnnotation}
            onSetValues={this.props.onSetValues}
          />
        )}

        <AddressForm
          selectedAnnotation={selectedAnnotation}
          isOpen={this.IsAddressFormOpen}
          contextsAnnotations={this.contextsAnnotations}
          data={selectedAnnotation && selectedAnnotation.data}
          onClose={this.deselectActiveAnnotation}
          onSetValues={this.props.onSetValues}
          deal={this.props.deal}
        />

        {this.IsContextFormOpen && (
          <ContextForm
            formValues={this.props.values}
            data={selectedAnnotation && selectedAnnotation.data}
            deal={this.props.deal}
            onValueUpdate={this.props.onValueUpdate}
            onClose={this.deselectActiveAnnotation}
          />
        )}
      </Container>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    roles: deals.roles
  }
}

export default connect(mapStateToProps)(PDFPreview)
