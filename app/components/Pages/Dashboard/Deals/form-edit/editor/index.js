import React from 'react'
import { connect } from 'react-redux'

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

  scale = 1

  calculateSpace = async el => {
    if (!el) {
      return false
    }

    const { document } = this.props
    const page = await document.getPage(1)
    const viewport = page.getViewport(1)

    const availableWidth = Math.min(el.clientWidth, 800)

    this.scale = availableWidth / viewport.width
  }

  onSelectContext = (type, data) => {
    this.setState({
      selectedAnnotation: { type, data }
    })
  }

  deselectActiveAnnotation = () =>
    this.setState({
      selectedAnnotation: null
    })

  render() {
    const { document } = this.props
    const { selectedAnnotation } = this.state

    if (!document) {
      return false
    }

    selectedAnnotation && console.log(selectedAnnotation)

    return (
      <Container innerRef={this.calculateSpace}>
        {Array.apply(null, { length: document.numPages }).map(
          (value, index) => (
            <PageContainer key={index}>
              <Annotations
                deal={this.props.deal}
                roles={this.props.roles}
                document={document}
                page={index + 1}
                scale={this.scale * 1.5}
                values={this.props.values}
                onSetValues={this.props.onSetValues}
                onValueUpdate={this.props.onValueUpdate}
                onClick={this.onSelectContext}
              />

              <PDFPage
                document={document}
                page={index + 1}
                scale={this.scale * 1.5}
              />
            </PageContainer>
          )
        )}

        <RolesManager
          isOpen={selectedAnnotation && selectedAnnotation.type === 'Role'}
          onClose={this.deselectActiveAnnotation}
          deal={this.props.deal}
        />

        <AddressForm
          isOpen={
            selectedAnnotation &&
            selectedAnnotation.type === 'Context' &&
            selectedAnnotation.data.type === 'Address'
          }
          data={selectedAnnotation && selectedAnnotation.data}
          onClose={this.deselectActiveAnnotation}
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
