import { memo } from 'react'

import { useTitle } from 'react-use'

import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import Layout from '../../List/Layout'

import SocialPostTable from './SocialPostTable'

function SocialPostList(props) {
  useTitle('Social Post List | Rechat')

  const isAdmin = useAcl(ACL.ADMIN)

  const renderContent = props => <SocialPostTable {...props} />

  return (
    <Layout
      renderContent={props => renderContent(props)}
      hasSortFilter={isAdmin}
    />
  )
}

export default memo(SocialPostList)
