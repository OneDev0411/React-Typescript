import React from 'react'
import Flex from 'styled-flex-component'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { getContactOriginalSourceTitle } from 'utils/get-contact-original-source-title'

import { getAttributeFromSummary } from 'models/contacts/helpers'
import { mergeMultipleContacts } from 'models/contacts/merge-multiple-contatcs'

import { confirmation } from 'store_actions/confirmation'

import ActionButton from 'components/Button/ActionButton'
import Merge from 'components/SvgIcons/Merge/IconMerge'
import Table from 'components/Grid/Table'
import ArrowLeftTopIcon from 'components/SvgIcons/ArrowLeftTop/ArrowLeftTopIcon'

import { getContactsJob } from 'models/contacts/get-contacts-job'

import { TruncatedColumn } from '../../List/Table/styled'
import Name from '../../List/Table/columns/Name'
import { LoadingComponent } from '../../List/Table/components/LoadingComponent'
import { Contact } from '../../List/Table/columns/Contact'
import DuplicateHeader from './DuplicateHeader'

const mergeColumnWidth = '160px'

const IconMerge = styled(Merge)`
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

class DuplicateContactsList extends React.Component {
  state = { selected: [] }

  columns = [
    {
      header: 'Name',
      id: 'name',
      verticalAlign: 'center',
      render: ({ rowData: contact, subHeader }) => (
        <Flex alignCenter>
          {!subHeader && (
            <ArrowLeftTopIcon style={{ marginRight: '16px', minWidth: '0' }} />
          )}
          <Name contact={contact} />
        </Flex>
      )
    },
    {
      header: 'Contact',
      id: 'contact',
      render: ({ rowData: contact }) => <Contact contact={contact} />
    },
    {
      header: 'Source',
      id: 'source',

      render: ({ rowData: contact }) => (
        <TruncatedColumn>
          {getContactOriginalSourceTitle(
            getAttributeFromSummary(contact, 'source_type')
          )}
        </TruncatedColumn>
      )
    },
    {
      header: 'Created on',
      id: 'created_on',
      render: ({ rowData: contact }) => (
        <TruncatedColumn>
          {new Date(contact.created_at * 1000).toLocaleDateString()}
        </TruncatedColumn>
      )
    },

    {
      id: 'merge-contact',
      header: 'Merge Contacts',
      width: mergeColumnWidth
    }
  ]

  actions = [
    {
      render: () => (
        <ActionButton
          appearance="outline"
          size="small"
          onClick={this.onMergeClick}
        >
          <IconMerge />
          {this.state.selected.length === 0 ||
          this.totalContactLength === this.selectedRowLength
            ? 'Merge All'
            : 'Merge Selected'}
        </ActionButton>
      )
    }
  ]

  onMergeClick = () => {
    this.props.confirmation({
      message: `Merge ${this.selectedRowLength ||
        this.totalContactLength} Contacts?`,
      description:
        'The selected contacts will be merged into one contact.\n' +
        'Are you sure you want to continue?',
      confirmLabel: 'Yes, merge',
      onConfirm: this.onMerge
    })
  }

  onMerge = async () => {
    const { setIsFetching, data, fetchContacts } = this.props
    const { selected } = this.state

    setIsFetching(true)

    let clusters

    if (selected.length === 0) {
      clusters = data.map(temp => ({
        parent: temp.header.id,
        sub_contacts: temp.data.map(({ id }) => id)
      }))
    } else {
      clusters = data
        .filter(({ data }) => data.some(({ id }) => selected.includes(id)))
        .map(temp => ({
          parent: temp.header.id,
          sub_contacts: temp.data
            .filter(({ id }) => selected.includes(id))
            .map(({ id }) => id)
        }))
    }

    const { data: mergeResponse } = await mergeMultipleContacts(clusters)

    const run = async () => {
      const { data: jobStatus } = await getContactsJob(mergeResponse.job_id)

      if (jobStatus.state === 'active' || jobStatus.state === 'inactive') {
        setTimeout(run, 3000)
      } else if (
        jobStatus.state === 'complete' ||
        jobStatus.state === 'failed'
      ) {
        if (jobStatus.state === 'failed') {
          console.log('job status: ', jobStatus)
        }

        fetchContacts()
      }
    }

    setTimeout(run, 1000)
    this.onSelectedChanged([])
    await fetchContacts()
  }

  onSelectedChanged = selected => this.setState({ selected })

  get totalContactLength() {
    return this.props.data.reduce(
      (accumulator, currentValue) => accumulator + currentValue.data.length + 1,
      0
    )
  }

  get selectedRowLength() {
    return this.props.data.reduce((accumulator, currentValue) => {
      const sectionSelectedRows = currentValue.data.filter(({ id }) =>
        this.state.selected.includes(id)
      ).length

      return (
        accumulator + sectionSelectedRows + (sectionSelectedRows > 0 ? 1 : 0)
      )
    }, 0)
  }

  render() {
    const { selected } = this.state

    return (
      <div style={{ padding: '0 1.5em' }}>
        <Table
          plugins={{
            selectable: {
              persistent: true,
              storageKey: 'contacts',
              onChange: this.onSelectedChanged
            },
            actionable: {
              actions: this.actions
            }
          }}
          summary={{
            entityName: 'Contacts',
            total: this.totalContactLength,
            selectedRowsCount: this.selectedRowLength
          }}
          multiple
          noCheckboxInHeader
          subHeaderCheckbox
          data={this.props.data}
          isFetching={this.props.isFetching}
          columns={this.columns}
          LoadingState={LoadingComponent}
          SubComponent={({ header, data, columns, refId }) => (
            <DuplicateHeader
              refId={refId}
              header={header}
              data={data}
              columns={columns}
              selected={selected}
              mergeColumnWidth={mergeColumnWidth}
              setIsFetching={this.props.setIsFetching}
              fetchContactDuplicate={this.props.fetchContactDuplicate}
            />
          )}
        />
      </div>
    )
  }
}

export default connect(
  null,
  {
    confirmation
  }
)(DuplicateContactsList)
