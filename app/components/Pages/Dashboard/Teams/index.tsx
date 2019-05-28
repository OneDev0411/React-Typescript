import { connect } from 'react-redux'

import * as React from 'react'

import { Helmet } from 'react-helmet'

import styled from 'styled-components'

import { RouteComponentProps } from 'react-router'

import { Container, Content, Menu } from 'components/SlideMenu'
import ALink from 'components/ALink'

import TreeView from 'components/TreeView'
import { H4 } from 'components/Typography/headings'
import Spinner from 'components/Spinner'
import { primary } from 'views/utils/colors'

import Search from 'components/Grid/Search'

import { findNode } from 'utils/tree-utils'

import { TeamsSearch } from './styled'
import { TeamView } from './TeamView'
import { useTeamsPage } from './use-teams-page.hook'

type Props = {
  user: any
} & RouteComponentProps<{ id: string }, {}>

const getId = team => team.id

function TeamsPage(props: Props) {
  const {
    rootTeam,
    error,
    loading,
    updatingUserIds,
    updateRoles,
    getChildNodes,
    initialExpandedNodes
  } = useTeamsPage(props.user)

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <div>Error</div> // TODO
  }

  if (rootTeam) {
    const selectedTeam =
      (props.params.id &&
        findNode(getChildNodes, team => team.id === props.params.id)) ||
      rootTeam

    return (
      <React.Fragment>
        <Helmet>
          <title>Teams</title>
        </Helmet>
        <Container isOpen>
          <Menu isOpen width="25rem">
            <H4>Teams Management</H4>

            <TeamsSearch>
              <Search
                placeholder="Search for teams and agents"
                onChange={value => console.log(value)}
              />
            </TeamsSearch>
            <TreeView
              getChildNodes={getChildNodes}
              selectable
              initialExpandedNodes={initialExpandedNodes}
              getNodeId={getId}
              renderNode={renderTeam}
            />
          </Menu>

          <Content>
            {selectedTeam && (
              <TeamView
                team={selectedTeam}
                updatingUserIds={updatingUserIds}
                updateRoles={updateRoles}
              />
            )}
          </Content>
        </Container>
      </React.Fragment>
    )
  }

  return null
}

const TeamLink = styled(ALink)`
  &.active {
    color: ${primary};
  }
  &:active,
  &:focus {
    outline: none;
  }
`

function renderTeam(team) {
  return (
    <TeamLink
      noStyle
      // replace /* doesn't seem to work (v4 only?) */
      activeClassName="active"
      style={{ display: 'block' }}
      to={`/dashboard/teams/${team.id}`}
    >
      {team.name}
    </TeamLink>
  )
}

export default connect(({ user }: any) => ({ user }))(TeamsPage)
