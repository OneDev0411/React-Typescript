import { connect } from 'react-redux'

import * as React from 'react'
import { MutableRefObject, useCallback, useRef, useState } from 'react'

import { Helmet } from 'react-helmet'

import { RouteComponentProps } from 'react-router'

import { debounce } from 'lodash'

import { Container, Content, Menu } from 'components/SlideMenu'

import TreeView from 'components/TreeView'
import { H4 } from 'components/Typography/headings'
import Spinner from 'components/Spinner'

import Search from 'components/Grid/Search'

import { findNode } from 'utils/tree-utils'

import { SearchContext } from 'components/TextWithHighlights'

import { useCaptureTyping } from 'hooks/use-capture-typing'

import { TeamsSearch } from './styled'
import { TeamView } from './components/TeamView'
import { useTeamsPage } from './hooks/use-teams-page.hook'
import { TeamName } from './components/TeamName'
import { AddEditTeamModal } from './components/AddEditTeamModal'
import { EditTeamRolesModal } from './components/EditTeamRolesModal'
import { AddTeamMembersModal } from './components/AddTeamMembersModal'

type Props = {
  user: any
} & RouteComponentProps<{ id: string }, {}>

const getId = team => team.id

function TeamsPage(props: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSetSearchTerm = debounce(setSearchTerm, 400)

  const {
    rootTeam,
    error,
    loading,
    updatingUserIds,
    updateRoles,
    deleteTeam,
    getChildNodes,
    addEditModal,
    addMembersModal,
    editRolesModal,
    initialExpandedNodes
  } = useTeamsPage(props.user, searchTerm)

  const inputRef: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement | null>(
    null
  )

  // FIXME: move useCaptureTyping into Search component when it's refactored
  // into a function component.
  useCaptureTyping(inputRef)

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
    // TODO: figure out the correct way of handling this. Are we have a
    // upper level error boundary which handles http errros in a unified
    // manner? So maybe we can throw the error in this case
    return <div>Error</div>
  }

  if (!rootTeam) {
    return null
  }

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
            <H4>Team Management</H4>

            <TeamsSearch>
              <Search
                inputRef={ref => {
                  inputRef.current = ref
                }}
                placeholder="Search for teams and agents"
                onChange={value => debouncedSetSearchTerm(value)}
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

          <Content isSideMenuOpen>
            {selectedTeam && (
              <TeamView
                team={selectedTeam}
                updatingUserIds={updatingUserIds}
                onDelete={() => deleteTeam(selectedTeam)}
                onEdit={() => addEditModal.openEdit(selectedTeam)}
                onAddMember={() => addMembersModal.open(selectedTeam)}
                onEditRoles={() => editRolesModal.open(selectedTeam)}
                updateRoles={updateRoles}
              />
            )}
          </Content>
        </Container>
      </SearchContext.Provider>
      <AddEditTeamModal
        close={addEditModal.close}
        isOpen={addEditModal.isOpen}
        submit={addEditModal.submit}
        team={addEditModal.team}
        validate={addEditModal.validate}
      />
      <EditTeamRolesModal
        close={editRolesModal.close}
        isOpen={editRolesModal.isOpen}
        submit={editRolesModal.submit}
        team={editRolesModal.team}
      />
      <AddTeamMembersModal
        close={addMembersModal.close}
        isOpen={addMembersModal.isOpen}
        submit={addMembersModal.submit}
        team={addMembersModal.team}
      />
    </React.Fragment>
  )
}

export default connect(({ user }: any) => ({ user }))(TeamsPage)
