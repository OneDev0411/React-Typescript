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
import NoSearchResults from '../../../../Partials/no-search-results'

function openContact(id) {
  browserHistory.push(`/dashboard/contacts/${id}`)
}

class ContactsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: ''
    }
    this.columns = [
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
            onChange={stage =>
              this.onChangeStage(stage, contact, props.upsertAttributes)
            }
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
  }

  onChangeStage = (stage, contact, upsertAttributes) => {
    upsertAttributes(contact.id, 'stage', [
      {
        id: Contact.get.stage(contact).id,
        type: 'stage',
        stage
      }
    ])
  }

  onInputChange = filter => this.setState({ filter })
  applyFilters(contact) {
    let matched = false
    const { filter } = this.state
    let regex = new RegExp(
      /// First some charater that break the regex are removed
      filter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'),
      'i'
    )

    if (regex.test(Contact.get.name(contact))) {
      matched = true
    }

    if (!matched && Object.keys(Contact.get.emails(contact)).length !== 0) {
      matched = _.some(Contact.get.emails(contact), item => regex.test(item.email))
    }

    if (!matched && Object.keys(Contact.get.phones(contact)).length !== 0) {
      matched = _.some(Contact.get.phones(contact), item =>
        item.phone_number.includes(filter)
      )
    }

    if (!matched && Object.keys(Contact.get.tags(contact)).length !== 0) {
      matched = _.some(Contact.get.tags(contact), item => regex.test(item.tag))
    }

    return matched
  }
  render() {
    const {
      contacts,
      user,
      loadingImport,
      importInfo,
      removeImportResult
    } = this.props
    const filteredContacts = _.filter(contacts, contact =>
      this.applyFilters(contact)
    )

    if (_.size(contacts) === 0) {
      return (
        <div className="list">
          <NoContact
            user={user}
            contactsCount={_.size(contacts)}
            onNewContact={id => openContact(id)}
          />
        </div>
      )
    }

    return (
      <div className="list">
        <Header
          user={user}
          contactsCount={_.size(contacts)}
          onNewContact={id => openContact(id)}
          onInputChange={this.onInputChange}
        />
        {loadingImport && (
          <i className="fa fa-spinner fa-pulse fa-fw fa-3x spinner__loading" />
        )}
        {_.size(filteredContacts) === 0 ? (
          <NoSearchResults description="Try typing another name, email, phone or tag." />
        ) : (
          <ReactTable
            className="list-table"
            pageSize={Object.keys(filteredContacts).length}
            showPaginationBottom={false}
            data={Object.values(filteredContacts)}
            columns={this.columns}
            getTdProps={(state, rowInfo) => ({
              onClick: () => openContact(rowInfo.original.id)
            })}
          />
        )}
        <ImportResultModal importInfo={importInfo} closeModal={removeImportResult} />
      </div>
    )
  }
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
