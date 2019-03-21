import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Helmet } from 'react-helmet'

import { isLoadedContactAttrDefs } from '../../../../reducers/contacts/attributeDefs'
import Loading from '../../../../views/components/Spinner'
import { hasUserAccess } from '../../../../utils/user-teams'

import ContactsList from './List'
import { Container } from './components/Container'

class Contacts extends React.Component {
  componentDidMount() {
    if (!hasUserAccess(this.props.user, 'CRM')) {
      browserHistory.push('/dashboard/mls')
    }
  }

  render() {
    if (!isLoadedContactAttrDefs(this.props.attributeDefs)) {
      return (
        <Container>
          <Loading />
        </Container>
      )
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Contacts | Rechat</title>
        </Helmet>
        <div className="contacts">
          <ContactsList />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  attributeDefs: state.contacts.attributeDefs
})

export default connect(mapStateToProps)(Contacts)
