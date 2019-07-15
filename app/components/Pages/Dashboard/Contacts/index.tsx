import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Helmet } from 'react-helmet'

import {
  IAttributeDefsState,
  isLoadedContactAttrDefs
} from '../../../../reducers/contacts/attributeDefs'
import Loading from '../../../../views/components/Spinner'
import { hasUserAccess } from '../../../../utils/user-teams'

import ContactsList from './List'
import { Container } from './components/Container'

interface Props {
  attributeDefs: IAttributeDefsState
  user: IUser
}

class Contacts extends React.Component<Props> {
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
        <div style={{ marginRight: 0, minHeight: '100vh' }}>
          <ContactsList />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  attributeDefs: state.contacts.attributeDefs as IAttributeDefsState
})

export default connect(mapStateToProps)(Contacts)
