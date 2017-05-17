import React from 'react'
import { Row, Col } from 'react-bootstrap'
import _ from 'underscore'
import Dispatcher from '../../../../../../dispatcher/ContactDispatcher'
import ManageTags from './Manage-Tag'

export default class Tags extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tags: props.tags,
      showTagModal: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tags: nextProps.tags
    })
  }

  async onDone({ inserts, deletes }) {
    this.setState({
      showTagModal: false
    })

    // insert new tags
    if (inserts.length > 0) {
      const newTags = _.map(inserts, item => {
        return { type: 'tag', tag: item.tag }
      })

      await this.upsert(newTags)
    }

    // remove tags
    for (let item of deletes) {
      await this.remove(item)
    }

    if (inserts.length > 0 || deletes.length > 0)
      await this.reloadSharedTags()
  }

  async onRemove(item) {
    const newTags = _.omit(this.state.tags, item.tag)
    this.setState({ tags: newTags })

    // remove item
    this.remove(item, 'dispatch')
  }

  async remove(item, fn = 'dispatchSync') {
    const { user, contact_id } = this.props

    await Dispatcher[fn]({
      action: 'delete-attribute',
      id: contact_id,
      user: user,
      attribute_id: item.id
    })
  }

  async upsert(attributes) {
    const { user, contact_id } = this.props

    await Dispatcher.dispatchSync({
      action: 'upsert-attributes',
      id: contact_id,
      type: 'tag',
      attributes,
      user
    })
  }

  async reloadSharedTags() {
    const { user } = this.props

    await Dispatcher.dispatchSync({
      action: 'get-tags',
      user
    })
  }

  render(){
    const { tags } = this.state
    const { showTagModal, saving } = this.state

    return (
      <div>
        <ul className="tags">
          {
            _.chain(tags)
            .filter(item => item.active === true)
            .map(item => (
              <li
                key={`tag_${item.id}`}
                className="active"
                onClick={() => this.onRemove(item)}
              >
                { item.tag }
              </li>
            ))
            .value()
          }
          <li className="new-item" onClick={() => this.setState({ showTagModal: true })}>
            +
          </li>
        </ul>

        <ManageTags
          show={showTagModal}
          tags={tags}
          saving={saving}
          onDone={changes => this.onDone(changes)}
        />
      </div>
    )
  }
}
