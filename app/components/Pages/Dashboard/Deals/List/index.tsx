import { connect } from 'react-redux'
import { WithRouterProps } from 'react-router'
import { useTitle } from 'react-use'

import { isBackOffice } from '@app/utils/user-teams'

import AgentTable from './Agent'
import BackOfficeTable from './BackOffice'

interface Props {
  isBackOffice: boolean
}

const List = ({ isBackOffice, ...rest }: Props & WithRouterProps) => {
  useTitle('Deals | Rechat')

  return (
    <div data-test="deals-list">
      {isBackOffice ? <BackOfficeTable {...rest} /> : <AgentTable {...rest} />}
    </div>
  )
}

function mapStateToProps({ user }) {
  return {
    isBackOffice: isBackOffice(user)
  }
}

export default connect(mapStateToProps)(List)
