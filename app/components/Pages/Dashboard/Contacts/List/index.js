import React, { Fragment } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import ReactTable from 'react-table'
import Avatar from 'react-avatar'
import { Dropdown, MenuItem } from 'react-bootstrap'
import VerticalDotsIcon from '../../Partials/Svgs/VerticalDots'
import { confirmation } from '../../../../../store_actions/confirmation'
import Radio from '../../../../../views/components/radio'
import Contact from '../../../../../models/contacts'
import styled from 'styled-components'
import {
  selectContacts,
  isFetchingContactsList
} from '../../../../../reducers/contacts/list'
import { deleteContacts } from '../../../../../store_actions/contacts'

import Header from './header'
import ExportContacts from './ExportContacts'

import NoContact from './no-contact'
import Loading from '../../../../Partials/Loading'
import { Container } from '../components/Container'
import NoSearchResults from '../../../../Partials/no-search-results'
import ShadowButton from '../../../../../views/components/Button/ShadowButton'

function openContact(id) {
  browserHistory.push(`/dashboard/contacts/${id}`)
}

const SecondHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 2rem;
`
const SecondHeaderText = styled.p`
  font-size: 17px;
  margin-bottom: 0;
  margin-right: 8px;
`

class ContactsList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filter: '',
      deletingContacts: [],
      selectedRows: {}
    }

    this.columns = [
      {
        id: 'td-select',
        accessor: '',
        width: 40,
        sortable: false,
        Cell: ({ original: contact }) => (
          <Radio
            className="select-row"
            selected={this.state.selectedRows[contact.id]}
            onClick={e => {
              e.stopPropagation()
              this.toggleSelectedRow(contact)
            }}
          />
        )
      },
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
        accessor: contact => Contact.get.email(contact)
      },
      {
        Header: 'PHONE',
        id: 'phone',
        accessor: contact => Contact.get.phone(contact)
      },
      {
        Header: () => (
          <Fragment>
            TAGS
            <i className="fa fa-caret-down" />
            <i className="fa fa-caret-up" />
          </Fragment>
        ),
        id: 'tag',
        Cell: ({ original: contact }) => this.getTagsTitle(contact)
      },
      {
        id: 'td-delete',
        Header: '',
        accessor: '',
        // accessor: contact => contact.id,
        className: 'td--dropdown-container',
        width: 30,
        Cell: ({ original: contact }) => {
          const { id: contactId } = contact

          return (
            <Dropdown
              pullRight
              className="c-react-table-menu"
              id={`contact_${contactId}__dropdown`}
            >
              <ShadowButton
                bsRole="toggle"
                style={{ marginTop: '5px' }}
                onClick={e => e.stopPropagation()}
              >
                <VerticalDotsIcon fill="#D7DEE2" />
              </ShadowButton>

              <Dropdown.Menu bsRole="menu">
                <MenuItem
                  eventKey="Delete"
                  key={`contact_${contactId}__dropdown__item_delete`}
                  style={{ width: '100%', textAlign: 'left' }}
                  onClick={event => this.handleOnDelete(event, [contact.id])}
                >
                  Delete
                </MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          )
        }
      }
    ]

    this.handleOnDelete = this.handleOnDelete.bind(this)
  }

  handleOnDelete(event, contactIds) {
    event.stopPropagation()

    this.props.confirmation({
      show: true,
      confirmLabel: 'Delete',
      message: `Delete ${contactIds.length > 1 ? 'contacts' : 'contact'}`,
      onConfirm: () => this.handleDeleteContact({ contactIds }),
      description: `Are you sure you want to delete ${
        contactIds.length > 1 ? 'these contacts' : 'this contact'
      }?`
    })
  }

  async handleDeleteContact({ contactIds }) {
    this.setState({ deletingContacts: contactIds })

    const { deleteContacts } = this.props

    await deleteContacts(contactIds)
    this.setState({ deletingContacts: [] })
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

  getTagsTitle = contact => {
    const tags = Contact.get.tags(contact)

    if (Object.keys(tags).length === 0) {
      return <p style={{ color: '#8da2b5', marginBottom: 0 }}>No Tags</p>
    }

    let tagString = ''
    // We can't break forEach.
    let stopForeach = false

    Object.keys(tags).forEach((key, index) => {
      if (!stopForeach) {
        let tag = tags[key].tag

        // max kength 28 came from design
        if (tagString.length + tag.length <= 28) {
          tagString +=
            tag +
            // Add ', ' if it is not the last item in  the object
            (index !== Object.keys(tags).length - 1 ? ', ' : '')
        } else {
          stopForeach = true
          // remove the last ', '
          tagString = tagString.slice(0, -2)
          tagString += ` and ${Object.keys(tags).length - index} more`
        }
      }
    })

    return tagString
  }

  toggleSelectedRow = contact => {
    const { selectedRows } = this.state
    let newSelectedRows = {}

    if (selectedRows[contact.id]) {
      newSelectedRows = _.omit(selectedRows, row => row.id === contact.id)
    } else {
      newSelectedRows = {
        ...selectedRows,
        [contact.id]: contact
      }
    }

    this.setState({ selectedRows: newSelectedRows })
  }
  render() {
    const { deletingContacts, selectedRows } = this.state
    const { user, isFetching, contactsList, loadingImport } = this.props
    const contactsCount = contactsList.length

    if (isFetching && contactsCount === 0) {
      return (
        <Container>
          <Loading />
        </Container>
      )
    }

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
    const selectedRowsLength = Object.keys(selectedRows).length

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
          <Fragment>
            <SecondHeader>
              <SecondHeaderText>
                {selectedRowsLength > 0 ? `${selectedRowsLength} of ` : ''}
                {`${filteredContacts.length} Contacts`}
              </SecondHeaderText>
              <ExportContacts selectedRows={selectedRows} />
              {selectedRowsLength > 0 && (
                <div className="list--secondary-button">
                  <button
                    className="button c-button--shadow"
                    onClick={event =>
                      this.handleOnDelete(event, Object.keys(selectedRows))
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </SecondHeader>
            <ReactTable
              className="contacts-list-table"
              pageSize={Object.keys(filteredContacts).length}
              showPaginationBottom={false}
              data={Object.values(filteredContacts)}
              columns={this.columns}
              getTrProps={(state, { original: { id: contactId } }) => {
                if (deletingContacts.includes(contactId)) {
                  return {
                    style: {
                      opacity: 0.5,
                      ponterEvents: 'none'
                    }
                  }
                }

                return {
                  onClick: () => openContact(contactId)
                }
              }}
            />
          </Fragment>
        )}
      </div>
    )
  }
}

function mapStateToProps({ user, contacts }) {
  const { list, spinner: loadingImport } = contacts
  const contactsList = selectContacts(list)
  const isFetching = isFetchingContactsList(list)

  return {
    user,
    isFetching,
    contactsList,
    loadingImport
  }
}

export default connect(mapStateToProps, {
  confirmation,
  deleteContacts
})(ContactsList)
