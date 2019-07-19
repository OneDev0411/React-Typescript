import React from 'react'

import PDFPage from './PdfPage'
import Annotations from './Annotations'

export default function Editor(props) {
  if (!props.document) {
    return false
  }

  return (
    <div style={{ paddingBottom: '20rem' }}>
      {new Array(props.document.numPages).fill(null).map((_, index) => (
        <div
          key={index}
          style={{
            position: 'relative',
            paddingBottom: '1.25rem'
          }}
        >
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
        </div>
      ))}
    </div>
  )
}
