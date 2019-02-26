import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import styled from 'styled-components'

import PDFPage from './PdfPage'
import Annotations from './Annotations'

import { ContextInlineEdit } from './ContextInlineEdit'

const Container = styled.div`
  /* text-align: center; */
`

const PageContainer = styled.div`
  position: relative;
  padding-bottom: 20px;
`

class PDFPreview extends React.Component {
  state = {
    selectedAnnotation: null
  }

  // roleColors = {}
  contextsAnnotations = {}

  scale = window.devicePixelRatio * 1.2

  displayWidth = Math.min(window.innerWidth - 80, 900)

  onSelectContext = (type, data) => {
    this.setState({
      selectedAnnotation: { type, data }
    })

    this.props.onSelectContext()
  }

  deselectActiveAnnotation = () => {
    this.setState({
      selectedAnnotation: null
    })
  }

  setPageContextsAnnotations = contexts => {
    this.contextsAnnotations = {
      ...this.contextsAnnotations,
      ..._.indexBy(contexts, c => c.annotation.fieldName)
    }
  }

  render() {
    const { document } = this.props

    if (!document) {
      return false
    }

    return (
      <Container>
        {Array.apply(null, { length: document.numPages }).map(
          (value, index) => (
            <PageContainer key={index}>
              <Annotations
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

        {this.state.selectedAnnotation && (
          <ContextInlineEdit
            item={this.state.selectedAnnotation}
            onDismiss={this.deselectActiveAnnotation}
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
