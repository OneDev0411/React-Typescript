import React from 'react'

import { Tabs } from '@material-ui/core'
import { Field } from 'react-final-form'

import { Tab } from 'components/PageTabs/Tab'

import { TYPE_PERSON, TYPE_COMPANY } from '../../../constants/role-types'

interface Props {
  label: string
  name: string
  selectedValue: 'Person' | 'Organization'
}

export function TypeInput(props: Props) {
  return (
    <Field
      name={props.name}
      render={({ input }) => (
        <Tabs
          value={input.value || TYPE_PERSON}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_, value) => input.onChange(value)}
          aria-label="disabled tabs example"
        >
          <Tab label="Person" value={TYPE_PERSON} />
          <Tab label="Company / Trust" value={TYPE_COMPANY} />
        </Tabs>
      )}
    />
  )
}
