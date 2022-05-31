import React, { useMemo } from 'react'

import { Tooltip } from '@material-ui/core'

import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import ContactInfo from 'components/ContactInfo'
import Table from 'components/Grid/Table'
import { RenderProps } from 'components/Grid/Table/types'
import MiniContact from 'components/MiniContact'

import { hasPixelTracking } from '../List/helpers'

import { contactsList } from './helpers'
import { SortableColumnsType as SortFieldType } from './SortField'
import { ContactColumn, StyledBadge } from './styled'
import { ContactsListType } from './types'

interface ContactsPropsType {
  item: IEmailCampaign<'from' | 'emails' | 'recipients'>
  sortBy: SortFieldType
  onChangeSort: (field: SortFieldType) => void
}

function ContactsTable({ item, sortBy, onChangeSort }: ContactsPropsType) {
  const gridClasses = useGridStyles()
  const rows = contactsList(item)
  const pixelTracking = hasPixelTracking(item)

  const columns = useMemo(
    () => [
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
          (row.failed > 0 || row.error) && (
            <Tooltip title={row.error || ''}>
              <StyledBadge>Bounced {row.failed >= 2 && row.failed}</StyledBadge>
            </Tooltip>
          )
      },
      {
        id: 'unsubscribe',
        accessor: (row: ContactsListType) => row.unsubscribed,
        render: ({ row }: RenderProps<ContactsListType>) =>
          row.unsubscribed > 0 &&
          !pixelTracking && (
            <StyledBadge>
              Unsubscribed {row.unsubscribed >= 2 && row.unsubscribed}
            </StyledBadge>
          )
      },
      {
        id: 'opened',
        class: 'opaque',
        accessor: (row: ContactsListType) => row.opened,
        render: ({ row }: RenderProps<ContactsListType>) =>
          !pixelTracking && <span>Opened: {row.opened}</span>
      },
      {
        id: 'clicked',
        class: 'opaque',
        accessor: (row: ContactsListType) => row.clicked,
        render: ({ row }: RenderProps<ContactsListType>) =>
          !pixelTracking && <span>Clicked: {row.clicked}</span>
      }
    ],
    [pixelTracking]
  )

  return (
    <Table<ContactsListType>
      rows={rows}
      totalRows={(rows || []).length}
      columns={columns}
      classes={{ row: gridClasses.row }}
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
