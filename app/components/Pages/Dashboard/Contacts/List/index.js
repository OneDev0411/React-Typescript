import React from 'react'

import { GridContextProvider } from 'components/Grid/Table/context/provider'
import { StateContext, DispatchContext } from 'components/Grid/Table/context'

import Container from './Container'

export default function ContactsList(props) {
  return (
    <GridContextProvider>
      <StateContext.Consumer>
        {state => (
          <DispatchContext.Consumer>
            {dispatch => (
              <Container
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
