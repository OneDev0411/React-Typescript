import React from 'react'
import { Row, Col } from 'react-bootstrap'
import _ from 'underscore'
import Dispatcher from '../../../../../../dispatcher/ContactDispatcher'
import AddTag from './Add-Tag'

export default class Tags extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showTagModal: false
    }
  }

  createNewTag() {
    this.setState({
      showTagModal: true
    })
  }

  onChange(changes) {
    this.setState({ showTagModal: false })

    Dispatcher.dispatch({
      action: 'update-tags',
      id: this.props.contact_id,
      user: this.props.user,
      new_tags: changes.create
    })
  }

  render(){
    const { tags } = this.props
    const { showTagModal } = this.state

    return (
      <Row>
        <Col
          xs={4}
          className="name"
          style={{ paddingLeft: '8%', color: '#5b6469' }}
        >
          Tags
        </Col>
        <Col xs={8}>
          <ul className="tags">
            {
              _.map(tags, item =>
                <li key={`tag_${item.id}`}>
                  { item.tag }
                </li>
              )
            }
            <li className="new-item" onClick={() => this.createNewTag() }>
              +
            </li>
          </ul>
        </Col>

        <AddTag
          show={showTagModal}
          tags={tags}
          onChange={changes => this.onChange(changes)}
        />
      </Row>
    )
  }
}
