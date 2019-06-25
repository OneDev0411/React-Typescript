import React, { useState } from 'react'
import Table from 'components/Grid/Table'
import ContactInfo from 'components/ContactInfo'

import RowBadges from './RowBadges'
import { ContactColumn } from './styled'
import { contactsList, SortValues, doSort } from './helpers'
import { ContactsListType } from './types'

const defaultSort = SortValues.ALPHABETICAL

interface TableColumnProps {
  rowData: ContactsListType
}
interface ContactsPropsType {
  item: IInsight
}

function ContactsTable(props: ContactsPropsType) {
  const [itemData, setItemData] = useState(
    doSort(contactsList(props.item), defaultSort)
  )
  const [sort, setSort] = useState(defaultSort)

  const columns = [
    {
      header: 'Contact',
      id: 'contact',
      width: '75%',
      verticalAlign: 'center',
      render: (props: TableColumnProps) => (
        <ContactColumn>
          <div>
            <ContactInfo data={props.rowData} />
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

  function sortHandler({ value }) {
    setSort(value)
    setItemData(doSort(itemData, value))
  }

  const sortableColumns = [
    { label: 'Alphabetical', value: SortValues.ALPHABETICAL },
    { label: 'Bounced', value: SortValues.BOUNCED },
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
          onChange: sortHandler
        }
      }}
    />
  )
}

export default ContactsTable
