import React, { Fragment } from 'react'
import { Field } from 'react-final-form'

import searchAgents from 'models/agent/search'

import { AutoCompleteInput } from '../AutoCompleteInput'

async function searchByMlsId(mls, minLength = 6) {
  if (!mls || mls.length < minLength) {
    return false
  }

  try {
    const agent = await searchAgents(mls)

    return [
      {
        ...agent,
        value: agent.mlsid,
        label: agent.full_name
      }
    ]
  } catch (e) {
    /* nothing */
  }
}

export function MlsInput(props) {
  return (
    <Fragment>
      <AutoCompleteInput
        {...props}
        options={searchByMlsId}
        searchConfiguration={{
          keys: ['value']
        }}
      />

      {/* <Field name="agent" render={() => null} /> */}
    </Fragment>
  )
}
