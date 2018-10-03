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

  roleColors = {}

  scale = window.devicePixelRatio * 1.2
  displayWidth = Math.min(window.innerWidth - 80, 900)

  onSelectContext = (type, data) =>
    this.setState({
      selectedAnnotation: { type, data }
    })

  deselectActiveAnnotation = () =>
    this.setState({
      selectedAnnotation: null
    })

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

        <RolesManager
          selectedAnnotation={selectedAnnotation}
          isOpen={selectedAnnotation && selectedAnnotation.type === 'Role'}
          onClose={this.deselectActiveAnnotation}
          deal={this.props.deal}
          onSetValues={this.props.onSetValues}
        />

        <AddressForm
          selectedAnnotation={selectedAnnotation}
          isOpen={
            selectedAnnotation &&
            selectedAnnotation.type === 'Context' &&
            selectedAnnotation.data.type === 'Address'
          }
          data={selectedAnnotation && selectedAnnotation.data}
          onClose={this.deselectActiveAnnotation}
          onSetValues={this.props.onSetValues}
          deal={this.props.deal}
        />

        <ContextForm
          isOpen={
            selectedAnnotation &&
            selectedAnnotation.type === 'Context' &&
            selectedAnnotation.data.type === 'Singular'
          }
          onClose={this.deselectActiveAnnotation}
          data={selectedAnnotation && selectedAnnotation.data}
          onValueUpdate={this.props.onValueUpdate}
          deal={this.props.deal}
        />
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
