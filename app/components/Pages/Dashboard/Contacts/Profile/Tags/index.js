import React from 'react'
import { Row, Col } from 'react-bootstrap'
import _ from 'underscore'
import Dispatcher from '../../../../../../dispatcher/ContactDispatcher'
import ManageTags from './Manage-Tag'

export default class Tags extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showTagModal: false
    }
  }

  async onDone({ inserts, deletes }) {

    const newTags = _.map(inserts, item => {
      return { type: 'tag', tag: item.tag }
    })

    // insert new tags
    if (newTags.length > 0)
      this.upsert(newTags)

    // remove tags
    _.each(deletes, item => this.remove(item))

    this.reloadSharedTags()

    this.setState({
      showTagModal: false
    })
  }

  // onRemoveTag(tag_id) {
  //   const { user, contact_id } = this.props

  // }

  // onAddTag(tag) {
  //   const attributes = [{
  //     type: 'tag',
  //     tag
  //   }]

  //   this.upsert(attributes)
  // }

  remove(item) {
    const { user, contact_id } = this.props

    Dispatcher.dispatch({
      action: 'delete-attribute',
      id: contact_id,
      user: user,
      attribute_id: item.id
    })
  }

  upsert(attributes) {
    const { user, contact_id } = this.props

    Dispatcher.dispatch({
      action: 'upsert-attributes',
      id: contact_id,
      type: 'tag',
      attributes,
      user
    })
  }

  reloadSharedTags() {
    const { user } = this.props

    Dispatcher.dispatch({
      action: 'get-tags',
      user
    })
  }

  render(){
    const { tags } = this.props
    const { showTagModal } = this.state

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
          onDone={changes => this.onDone(changes)}
        />
      </div>
    )
  }
}
