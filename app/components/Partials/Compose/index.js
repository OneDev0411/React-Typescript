import React from 'react'
import { connect } from 'react-redux'
import AutosizeInput from 'react-input-autosize'
import _ from 'underscore'

class Compose extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      criteria: '',
      viewList: {},
      members: {}
    }
  }

  componentDidMount() {

  }

  onSearch(e) {
    const { contacts } = this.props
    const criteria = e.target.value

    const viewList = _.filter(contacts, contact => {
      return contact.display_name.includes(criteria)
    })

    this.setState({
      criteria,
      viewList
    })
  }

  onAdd(item) {
    const members = {
      ...this.state.members,
      ...{[item.id]: item}
    }

    this.setState({ members })
  }

  onRemove(item) {
    const members = _.omit(this.state.members, (member, id) => id === item.id)
    this.setState({ members })
  }

  render() {
    const { criteria, viewList, members } = this.state

    return (
      <div className="compose">
        <div className="tags-container">
          <span className="to">To: </span>

          {
            _.map(members, member =>
              <span
                key={`MBMR_${member.id}`}
                className="tag"
              >
                { member.display_name }
                <i
                  className="fa fa-times"
                  onClick={() => this.onRemove(member)}
                ></i>
              </span>
            )
          }

          <AutosizeInput
            value={criteria}
            onChange={e => this.onSearch(e) }
            placeholder="Enter name, email or phone"
            maxLength={30}
            placeholderIsMinWidth
          />
        </div>

        <div className="suggestions">
          {
            _.map(viewList, item =>
              <div
                key={`ITEM_SUG_${item.id}`}
                className="item"
                onClick={() => this.onAdd(item)}
              >
                { item.display_name }
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default connect(s => ({
  contacts: s.contact.list
}))(Compose)
