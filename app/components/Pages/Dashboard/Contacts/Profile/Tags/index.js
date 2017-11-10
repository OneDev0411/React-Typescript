import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  getTags,
  upsertAttributes,
  deleteAttribute
} from '../../../../../../store_actions/contact'
import ManageTags from './Manage-Tag'

class Tags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showTagModal: false,
      saving: false,
      removingTagId: null
    }
  }

  async onDone({ inserts, deletes }) {
    const { getTags } = this.props

    this.setState({
      showTagModal: false,
      saving: true
    })

    // insert new tags
    if (inserts.length > 0) {
      const newTags = _.map(inserts, item => ({
        type: 'tag',
        tag: item.tag
      }))

      await this.upsert(newTags)
    }

    // remove tags
    for (let item of deletes) {
      await this.remove(item)
    }

    if (inserts.length > 0 || deletes.length > 0) {
      getTags()
    }

    this.setState({
      saving: false
    })
  }

  async remove(item) {
    const { contact_id, deleteAttribute } = this.props
    // set removing state
    this.setState({ removingTagId: item.id })

    // remove tag
    await deleteAttribute(contact_id, item.id)

    // reset state
    this.setState({ removingTagId: null })
  }

  async upsert(attributes) {
    const { contact_id, upsertAttributes } = this.props
    await upsertAttributes(contact_id, 'tag', attributes)
  }

  render() {
    const { tags } = this.props
    const { showTagModal, saving, removingTagId } = this.state

    if (saving) {
      return <i className="fa fa-spin fa-spinner" />
    }

    return (
      <div>
        <ul className="tags">
          {
            _.chain(tags)
              .filter(item => item.active === true && item.id !== removingTagId)
              .map(item => (
                <li
                  key={`tag_${item.id}`}
                  className="active"
                  onClick={() => this.remove(item)}
                >
                  { item.tag }
                </li>
              ))
              .value()
          }
          <li
            className="new-item"
            onClick={() => this.setState({ showTagModal: true })}
          >
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

export default connect(null, { getTags, upsertAttributes, deleteAttribute })(Tags)
