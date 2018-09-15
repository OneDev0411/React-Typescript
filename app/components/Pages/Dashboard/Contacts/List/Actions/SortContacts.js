import React from 'react'
import { BasicDropdown } from '../../../../../../views/components/BasicDropdown'

const itemsValues = [
  { label: 'Most Recent', value: 'updated_at' },
  { label: 'Last Touch', value: 'last_touch' },
  { label: 'Next Touch', value: 'next_touch' },
  { label: 'First name A-Z', value: 'display_name' },
  { label: 'First name Z-A', value: '-display_name' },
  { label: 'Last name A-Z', value: 'sort_field' },
  { label: 'Last name Z-A', value: '-sort_field' },
  { label: 'Created At', value: 'created_at' }
]

function itemToString(item) {
  return item.label
}

const SortContacts = ({ handleChangeOrder, isFetching }) => (
  <BasicDropdown
    maxHeight="auto"
    noBorder
    buttonSize="small"
    disabled={isFetching}
    buttonText="Sort by"
    items={itemsValues}
    itemToString={itemToString}
    onChange={({ value }) => {
      handleChangeOrder(value)
    }}
    menuStyle={{ right: 0, left: 'auto' }}
  />
)

export default SortContacts
