import React from 'react'
import styled from 'styled-components'

import PDFPage from './PdfPage'
import Annotations from './Annotations'

const PageContainer = styled.div`
  position: relative;
  padding-bottom: 20px;
`

export default function Editor(props) {
  if (!props.document) {
    return false
  }

  return (
    <div>
      {new Array(props.document.numPages).fill(null).map((_, index) => (
        <PageContainer key={index}>
          <PDFPage
            document={props.document}
            page={index + 1}
            scale={props.scale}
            displayWidth={props.displayWidth}
          />

          <Annotations
            deal={props.deal}
            values={props.values}
            pageIndex={index}
            annotations={props.annotations}
            onValueUpdate={props.onValueUpdate}
          />
        </PageContainer>
      ))}
    </div>
  )
}
