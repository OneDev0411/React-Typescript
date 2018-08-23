import React from 'react'
import { storiesOf } from '@storybook/react'
import { BasicDropdown } from '../../../app/views/components/BasicDropdown'

import { WrapStory } from '../../utils/WrapStory'

const normalizeItem = item => ({ label: item, value: item })
const simpleItems = ['Apple', 'Banana', 'Cucumber', 'Orange', 'Watermelon'].map(
  normalizeItem
)

function Basic() {
  function onChange(item) {
    console.log(`${item.label} selected.`)
  }

  return (
    <BasicDropdown
      items={simpleItems}
      defaultSelectedItem={simpleItems[0]}
      buttonStyle={{ width: 'auto' }}
      onChange={onChange}
    />
  )
}

export default () =>
  storiesOf('Dropdowns', module).add(
    'Basic',
    WrapStory(Basic, 'Basic (AKS Simple) Dropdown')
  )
