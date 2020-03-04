import React from 'react'

import Table from 'components/Grid/Table'
import ContactInfo from 'components/ContactInfo'
import MiniContact from 'components/MiniContact'

import { RenderProps } from 'components/Grid/Table/types'
import { useGridStyles } from 'components/Grid/Table/styles'

import { SortableColumnsType as SortFieldType } from './SortField'
import RowBadges from './RowBadges'
import { ContactColumn } from './styled'
import { contactsList } from './helpers'
import { ContactsListType } from './types'

interface ContactsPropsType {
  item: IEmailCampaign<IEmailCampaignAssociation>
  sortBy: SortFieldType
  onChangeSort: (field: SortFieldType) => void
}

const columns = [
  {
    header: 'Contact',
    id: 'contact',
    primary: true,
    width: '60%',
    render: ({ row }: RenderProps<ContactsListType>) => (
      <ContactColumn>
        <div>
          <MiniContact data={row.original_data} type="insight">
            <ContactInfo data={row} />
          </MiniContact>
        </div>
        <div className="labels-container">
          <RowBadges data={row} />
        </div>
      </ContactColumn>
    )
  },
  {
    header: 'Opened',
    id: 'opened',
    width: '20%',
    render: ({ row }: RenderProps<ContactsListType>) => (
      <span>Opened: {row.opened}</span>
    )
  },
  {
    header: 'Clicked',
    id: 'clicked',
    width: '20%',
    render: ({ row }: RenderProps<ContactsListType>) => (
      <span>Clicked: {row.clicked}</span>
    )
  }
]

function ContactsTable({ item, sortBy, onChangeSort }: ContactsPropsType) {
  const gridClasses = useGridStyles()
  const rows = contactsList(item)

  return (
    <Table<ContactsListType>
      rows={rows}
      totalRows={(rows || []).length}
      columns={columns}
      classes={{
        row: gridClasses.row
      }}
      sorting={{
        sortBy: {
          value: sortBy.value,
          ascending: sortBy.ascending
        },
        onChange: onChangeSort
      }}
    />
  )
}

export default ContactsTable
