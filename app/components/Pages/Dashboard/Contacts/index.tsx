import React from 'react'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { browserHistory } from 'react-router'
import { Helmet } from 'react-helmet'

import { IAppState } from 'reducers'

import { getAttributeDefs } from 'actions/contacts'

import {
  IAttributeDefsState,
  isLoadedContactAttrDefs
} from '../../../../reducers/contacts/attributeDefs'
import Loading from '../../../../views/components/Spinner'
import { hasUserAccess } from '../../../../utils/user-teams'

import ContactsList from './List'
import { Container } from './components/Container'

interface Props {
  getAttributeDefs: IAsyncActionProp<typeof getAttributeDefs>
  attributeDefs: IAttributeDefsState
  user: IUser
}

class Contacts extends React.Component<Props> {
  componentDidMount() {
    const { user, attributeDefs, getAttributeDefs } = this.props
    const hasCrmAccess = hasUserAccess(user, 'CRM')

    if (!hasCrmAccess) {
      browserHistory.push('/dashboard/mls')
    }

    if (hasCrmAccess && !isLoadedContactAttrDefs(attributeDefs)) {
      getAttributeDefs()
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

const mapStateToProps = (state: IAppState) => ({
  attributeDefs: state.contacts.attributeDefs as IAttributeDefsState
})
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    getAttributeDefs: () => dispatch(getAttributeDefs())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Contacts)
