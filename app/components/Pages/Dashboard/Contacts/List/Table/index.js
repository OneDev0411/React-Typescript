import React, { useState } from 'react'

import cn from 'classnames'
import { makeStyles, useTheme } from '@material-ui/core'

import { getAttributeFromSummary } from 'models/contacts/helpers'

import { Table } from 'components/Grid/Table'

import { useGridStyles } from 'components/Grid/Table/styles'

import { goTo } from 'utils/go-to'

import { TableActions } from './Actions'

import TagsOverlay from '../../components/TagsOverlay'
import NoSearchResults from '../../../../../Partials/no-search-results'

import { LoadingComponent } from './components/LoadingComponent'
import { PARKED_CONTACTS_LIST_ID } from '../constants'

import Menu from './columns/Menu'
import Avatar from './columns/Avatar'
import Name from './columns/Name'
import CtaAction from './columns/Cta'
import TagsString from './columns/Tags'
import FlowCell from './columns/Flows'
import LastTouched from './columns/LastTouched'
import { UnparkContact } from './columns/UnparkContact'

const useCustomGridStyles = makeStyles(theme => ({
  row: {
    '& .column': {
      '&.tags': {
        '& .MuiChip-root': { opacity: 0.5 }
      },
      '&.flows': {
        '& a': { color: theme.palette.grey['500'] },
        '& svg': { fill: theme.palette.grey['500'] }
      }
    },
    '&:hover .column': {
      '&.tags': {
        '& .MuiChip-root': { opacity: 1 }
      },
      '&.flows': {
        '& a': { color: theme.palette.text.primary },
        '& svg': { fill: theme.palette.text.primary }
      }
    }
  }
}))

const ContactsList = props => {
  const gridClasses = useGridStyles()
  const customGridClasses = useCustomGridStyles()
  const [selectedTagContact, setSelectedTagContact] = useState([])
  const theme = useTheme()
  const isParkTabActive = props.activeSegment.id === PARKED_CONTACTS_LIST_ID

  const onSelectTagContact = selectedTagContact =>
    setSelectedTagContact([selectedTagContact])

  const closeTagsOverlay = () => setSelectedTagContact([])

  const columns = [
    {
      id: 'name',
      primary: true,
      width: '21%',
      accessor: contact => getAttributeFromSummary(contact, 'display_name'),
      render: ({ row: contact }) => <Name contact={contact} />
    },
    {
      id: 'cta',
      primary: true,
      width: '12%',
      class: 'visible-on-hover',
      render: ({ row: contact }) => <CtaAction contact={contact} />
    },
    {
      id: 'last_touched',
      sortable: false,
      width: '17%',
      class: 'opaque',
      render: ({ row: contact }) => <LastTouched contact={contact} />
    },
    {
      id: 'flows',
      sortable: false,
      width: '7%',
      class: 'opaque flows',
      render: ({ row: contact }) => (
        <FlowCell
          contactId={contact.id}
          callback={props.reloadContacts}
          flowsCount={Array.isArray(contact.flows) ? contact.flows.length : 0}
        />
      )
    },
    {
      id: 'tag',
      width: !isParkTabActive ? '34%' : '22%',
      class: 'opaque tags',
      render: ({ row: contact }) => (
        <TagsString contact={contact} onSelectTagContact={onSelectTagContact} />
      )
    },
    {
      id: 'unpark-contact',
      width: isParkTabActive ? '12%' : '0',
      class: 'opaque',
      render: ({ row: contact }) =>
        isParkTabActive ? (
          <UnparkContact
            contactId={contact.id}
            callback={props.reloadContacts}
          />
        ) : null
    },
    {
      id: 'delete-contact',
      sortable: false,
      width: '5%',
      class: 'visible-on-hover',
      render: ({ row: contact }) => (
        <Menu contactId={contact.id} handleOnDelete={props.onRequestDelete} />
      )
    }
  ]

  const getLoading = () => {
    const { isFetching, isFetchingMore, isFetchingMoreBefore } = props

    if (!isFetching && !isFetchingMore && !isFetchingMoreBefore) {
      return null
    }

    if (isFetching) {
      return 'middle'
    }

    if (isFetchingMore) {
      return 'bottom'
    }

    if (isFetchingMoreBefore) {
      return 'top'
    }
  }

  const getRowProps = ({ row: contact }) => {
    return {
      onClick: () => goTo(`/dashboard/contacts/${contact.id}`)
    }
  }
  const getColumnProps = ({ column }) => {
    if (
      [
        'name',
        'cta',
        'flows',
        'tag',
        'delete-contact',
        'unpark-contact'
      ].includes(column.id)
    ) {
      return {
        onClick: e => e.stopPropagation()
      }
    }
  }

  return (
    <>
      <Table
        rows={props.data}
        totalRows={props.totalRows}
        loading={getLoading()}
        columns={columns}
        LoadingStateComponent={LoadingComponent}
        getTrProps={getRowProps}
        getTdProps={getColumnProps}
        selection={{
          defaultRender: ({ row }) => <Avatar contact={row} />,
          columnProps: {
            width: theme.spacing(7)
          },
          showSelectAll: false
        }}
        classes={{
          row: cn(gridClasses.row, customGridClasses.row)
        }}
        infiniteScrolling={{
          onReachEnd: props.onRequestLoadMore,
          onReachStart: props.onRequestLoadMoreBefore
        }}
        TableActions={
          <TableActions
            filters={props.filters}
            isFetching={props.isFetching}
            totalRowsCount={props.listInfo.total}
            reloadContacts={props.reloadContacts}
            onRequestDelete={props.onRequestDelete}
            activeSegmentId={props.activeSegment.id}
            handleChangeContactsAttributes={
              props.handleChangeContactsAttributes
            }
          />
        }
        EmptyStateComponent={() => (
          <NoSearchResults description="Try typing another name, email, phone or tag." />
        )}
      />

      <TagsOverlay
        closeOverlay={closeTagsOverlay}
        isOpen={selectedTagContact.length > 0}
        selectedContactsIds={selectedTagContact}
        handleChangeContactsAttributes={props.handleChangeContactsAttributes}
      />
    </>
  )
}

export default ContactsList
