import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { Helmet } from 'react-helmet'
import { uniqBy } from 'lodash'

import { defaultTags } from 'utils/default-tags'

import { confirmation } from 'actions/confirmation'
import { getContactsTags } from 'models/contacts/get-contacts-tags'
import { getContactsTags as getContactTagsAction } from 'actions/contacts/get-contacts-tags'
import { createContactsTags } from 'models/contacts/create-contacts-tags'
import { updateContactsTags } from 'models/contacts/update-contacts-tags'
import { deleteContactsTags } from 'models/contacts/delete-contacts-tags'

import PageHeader from 'components/PageHeader'

import Loading from '../../../../Partials/Loading'
import Row from './Row'
import { Input } from './Input'
import { Container, Description } from './styled'

const DEFAULT_TAGS = defaultTags.map(tag => ({
  text: tag,
  type: 'default_tag'
}))

const HIGHLIGHT_SECONDS = 4

class ManageTags extends Component {
  state = {
    rawTags: [],
    createTagInputValue: '',
    loading: true,
    isSaving: false
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = async () => {
    try {
      const response = await await getContactsTags()

      const rawTags = uniqBy([...DEFAULT_TAGS, ...response.data], 'text').map(
        ({ text, type }) => ({ text, highlight: false, type })
      )

      this.setState({
        loading: false,
        rawTags
      })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  sortTags = tags => {
    const sorted = tags.sort((rawA, rawB) => {
      const a = rawA.text.toLowerCase()
      const b = rawB.text.toLowerCase()

      return a.localeCompare(b)
    })

    return sorted
  }

  getTagRows = rawTags => {
    const rows = {}

    rawTags.forEach(tag => {
      const title = (tag.text[0] || '#').toUpperCase()

      if (!rows[title]) {
        rows[title] = {
          title,
          items: []
        }
      }

      rows[title].items.push(tag)
    })

    return rows
  }

  highlightTag = (tag, highlight = true, delay = 0) => {
    setTimeout(() => {
      this.setState(prevState => ({
        rawTags: [
          ...prevState.rawTags.filter(
            item => item.text.toLowerCase() !== tag.text.toLowerCase()
          ),
          {
            ...tag,
            highlight
          }
        ]
      }))
    }, delay)
  }

  handleDuplicateTagCreate = tag => {
    this.props.notify({
      status: 'info',
      message: `"${tag.text}" already exists.`
    })
    this.highlightTag(tag)
    this.highlightTag(tag, false, HIGHLIGHT_SECONDS * 1000)
  }

  handleChange = async ({ oldText, newText: rawNewText }) => {
    const text = rawNewText.trim()

    if (!text) {
      return
    }

    try {
      await updateContactsTags(oldText, text)
      this.props.notify({
        status: 'success',
        message: `"${text}" updated.`
      })
      this.setState(prevState => ({
        rawTags: [
          ...prevState.rawTags.filter(
            item => item.text.toLowerCase() !== oldText.toLowerCase()
          ),
          {
            text
          }
        ]
      }))
    } catch (e) {
      if (e.status && e.status === 409) {
        this.handleDuplicateTagCreate({ text })
      }

      return false
    }

    return true
  }

  handleAdd = async () => {
    const text = this.state.createTagInputValue.trim()

    if (!text || this.state.isSaving) {
      return
    }

    if (
      defaultTags.map(tag => tag.toLowerCase()).includes(text.toLowerCase())
    ) {
      return this.handleDuplicateTagCreate({
        text: text[0].toUpperCase() + text.substring(1).toLowerCase(),
        type: 'default_tag'
      })
    }

    try {
      this.setState({ isSaving: true })
      await createContactsTags(text)
      this.props.notify({
        status: 'success',
        message: `"${text}" added.`
      })
      this.setState(prevState => ({
        createTagInputValue: '',
        rawTags: [...prevState.rawTags, { text, highlight: true }]
      }))
      this.highlightTag({ text }, false, HIGHLIGHT_SECONDS * 1000)
    } catch (e) {
      if (e.status && e.status === 409) {
        this.handleDuplicateTagCreate({ text })
      }
    } finally {
      this.setState({ isSaving: false })
    }
  }

  handleDelete = async ({ text }) =>
    new Promise(resolve => {
      this.props.confirmation({
        show: true,
        confirmLabel: 'Yes, I am sure',
        message: 'Delete tag from Rechat?',
        description:
          'Deleting a tag will remove it from the system and remove it from any contacts with this tag.',
        onConfirm: async () => {
          await deleteContactsTags(text)
          this.props.getContactsTags()
          this.props.notify({
            status: 'success',
            message: `"${text}" deleted.`
          })
          this.setState(
            prevState => ({
              rawTags: [...prevState.rawTags.filter(item => item.text !== text)]
            }),
            resolve
          )
        },
        onCancel: () => {
          resolve()
        }
      })
    })

  handleCreateTagInputChange = value => {
    this.setState({
      createTagInputValue: value
    })
  }

  render() {
    const rows = this.getTagRows(this.state.rawTags)

    return (
      <Fragment>
        <Helmet>
          <title>Manage Tags | Settings | Rechat</title>
        </Helmet>
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
                Start typing tags and hit Return/Enter to add.
              </Description>
              <Input
                onChange={this.handleCreateTagInputChange}
                onSubmit={this.handleAdd}
                value={this.state.createTagInputValue}
                isDisabled={
                  this.state.isSaving || !this.state.createTagInputValue.trim()
                }
              />
              {Object.keys(rows)
                .sort()
                .map((title, rowIndex) => (
                  <Row
                    key={rowIndex}
                    title={title}
                    items={this.sortTags(rows[title].items)}
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
    confirmation,
    getContactsTags: getContactTagsAction
  }
)(ManageTags)
