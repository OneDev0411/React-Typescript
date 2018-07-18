import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { isLoadedContactAttrDefs } from '../../../../../reducers/contacts/attributeDefs'
import Loading from '../../../../Partials/Loading'

import Header from './Header'
import NewContactForm from './Form'

export const PageContainer = styled.div`
  min-height: 100vh;
  background: #f0f4f7;
`

function NewContact(props) {
  return (
    <PageContainer>
      <Header />

      {isLoadedContactAttrDefs(props.attributeDefs) ? (
        <NewContactForm />
      ) : (
        <Loading />
      )}
    </PageContainer>
  )
}

const mapStateToProps = state => ({
  attributeDefs: state.contacts.attributeDefs
})

export default connect(mapStateToProps)(NewContact)
