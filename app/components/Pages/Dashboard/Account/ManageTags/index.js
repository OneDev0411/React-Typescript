import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { confirmation } from 'actions/confirmation'
import { getContactsTags } from 'models/contacts/get-contacts-tags'
import { createContactsTags } from 'models/contacts/create-contacts-tags'
import { updateContactsTags } from 'models/contacts/update-contacts-tags'
import { deleteContactsTags } from 'models/contacts/delete-contacts-tags'

import PageHeader from 'components/PageHeader'
import IconTextInput from 'components/Input/IconTextInput'
import TagIcon from 'components/SvgIcons/Tag/TagIcon'

import Loading from '../../../../Partials/Loading'
import Row from './row'
import {
  Container,
  Description,
  TextInputPrefix,
  TextInputSuffix
} from './styled'

const HIGHLIGHT_SECONDS = 4

class ManageTags extends Component {
  state = {
    tags: {},
    createTagInputValue: '',
    loading: true
  }

  async componentDidMount() {
    await this.reloadTags()
  }

  reloadTags = async () => {
    this.setState({ loading: true })

    const tags = await this.getTags()

    this.setState({ tags, loading: false })
  }

  getTags = async () => {
    const response = await getContactsTags()

    const tags = {}

    response.data.forEach(tag => {
      const title = tag.text[0].toUpperCase()

      if (!tags[title]) {
        tags[title] = {
          title,
          highlight: false,
          items: []
        }
      }

      tags[title].items.push(tag)
    })

    return tags
  }

  createTag = async tag => createContactsTags(tag)

  setTagRowHighlight = (tag, highlight = true) => {
    const title = tag[0].toUpperCase()

    this.setState(prevState => ({
      tags: {
        ...prevState.tags,
        [title]: {
          ...prevState.tags[title],
          highlight
        }
      }
    }))
  }

  handleChange = async ({ oldText, newText }) => {
    await updateContactsTags(oldText, newText)
    this.props.notify({
      status: 'success',
      message: 'Tag updated.'
    })
    await this.reloadTags()
  }

  handleAdd = async () => {
    const tag = this.state.createTagInputValue

    await this.createTag(tag)
    this.props.notify({
      status: 'success',
      message: 'Tag added.'
    })
    this.setState({ createTagInputValue: '' })
    await this.reloadTags()
    this.setTagRowHighlight(tag)
    setTimeout(
      () => this.setTagRowHighlight(tag, false),
      HIGHLIGHT_SECONDS * 1000
    )
  }

  handleDelete = async ({ text }) => {
    this.props.confirmation({
      show: true,
      confirmLabel: 'Yes, I am sure',
      message: 'Delete tag from Rechat?',
      description:
        'Deleting a tag will remove it from the system and remove it from any contacts with this tag.',
      onConfirm: async () => {
        await deleteContactsTags(text)
        this.props.notify({
          status: 'success',
          message: 'Tag deleted.'
        })
        await this.reloadTags()
      }
    })
  }

  handleCreateTagInputChange = value => {
    this.setState({
      createTagInputValue: value
    })
  }

  render() {
    return (
      <Fragment>
        <PageHeader style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>
          <PageHeader.Title showBackButton={false}>
            <PageHeader.Heading>Manage Tags</PageHeader.Heading>
          </PageHeader.Title>
        </PageHeader>
        <Container>
          {this.state.loading ? (
            <Loading />
          ) : (
            <Fragment>
              <Description>
                Start typing tags and hit Return to add.
              </Description>
              <IconTextInput
                placeholder="Add a tag..."
                value={this.state.createTagInputValue}
                style={{ margin: '1rem 1.5rem' }}
                onChange={this.handleCreateTagInputChange}
                onEnterKeyPress={this.handleAdd}
                prefixElementRenderer={() => (
                  <TextInputPrefix>
                    <TagIcon />
                  </TextInputPrefix>
                )}
                suffixElementRenderer={() => (
                  <TextInputSuffix
                    disabled={!this.state.createTagInputValue}
                    onClick={this.handleAdd}
                  >
                    Add
                  </TextInputSuffix>
                )}
              />
              {Object.keys(this.state.tags)
                .sort()
                .map((title, rowIndex) => (
                  <Row
                    key={rowIndex}
                    title={title}
                    items={this.state.tags[title].items}
                    highlight={this.state.tags[title].highlight}
                    onChange={this.handleChange}
                    onDelete={this.handleDelete}
                  />
                ))}
            </Fragment>
          )}
        </Container>
      </Fragment>
    )
  }
}

export default connect(
  null,
  {
    notify,
    confirmation
  }
)(ManageTags)
