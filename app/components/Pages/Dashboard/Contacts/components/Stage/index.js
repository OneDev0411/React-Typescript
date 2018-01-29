import React from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import _ from 'underscore'

export default class StageDropDown extends React.Component {
  constructor(props) {
    super(props)
    this.stages = {
      General: 'General',
      UnqualifiedLead: 'Unqualified Lead',
      QualifiedLead: 'Qualified Lead',
      Active: 'Active',
      PastClient: 'Past Client'
    }

    this.state = {
      selected: this.defineStage(props)
    }
  }
  componentWillReceiveProps(props) {
    this.setState({ selected: this.defineStage(props) })
  }

  defineStage(props) {
    const defaultValue = props.default ? props.default.replace(/\s/g, '') : null

    // get stage
    const stage = defaultValue && this.stages[defaultValue] ? defaultValue : null

    return stage
  }
  onChange(eventKey) {
    this.setState({
      selected: eventKey
    })

    // trigger
    this.props.onChange(eventKey)
  }

  render() {
    const { selected } = this.state

    if (!selected) {
      return false
    }

    return (
      <div className="contact-stages">
        <DropdownButton
          title={this.stages[selected]}
          id="drp-stages"
          onSelect={eventKey => this.onChange(eventKey)}
          onClick={event => event.stopPropagation()}
        >
          {_.map(this.stages, (name, key) => (
            <MenuItem
              key={`STAGE_${key}`}
              eventKey={key}
              className={key === selected ? 'selected' : ''}
            >
              {name}
            </MenuItem>
          ))}
        </DropdownButton>
      </div>
    )
  }
}
