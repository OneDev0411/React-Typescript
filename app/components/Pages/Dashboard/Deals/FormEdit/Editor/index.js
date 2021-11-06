import React from 'react'

import { makeStyles } from '@material-ui/core'

import Annotations from './Annotations'
import { DefaultValues } from './DefaultValues'
import { DefaultValuesContextProvider } from './DefaultValues/Provider'
import PDFPage from './PdfPage'

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
      '& .button-visible-on-hover': {
        visibility: 'hidden'
      },
      '& .button-visible-on-hover:hover': {
        visibility: 'visible'
      },
      '& .input-with-template:hover + .button-visible-on-hover': {
        visibility: 'visible'
      },
      '& .field-unlinkable:hover + .button-visible-on-hover': {
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
              instructions={props.instructions}
              pageIndex={index}
              annotations={props.annotations}
              onValueUpdate={props.onValueUpdate}
              onInstructionUpdate={props.onInstructionUpdate}
            />
          </div>
        ))}

        <DefaultValues formId={props.form.id} />
      </div>
    </DefaultValuesContextProvider>
  )
}
