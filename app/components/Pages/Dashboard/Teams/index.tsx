import { connect } from 'react-redux'

import * as React from 'react'
import { useCallback, useState } from 'react'

import { Helmet } from 'react-helmet'

import { RouteComponentProps } from 'react-router'

import { Field, Form } from 'react-final-form'

import Flex, { FlexItem } from 'styled-flex-component'

import { Container, Content, Menu } from 'components/SlideMenu'

import TreeView from 'components/TreeView'
import { TextInput } from 'components/Forms/TextInput'
import { SelectInput } from 'components/Forms/SelectInput'
import { H4 } from 'components/Typography/headings'
import Spinner from 'components/Spinner'

import Search from 'components/Grid/Search'

import { findNode } from 'utils/tree-utils'

import { SearchContext } from 'components/TextWithHighlights'

import { Modal, ModalHeader } from 'components/Modal'

import Button from 'components/Button/ActionButton'

import { BrandTypes } from 'models/BrandConsole/types'

import { TeamsSearch } from './styled'
import { TeamView } from './TeamView'
import { useTeamsPage } from './use-teams-page.hook'
import { TeamName } from './TeamView/components/TeamName'

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
                  searchTerm={searchTerm}
                  updateRoles={updateRoles}
                />
              )}
            </Content>
          </Container>
        </SearchContext.Provider>
        <Modal
          style={{ content: { overflow: 'visible' } }}
          isOpen={addEditModal.isOpen}
          onRequestClose={addEditModal.close}
          autoHeight
        >
          <ModalHeader
            closeHandler={addEditModal.close}
            title={addEditModal.team ? 'Edit team' : 'Add team'}
          />
          <Form
            onSubmit={addEditModal.submit}
            validate={addEditModal.validate}
            initialValues={addEditModal.team || { brand_type: BrandTypes.Team }}
            render={({ handleSubmit, submitting }) => (
              <form
                onSubmit={handleSubmit}
                style={{ padding: '0.75rem' }}
                noValidate
              >
                <Flex>
                  <FlexItem grow={1} basis="0%" style={{ padding: '0.75rem' }}>
                    <Field
                      autoFocus
                      name="name"
                      label="Title"
                      required
                      component={TextInput as any}
                    />
                  </FlexItem>
                  <FlexItem grow={1} basis="0%" style={{ padding: '0.75rem' }}>
                    <Field
                      name="brand_type"
                      items={Object.values(BrandTypes).map(value => ({
                        label: value,
                        value
                      }))}
                      dropdownOptions={{
                        fullWidth: true
                      }}
                      label="Type"
                      component={SelectInput as any}
                    />
                  </FlexItem>
                </Flex>
                <Flex justifyEnd>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save'}
                  </Button>
                </Flex>
              </form>
            )}
          />
        </Modal>
      </React.Fragment>
    )
  }

  return null
}

export default connect(({ user }: any) => ({ user }))(TeamsPage)
