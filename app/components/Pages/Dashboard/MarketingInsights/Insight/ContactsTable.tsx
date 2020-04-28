import React from 'react'

import Table from 'components/Grid/Table'
import ContactInfo from 'components/ContactInfo'
import MiniContact from 'components/MiniContact'

import { RenderProps } from 'components/Grid/Table/types'
import { useGridStyles } from 'components/Grid/Table/styles'

import { SortableColumnsType as SortFieldType } from './SortField'
import { ContactColumn, StyledBadge } from './styled'
import { contactsList } from './helpers'
import { ContactsListType } from './types'

interface ContactsPropsType {
  item: IEmailCampaign<IEmailCampaignAssociation>
  sortBy: SortFieldType
  onChangeSort: (field: SortFieldType) => void
}

const columns = [
  {
    id: 'contact',
    primary: true,
    width: '30%',
    accessor: (row: ContactsListType) => row.display_name,
    render: ({ row }: RenderProps<ContactsListType>) => (
      <ContactColumn>
        <div>
          <MiniContact data={row.original_data} type="insight">
            <ContactInfo data={row} />
          </MiniContact>
        </div>
      </ContactColumn>
    )
  },
  {
    id: 'bounce',
    accessor: (row: ContactsListType) => row.failed,
    render: ({ row }: RenderProps<ContactsListType>) =>
      row.failed > 0 && (
        <StyledBadge>Bounced {row.failed >= 2 && row.failed}</StyledBadge>
      )
  },
  {
    id: 'unsubscribe',
    accessor: (row: ContactsListType) => row.unsubscribed,
    render: ({ row }: RenderProps<ContactsListType>) =>
      row.unsubscribed > 0 && (
        <StyledBadge>
          Unsubscribed {row.unsubscribed >= 2 && row.unsubscribed}
        </StyledBadge>
      )
  },
  {
    id: 'opened',
    class: 'opaque',
    accessor: (row: ContactsListType) => row.opened,
    render: ({ row }: RenderProps<ContactsListType>) => (
      <span>Opened: {row.opened}</span>
    )
  },
  {
    id: 'clicked',
    class: 'opaque',
    accessor: (row: ContactsListType) => row.clicked,
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
