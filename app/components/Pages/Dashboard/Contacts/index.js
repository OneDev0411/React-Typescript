import React from 'react'
import { connect } from 'react-redux'

import { isLoadedContactAttrDefs } from '../../../../reducers/contacts/attributeDefs'
import Loading from '../../../Partials/Loading'

import ContactsList from './List'
import { Container } from './components/Container'

function Contacts(props) {
  if (!isLoadedContactAttrDefs(props.attributeDefs)) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  return (
    <div className="contacts">
      <ContactsList />
    </div>
  )
}

const mapStateToProps = state => ({
  attributeDefs: state.contacts.attributeDefs
})

export default connect(mapStateToProps)(Contacts)
