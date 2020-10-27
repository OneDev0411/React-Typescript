import React from 'react'

import { makeStyles } from '@material-ui/core'

import PDFPage from './PdfPage'
import Annotations from './Annotations'
import { DefaultValues } from './DefaultValues'
import { DefaultValuesContextProvider } from './DefaultValues/Provider'

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
      '& .button-default-value': {
        visibility: 'hidden'
      },
      '& .button-default-value:hover': {
        visibility: 'visible'
      },
      '& .input-with-template:hover + .button-default-value': {
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
    <DefaultValuesContextProvider>
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

        <DefaultValues dealId={props.deal.id} formId={props.form.id} />
      </div>
    </DefaultValuesContextProvider>
  )
}
