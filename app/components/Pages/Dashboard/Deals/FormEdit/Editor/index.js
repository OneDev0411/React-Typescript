import React from 'react'

import { makeStyles } from '@material-ui/core'

import PDFPage from './PdfPage'
import Annotations from './Annotations'
import { DefaultValues } from './DefaultValues'

const useStyles = makeStyles(
  () => ({
    root: {
      paddingBottom: '20rem'
    },
    pageContainer: {
      position: 'relative',
      paddingBottom: '1.25rem',

      /*
       * only show default value icon when hover overing on the related input
       */
      '& svg.icon-default-value': {
        visibility: 'hidden'
      },
      '& svg.icon-default-value:hover': {
        visibility: 'visible'
      },
      '& input:hover + svg.icon-default-value': {
        visibility: 'visible'
      }
    }
  }),
  {
    name: 'EdtiorPages'
  }
)

export default function Editor(props) {
  const classes = useStyles()

  if (!props.document) {
    return false
  }

  return (
    <div className={classes.root}>
      {new Array(props.document.numPages).fill(null).map((_, index) => (
        <div key={index} className={classes.pageContainer}>
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

      <DefaultValues />
    </div>
  )
}
