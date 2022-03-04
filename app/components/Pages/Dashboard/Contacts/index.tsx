import { Component } from 'react'

import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { selectActiveTeamUnsafe } from '@app/selectors/team'
import { getAttributeDefs } from 'actions/contacts'
import { IAppState } from 'reducers'
import { hasUserAccessToCrm } from 'utils/acl'

import {
  IAttributeDefsState,
  isLoadedContactAttrDefs
} from '../../../../reducers/contacts/attributeDefs'
import Loading from '../../../../views/components/Spinner'

import { Container } from './components/Container'
import ContactsList from './List'

interface Props {
  getAttributeDefs: IAsyncActionProp<typeof getAttributeDefs>
  attributeDefs: IAttributeDefsState
  user: IUser
  activeTeam: Nullable<IUserTeam>
}

class Contacts extends Component<Props> {
  componentDidMount() {
    const { activeTeam, attributeDefs, getAttributeDefs } = this.props
    const hasCrmAccess = hasUserAccessToCrm(activeTeam)

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
      <>
        <Helmet>
          <title>Contacts | Rechat</title>
        </Helmet>
        <div style={{ marginRight: 0, minHeight: '100vh', height: '100%' }}>
          <ContactsList />
        </div>
      </>
    )
  }
}

const mapStateToProps = (state: IAppState) => ({
  activeTeam: selectActiveTeamUnsafe(state),
  attributeDefs: state.contacts.attributeDefs as IAttributeDefsState
})
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    getAttributeDefs: () => dispatch(getAttributeDefs())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Contacts)
