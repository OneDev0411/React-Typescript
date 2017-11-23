import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import TasksDropDown from '../../tasks-dropdown'
import Checkbox from '../../../../components/radio'

export default class WorkspaceForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { upload } = this.props

    return (
      <div className="details">
        <input
          className="title"
          placeholder="Document title ..."
        />

        <TasksDropDown
          upload={upload}
        />

        <Checkbox
          square
          selected={false}
          title="Notify Office"
          onClick={() => null}
        />

        <div className="buttons">
          <button
            disabled={true}
          >
            Save and quit
          </button>

          <button
            disabled={true}
          >
            Save and create another
          </button>
        </div>

      </div>
    )
  }
}
