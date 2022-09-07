import { useTitle } from 'react-use'

import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import AgentTable from './Agent'
import BackOfficeTable from './BackOffice'

const List = props => {
  const isBackOffice = useAcl(ACL.BACK_OFFICE)

  useTitle('Deals | Rechat')

  return (
    <div data-test="deals-list">
      {isBackOffice ? (
        <BackOfficeTable {...props} />
      ) : (
        <AgentTable {...props} />
      )}
    </div>
  )
}

export default List
