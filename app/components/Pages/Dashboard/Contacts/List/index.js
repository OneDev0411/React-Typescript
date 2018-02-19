import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Avatar from 'react-avatar'
import _ from 'underscore'
import Contact from '../../../../../models/Contact'
import Stage from '../components/Stage'
import NoContact from './no-contact'
import Header from './header'
import ReactTable from 'react-table'
import NoSearchResults from '../../../../Partials/no-search-results'
import { selectContacts } from '../../../../../reducers/contacts/list'
import { upsertContactAttributes } from '../../../../../store_actions/contacts'

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
        Cell: ({ original: contact }) => (
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
        className: 'td--dropdown-container',
        Cell: ({ original: contact }) => (
          <Stage
            defaultTitle={Contact.get.stage(contact).name}
            handleOnSelect={stage =>
              this.onChangeStage(stage, contact, props.upsertContactAttributes)
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

  onChangeStage = (stage, contact, handler) => {
    const { id: contactId } = contact
    const attributes = [
      {
        id: Contact.get.stage(contact).id,
        type: 'stage',
        stage
      }
    ]

    handler({ contactId, attributes })
  }

  onInputChange = filter => this.setState({ filter })

  applyFilters = contact => {
    let matched = false
    const { filter } = this.state
    let regex = new RegExp(
      // / First reomoving some charater that break the regex
      filter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'),
      'i'
    )

    if (regex.test(Contact.get.name(contact))) {
      matched = true
    }

    if (!matched && Object.keys(Contact.get.emails(contact)).length !== 0) {
      matched = _.some(Contact.get.emails(contact), item =>
        regex.test(item.email)
      )
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
    const { contactsList, user, loadingImport } = this.props
    const contactsCount = contactsList.length

    if (contactsCount === 0) {
      return (
        <div className="list">
          <NoContact
            user={user}
            contactsCount={contactsCount}
            onNewContact={id => openContact(id)}
          />
        </div>
      )
    }

    const filteredContacts = contactsList.filter(contact =>
      this.applyFilters(contact)
    )

    return (
      <div className="list">
        <Header
          user={user}
          contactsCount={contactsCount}
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
      </div>
    )
  }
}

function mapStateToProps({ user, contacts }) {
  const { list, spinner: loadingImport } = contacts
  const contactsList = selectContacts(list)

  return {
    user,
    contactsList,
    loadingImport
  }
}

export default connect(mapStateToProps, { upsertContactAttributes })(
  ContactsList
)
