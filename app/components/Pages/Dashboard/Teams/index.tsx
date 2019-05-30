import { connect } from 'react-redux'

import * as React from 'react'
import { useCallback, useState } from 'react'

import { Helmet } from 'react-helmet'

import styled from 'styled-components'

import { RouteComponentProps } from 'react-router'

import { Field, Form } from 'react-final-form'

import Flex, { FlexItem } from 'styled-flex-component'

import { Container, Content, Menu } from 'components/SlideMenu'
import ALink from 'components/ALink'

import TreeView from 'components/TreeView'
import { TextInput } from 'components/Forms/TextInput'
import { SelectInput } from 'components/Forms/SelectInput'
import { H4 } from 'components/Typography/headings'
import Spinner from 'components/Spinner'
import { primary } from 'views/utils/colors'

import Search from 'components/Grid/Search'

import { findNode } from 'utils/tree-utils'

import { TextWithHighlights } from 'components/TextWithHighlights'

import { Modal, ModalHeader } from 'components/Modal'

import Button from 'components/Button/ActionButton'

import { TeamsSearch } from './styled'
import { TeamView } from './TeamView'
import { useTeamsPage } from './use-teams-page.hook'

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
    getChildNodes,
    editDialog,
    initialExpandedNodes
  } = useTeamsPage(props.user, searchTerm)

  const teamRenderer = useCallback(team => renderTeam(team, searchTerm), [
    searchTerm
  ])

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
                onEdit={() => editDialog.open(selectedTeam)}
                updateRoles={updateRoles}
              />
            )}
          </Content>
        </Container>
        <Modal
          isOpen={editDialog.isOpen}
          onRequestClose={editDialog.close}
          autoHeight
        >
          <ModalHeader
            closeHandler={editDialog.close}
            title={editDialog.team ? 'Edit team' : 'Add team'}
          />
          <Form
            onSubmit={editDialog.submit}
            validate={editDialog.validate}
            initialValues={editDialog.team || {}}
            render={({ handleSubmit, submitting }) => (
              <form
                onSubmit={handleSubmit}
                style={{ padding: '0.75rem' }}
                noValidate
              >
                <Flex>
                  <FlexItem grow={1} basis="0%" style={{ padding: '0.75rem' }}>
                    <Field
                      name="name"
                      label="Title"
                      required
                      component={TextInput}
                    />
                  </FlexItem>
                  <FlexItem grow={1} basis="0%" style={{ padding: '0.75rem' }}>
                    <Field
                      name="type"
                      items={[
                        {
                          value: 'brand',
                          label: 'Brand'
                        }
                      ]}
                      dropdownOptions={{
                        fullWidth: true
                      }}
                      label="Type"
                      component={SelectInput}
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

const TeamLink = styled(ALink)`
  &.active {
    color: ${primary};
  }
  &:active,
  &:focus {
    outline: none;
  }
`

const Highlight = styled.span`
  color: ${primary};
`

function renderTeam(team, searchTerm) {
  return (
    <TeamLink
      noStyle
      // replace /* doesn't seem to work (v4 only?) */
      activeClassName="active"
      style={{ display: 'block' }}
      to={`/dashboard/teams/${team.id}`}
    >
      {searchTerm ? (
        <TextWithHighlights HighlightComponent={Highlight} search={searchTerm}>
          {team.name}
        </TextWithHighlights>
      ) : (
        team.name
      )}
    </TeamLink>
  )
}

export default connect(({ user }: any) => ({ user }))(TeamsPage)
