import usePromise from 'react-use-promise'

import { connect } from 'react-redux'

import * as React from 'react'

import { Helmet } from 'react-helmet'

import styled from 'styled-components'

import { RouteComponentProps } from 'react-router'

import { getBrands } from 'models/BrandConsole/Brands'

import { Container, Content, Menu } from 'components/SlideMenu'
import ALink from 'components/ALink'

import { getActiveTeamId } from 'utils/user-teams'

import TreeView from 'components/TreeView'
import { H4 } from 'components/Typography/headings'
import Spinner from 'components/Spinner'
import { primary } from 'views/utils/colors'

import Search from 'components/Grid/Search'

import { Team } from 'types/Team'

import { TeamsSearch } from './styled'

type Props = {
  user: any
} & RouteComponentProps<{ id: string }, {}>

function TeamsPage(props: Props) {
  const [result, error, state] = usePromise<ApiResponse<Team>>(
    async () => getBrands(getActiveTeamId(props.user)),
    []
  )

  if (state === 'pending') {
    return <Spinner />
  }

  if (error) {
    return <div>Error</div> // TODO
  }

  if (result) {
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
              getChildNodes={parent => (parent ? parent.children : result.data)}
              selectable
              initialExpandedNodes={[
                result.data.id,
                ...result.data.children.map(team => team.id)
              ]}
              getNodeId={team => team.id}
              renderNode={renderTeam}
            />
          </Menu>

          <Content />
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
      replace /* doesn't seem to work (v4 only?) */
      activeClassName="active"
      style={{ display: 'block' }}
      to={`/dashboard/teams/${team.id}`}
    >
      {team.name}
    </TeamLink>
  )
}

export default connect(({ user }: any) => ({ user }))(TeamsPage)
