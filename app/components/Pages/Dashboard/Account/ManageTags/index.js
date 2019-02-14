import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import Fetch from 'services/fetch'
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

const API_URL = '/contacts/tags'

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
    const response = await new Fetch().get(API_URL)

    const tags = {}

    response.body.data.forEach(tag => {
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

  createTag = async tag => new Fetch().post(API_URL).send({ tag })

  highlightTagRow = tag => {
    const title = tag[0].toUpperCase()

    this.setState(prevState => ({
      ...prevState,
      tags: {
        ...prevState.tags,
        [title]: {
          ...prevState.tags[title],
          highlight: true
        }
      }
    }))
  }

  onTagChange = tag => {
    console.log('onTagChange', tag)
  }

  onAddClick = async () => {
    const tag = this.state.createTagInputValue

    await this.createTag(tag)
    this.props.notify({
      status: 'success',
      message: 'Tag added.'
    })
    this.setState({ createTagInputValue: '' })
    await this.reloadTags()
    this.highlightTagRow(tag)
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
                Start typing tags. Hit return to complete. Hit backspace/delete
                to remove.
              </Description>
              <IconTextInput
                placeholder="Add a tag..."
                value={this.state.createTagInputValue}
                style={{ margin: '1rem 1.5rem' }}
                onChange={this.handleCreateTagInputChange}
                prefixElementRenderer={() => (
                  <TextInputPrefix>
                    <TagIcon />
                  </TextInputPrefix>
                )}
                suffixElementRenderer={() => (
                  <TextInputSuffix
                    disabled={!this.state.createTagInputValue}
                    onClick={this.onAddClick}
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
                    onChange={this.onTagChange}
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
  { notify }
)(ManageTags)
