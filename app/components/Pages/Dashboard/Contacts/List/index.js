import React from 'react'

import { useTheme } from '@material-ui/core'

import { GridContextProvider } from 'components/Grid/Table/context/provider'
import { StateContext, DispatchContext } from 'components/Grid/Table/context'

import Container from './Container'

export default function ContactsList(props) {
  const theme = useTheme()

  return (
    <GridContextProvider>
      <StateContext.Consumer>
        {state => (
          <DispatchContext.Consumer>
            {dispatch => (
              <Container
                theme={theme}
                gridStateContext={state}
                gridDispatchContext={dispatch}
                {...props}
              />
            )}
          </DispatchContext.Consumer>
        )}
      </StateContext.Consumer>
    </GridContextProvider>
  )
}
