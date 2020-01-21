import React from 'react'

import Table from 'components/Grid/Table'
import ContactInfo from 'components/ContactInfo'
import MiniContact from 'components/MiniContact'

import { RenderProps } from 'components/Grid/Table/types'

import RowBadges from './RowBadges'
import { ContactColumn } from './styled'
import { contactsList, SortValues } from './helpers'
import { ContactsListType } from './types'

interface TableColumnProps {
  rowData: ContactsListType
}
interface ContactsPropsType {
  item: IEmailCampaign<IEmailCampaignAssociation>
}

const sortableColumns = [
  { label: 'Name A-Z', value: SortValues.ALPHABETICAL, ascending: true },
  { label: 'Name Z-A', value: SortValues.ALPHABETICAL, ascending: false },
  { label: 'Bounced', value: SortValues.BOUNCED, ascending: true },
  { label: 'Unsubscribed', value: SortValues.UNSUBSCRIBED, ascending: true },
  { label: 'Most Clicked', value: SortValues.MOST_CLICKED, ascending: false },
  { label: 'Less Clicked', value: SortValues.MOST_CLICKED, ascending: true },
  { label: 'Most Opened', value: SortValues.MOST_OPENED, ascending: false },
  { label: 'Less Opened', value: SortValues.MOST_OPENED, ascending: true }
]

const columns = [
  {
    header: 'Contact',
    id: 'contact',
    primary: true,
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
    render: ({ row }: RenderProps<ContactsListType>) => (
      <span>{row.opened}</span>
    )
  },
  {
    header: 'Clicked',
    id: 'clicked',
    render: ({ row }: RenderProps<ContactsListType>) => (
      <span>{row.clicked}</span>
    )
  }
]

function ContactsTable(props: ContactsPropsType) {
  const rows = contactsList(props.item)

  console.log(rows)

  return (
    <Table<ContactsListType>
      rows={rows}
      totalRows={(rows || []).length}
      columns={columns}
      sorting={{
        defaultSort: {
          label: 'Most Opened',
          value: SortValues.MOST_OPENED,
          ascending: false
        },
        columns: sortableColumns
      }}
    />
  )
}

export default ContactsTable
