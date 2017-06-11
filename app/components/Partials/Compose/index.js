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
      items: {}
    }
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
    const items = {
      ...this.state.items,
      ...{[item.id]: item}
    }

    this.setState({ items })
  }

  onRemove(item) {
    const items = _.omit(this.state.items, (obj, id) => id === item.id)
    this.setState({ items })
  }

  render() {
    const { criteria, viewList, items } = this.state

    return (
      <div className="compose">
        <div className="tags-container">
          <span className="to">To: </span>

          {
            _.map(items, item =>
              <span
                key={`ITEM_${item.id}`}
                className="tag"
              >
                { item.display_name }
                <i
                  className="fa fa-times"
                  onClick={() => this.onRemove(item)}
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
