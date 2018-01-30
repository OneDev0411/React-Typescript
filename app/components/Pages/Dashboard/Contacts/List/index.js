import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Avatar from 'react-avatar'
import _ from 'underscore'
import Contact from '../../../../../models/Contact'
import {
  upsertAttributes,
  removeImportResult
} from '../../../../../store_actions/contact'
import Stage from '../components/Stage'
import NoContact from './no-contact'
import Header from './header'
import ImportResultModal from './ImportResultModal'
import ReactTable from 'react-table'

function openContact(id) {
  browserHistory.push(`/dashboard/contacts/${id}`)
}

const ContactsList = ({
  contacts,
  user,
  loadingImport,
  importInfo,
  removeImportResult,
  upsertAttributes
}) => {
  const onChangeStage = (stage, contact, upsertAttributes) => {
    upsertAttributes(contact.id, 'stage', [
      {
        id: Contact.get.stage(contact).id,
        type: 'stage',
        stage
      }
    ])
  }
  const columns = [
    {
      Header: () => (
        <Fragment>
          Name
          <i className="fa fa-caret-down" />
          <i className="fa fa-caret-up" />
        </Fragment>
      ),
      id: 'name',
      accessor: contact => Contact.get.name(contact),
      Cell: ({ original: contact }) => {
        return (
          <div className="name">
            <Avatar
              className="avatar"
              round
              name={Contact.get.name(contact)}
              src={Contact.get.avatar(contact)}
              size={35}
            />
            <span className="contact-name">{Contact.get.name(contact)}</span>
          </div>
        )
      }
    },
    {
      Header: () => (
        <Fragment>
          EMAIL
          <i className="fa fa-caret-down" />
          <i className="fa fa-caret-up" />
        </Fragment>
      ),
      id: 'email',
      accessor: contact => Contact.get.email(contact),
      Cell: ({ original: contact }) => Contact.get.email(contact)
    },
    {
      Header: 'PHONE',
      id: 'phone',
      accessor: contact => Contact.get.phone(contact),
      Cell: ({ original: contact }) => Contact.get.phone(contact)
    },
    {
      Header: () => (
        <Fragment>
          STAGE
          <i className="fa fa-caret-down" />
          <i className="fa fa-caret-up" />
        </Fragment>
      ),
      id: 'stage',
      accessor: contact => Contact.get.stage(contact).name,
      className: 'td--stage-container',
      Cell: ({ original: contact }) => (
        <Stage
          default={Contact.get.stage(contact).name}
          onChange={stage => onChangeStage(stage, contact, upsertAttributes)}
        />
      )
    },
    {
      Header: () => (
        <Fragment>
          SOURCE
          <i className="fa fa-caret-down" />
          <i className="fa fa-caret-up" />
        </Fragment>
      ),
      id: 'source',
      accessor: contact => Contact.get.source(contact).label,
      Cell: ({ original: contact }) => Contact.get.source(contact).label
    }
  ]

  return (
    <div className="list">
      <Header
        user={user}
        contactsCount={_.size(contacts)}
        onNewContact={id => openContact(id)}
      />
      {loadingImport && (
        <i className="fa fa-spinner fa-pulse fa-fw fa-3x spinner__loading" />
      )}
      <NoContact
        user={user}
        contactsCount={_.size(contacts)}
        onNewContact={id => openContact(id)}
      />
      <ReactTable
        className="list-table"
        defaultPageSize={Object.keys(contacts).length}
        showPaginationBottom={false}
        data={Object.values(contacts)}
        columns={columns}
        getTdProps={(state, rowInfo) => ({
          onClick: () => openContact(rowInfo.original.id)
        })}
      />

      <ImportResultModal importInfo={importInfo} closeModal={removeImportResult} />
    </div>
  )
}
export default connect(
  ({ contacts, user }) => ({
    contacts: contacts.list,
    user,
    loadingImport: contacts.spinner,
    importInfo: contacts.importCsv
  }),
  { upsertAttributes, removeImportResult }
)(ContactsList)
