import React from 'react'
import { connect } from 'react-redux'

import styled from 'styled-components'

import PDFPage from './pdf-page'
import Annotations from './annotations'

const Container = styled.div`
  text-align: center;
`

const PageContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`

class PDFPreview extends React.Component {
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

  render() {
    const { document } = this.props

    if (!document) {
      return false
    }

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
              />

              <PDFPage
                document={document}
                page={index + 1}
                scale={this.scale * 1.5}
              />
            </PageContainer>
          )
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
