import React, { useState, useEffect } from 'react'

import Table from 'components/Grid/Table'
import ContactInfo from 'components/ContactInfo'
import MiniContact from 'components/MiniContact'

import RowBadges from './RowBadges'
import { ContactColumn } from './styled'
import { contactsList, SortValues, doSort } from './helpers'
import { ContactsListType } from './types'

const defaultSort = SortValues.MOST_OPENED

interface TableColumnProps {
  rowData: ContactsListType
}
interface ContactsPropsType {
  item: IEmailCampaign<IEmailCampaignAssociation>
}

function ContactsTable(props: ContactsPropsType) {
  const [itemData, setItemData] = useState<ContactsListType[]>([])
  const [sort, setSort] = useState(defaultSort)

  // This is weird? For sure. Seems we have a bug on Grid plugins which
  // doesn't work properly on first mount, so this is a workaround :(
  useEffect(() => {
    const list = doSort(contactsList(props.item), sort)

    setItemData(list)
  }, [sort, props.item])

  const columns = [
    {
      header: 'Contact',
      id: 'contact',
      width: '75%',
      verticalAlign: 'center',
      render: (props: TableColumnProps) => (
        <ContactColumn>
          <div>
            <MiniContact data={props.rowData.original_data} type="insight">
              <ContactInfo data={props.rowData} />
            </MiniContact>
          </div>
          <div className="labels-container">
            <RowBadges data={props.rowData} />
          </div>
        </ContactColumn>
      )
    },
    {
      header: 'Opened',
      id: 'opened',
      verticalAlign: 'center',
      render: props => <span>{props.rowData.opened}</span>
    },
    {
      header: 'Clicked',
      id: 'clicked',
      verticalAlign: 'center',
      render: props => <span>{props.rowData.clicked}</span>
    }
  ]

  const sortableColumns = [
    { label: 'Name A-Z', value: SortValues.ALPHABETICAL },
    { label: 'Bounced', value: SortValues.BOUNCED },
    { label: 'Unsubscribed', value: SortValues.UNSUBSCRIBED },
    { label: 'Most Clicked', value: SortValues.MOST_CLICKED },
    { label: 'Most Opened', value: SortValues.MOST_OPENED }
  ]

  return (
    <Table
      data={itemData}
      columns={columns}
      plugins={{
        sortable: {
          columns: sortableColumns,
          defaultIndex: sort,
          onChange: ({ value }) => setSort(value)
        }
      }}
    />
  )
}

export default ContactsTable
