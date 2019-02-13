import React, { Component, Fragment } from 'react'

import Fetch from 'services/fetch'
import PageHeader from 'components/PageHeader'

import Loading from '../../../../Partials/Loading'
import Row from './row'
import { Container, Description, CreateTagInput } from './styled'

const API_URL = '/contacts/tags'

export default class ManageTags extends Component {
  state = {
    tags: [],
    createTagInputValue: '',
    loading: true
  }

  async componentDidMount() {
    const tags = await this.getTags()

    console.log('TAGS', tags)

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
          items: []
        }
      }

      tags[title].items.push(tag)
    })

    return tags
  }

  onTagChange = tag => {
    console.log('onTagChange', tag)
  }

  handleCreateTagInputChange = e => {
    this.setState({
      createTagInputValue: e.target.value
    })
  }

  render() {
    return (
      <Fragment>
        <PageHeader style={{ marginBottom: '1.5em', marginTop: '1.5rem' }}>
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
              <CreateTagInput
                value={this.state.createTagInputValue}
                placeholder="Add a tag..."
                onChange={this.handleCreateTagInputChange}
              />
              {Object.keys(this.state.tags).map((title, rowIndex) => (
                <Row
                  key={rowIndex}
                  title={title}
                  onChange={this.onTagChange}
                  items={this.state.tags[title].items}
                />
              ))}
            </Fragment>
          )}
        </Container>
      </Fragment>
    )
  }
}
