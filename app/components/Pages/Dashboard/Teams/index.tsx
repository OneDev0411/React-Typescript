import { connect } from 'react-redux'

import * as React from 'react'
import { useCallback, useState } from 'react'

import { Helmet } from 'react-helmet'

import { RouteComponentProps } from 'react-router'

import { Container, Content, Menu } from 'components/SlideMenu'

import TreeView from 'components/TreeView'
import { H4 } from 'components/Typography/headings'
import Spinner from 'components/Spinner'

import Search from 'components/Grid/Search'

import { findNode } from 'utils/tree-utils'

import { SearchContext } from 'components/TextWithHighlights'

import { TeamsSearch } from './styled'
import { TeamView } from './components/TeamView'
import { useTeamsPage } from './hooks/use-teams-page.hook'
import { TeamName } from './components/TeamName'
import { AddEditModal } from './components/AddEditModal'

type Props = {
  user: any
} & RouteComponentProps<{ id: string }, {}>

const getId = team => team.id

function TeamsPage(props: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const {
    rootTeam,
    error,
    loading,
    updatingUserIds,
    updateRoles,
    deleteTeam,
    getChildNodes,
    addEditModal,
    initialExpandedNodes
  } = useTeamsPage(props.user, searchTerm)

  const teamRenderer = useCallback(
    team => (
      <TeamName
        team={team}
        searchTerm={searchTerm}
        onAddChild={addEditModal.openAdd}
      />
    ),
    [addEditModal.openAdd, searchTerm]
  )

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
        <SearchContext.Provider value={searchTerm}>
          <Container isOpen>
            <Menu isOpen width="25rem">
              <H4>Teams Management</H4>

              <TeamsSearch>
                <Search
                  placeholder="Search for teams and agents"
                  onChange={value => setSearchTerm(value)}
                />
              </TeamsSearch>
              <TreeView
                getChildNodes={getChildNodes}
                selectable
                initialExpandedNodes={initialExpandedNodes}
                getNodeId={getId}
                renderNode={teamRenderer}
              />
            </Menu>

            <Content>
              {selectedTeam && (
                <TeamView
                  team={selectedTeam}
                  updatingUserIds={updatingUserIds}
                  onDelete={() => deleteTeam(selectedTeam)}
                  onEdit={() => addEditModal.openEdit(selectedTeam)}
                  updateRoles={updateRoles}
                />
              )}
            </Content>
          </Container>
        </SearchContext.Provider>
        <AddEditModal
          validate={addEditModal.validate}
          team={addEditModal.team}
          close={addEditModal.close}
          isOpen={addEditModal.isOpen}
          submit={addEditModal.submit}
        />
      </React.Fragment>
    )
  }

  return null
}

export default connect(({ user }: any) => ({ user }))(TeamsPage)
