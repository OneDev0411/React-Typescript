import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { changeActiveFilterSegment } from 'actions/filter-segments/change-active-segment'

import { getDuplicatesContacts } from 'models/contacts/get-duplicates-contacts'
import { fetchContactDuplicate } from 'models/contacts/get-conact-cluster-duplicates'

import {
  Container as PageContainer,
  Menu as SideMenu,
  Content as PageContent,
  Trigger as MenuTrigger
} from 'views/components/SlideMenu'
import SavedSegments from 'views/components/Grid/SavedSegments/List'
import { resetGridSelectedItems } from 'views/components/Grid/Table/Plugins/Selectable'
import PageHeader from 'components/PageHeader'

import DuplicateContacts from '../components/DuplicateContacts'

import Table from './Table'
import { NoDuplicateContacts } from './NoDuplicateContacts'

class ContactsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSideMenuOpen: true,
      isFetchingContacts: true,
      duplicateContacts: []
    }
  }

  componentDidMount() {
    if (this.props.filterSegments.activeSegmentId !== 'duplicate contacts') {
      this.props.changeActiveFilterSegment('contacts', 'duplicate contacts')
    }

    this.fetchContacts()
  }

  componentWillUnmount() {
    if (this.props.filterSegments.activeSegmentId === 'duplicate contacts') {
      this.props.changeActiveFilterSegment('contacts', 'default')
    }
  }

  setIsFetching = isFetchingContacts => this.setState({ isFetchingContacts })

  fetchContacts = async () => {
    this.setIsFetching(true)

    this.resetSelectedRows()

    try {
      const response = await getDuplicatesContacts()

      this.setState({ duplicateContacts: response.data })
    } catch (e) {
      console.log('fetch contacts error: ', e)
    }

    this.setIsFetching(false)
  }

  fetchContactDuplicate = async (contactId, refId) => {
    this.setIsFetching(true)

    this.resetSelectedRows()

    try {
      const response = await fetchContactDuplicate(contactId)
      let newDuplicateContacts

      if (response.data.id) {
        newDuplicateContacts = this.state.duplicateContacts.map(
          item => (item.id === refId ? response.data : item)
        )
      } else {
        newDuplicateContacts = this.state.duplicateContacts.filter(
          item => item.id !== refId
        )
      }

      this.setState({ duplicateContacts: newDuplicateContacts })
    } catch (e) {
      console.log('fetch contacts error: ', e)
    }

    this.setIsFetching(false)
  }

  handleChangeSavedSegment = async segment => {
    this.props.changeActiveFilterSegment('contacts', segment.id)
    browserHistory.push('/dashboard/contacts')
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  resetSelectedRows = () => {
    resetGridSelectedItems('contacts')
  }

  get Data() {
    const { duplicateContacts } = this.state

    return duplicateContacts.map(data => ({
      key: data.id,
      refId: data.id,
      data: data.contacts.slice(1),
      header: data.contacts[0]
    }))
  }

  render() {
    const { isSideMenuOpen, isFetchingContacts } = this.state
    const zeroState = !isFetchingContacts && this.Data.length === 0

    return (
      <PageContainer isOpen={isSideMenuOpen}>
        <SideMenu isOpen={isSideMenuOpen} width="12.1em">
          <SavedSegments
            name="contacts"
            onChange={this.handleChangeSavedSegment}
          />
          <DuplicateContacts />
        </SideMenu>

        <PageContent>
          <PageHeader>
            <PageHeader.Title showBackButton={false}>
              <MenuTrigger
                isExpended={isSideMenuOpen}
                onClick={this.toggleSideMenu}
              />
              <PageHeader.Heading>Duplicate Contacts</PageHeader.Heading>
            </PageHeader.Title>
          </PageHeader>
          {zeroState ? (
            <NoDuplicateContacts />
          ) : (
            <Table
              data={this.Data}
              isFetching={isFetchingContacts}
              setIsFetching={this.setIsFetching}
              fetchContacts={this.fetchContacts}
              fetchContactDuplicate={this.fetchContactDuplicate}
              onChangeSelectedRows={this.onChangeSelectedRows}
            />
          )}
        </PageContent>
      </PageContainer>
    )
  }
}

function mapStateToUser({ contacts }) {
  return {
    filterSegments: contacts.filterSegments
  }
}

export default connect(
  mapStateToUser,
  {
    changeActiveFilterSegment
  }
)(ContactsList)
