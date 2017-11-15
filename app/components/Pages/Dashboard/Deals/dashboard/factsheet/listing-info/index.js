import React from 'react'
import Deal from '../../../../../../../models/Deal'
import Items from '../items'

const table = [
  {
    key: 'original_price',
    context: 'mls_context',
    contextField: 'list_price',
    approved: true,
    name: 'Original Price',
    dataType: 'currency',
    disabled: true,
    canEdit: () => null
  },
  {
    key: 'list_price',
    name: 'List Price',
    dataType: 'currency',
    canEdit: (isBO) => isBO
  }, {
    key: 'property_type',
    name: 'Property Type',
    dataType: 'text',
    disabled: true,
    canEdit: () => null
  }, {
    key: 'file_id',
    name: 'File ID',
    dataType: 'text',
    canEdit: (isBO) => isBO
  }
]

const getValue = (deal, field) => {
  let value

  if (!field.context) {
    value = Deal.get.field(deal, field.key)
  } else {
    value = deal[field.context][field.contextField]
  }

  const object = {
    value,
    rawValue: value
  }

  if (field.dataType === 'currency') {
    object.value = Deal.get.formattedPrice(value)
  }

  return object
}

export default ({ deal }) => (
  <div className="deal-info-section">
    <Items
      deal={deal}
      title="Listing Information"
      table={table}
      getValue={getValue}
    />
  </div>
)
