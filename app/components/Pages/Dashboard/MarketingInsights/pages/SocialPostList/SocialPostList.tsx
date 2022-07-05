import { memo } from 'react'

import { useTitle } from 'react-use'

import Layout from '../../List/Layout'

import SocialPostTable from './SocialPostTable'

function SocialPostList() {
  useTitle('Instagram Post List | Rechat')

  const renderContent = props => <SocialPostTable {...props} />

  return <Layout renderContent={props => renderContent(props)} />
}

export default memo(SocialPostList)
