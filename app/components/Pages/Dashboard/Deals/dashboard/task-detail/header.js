import React from 'react'
import { connect } from 'react-redux'
import { setSelectedTask } from '../../../../../../store_actions/deals'

const Header = ({
  task,
  setSelectedTask
}) => (
  <table className="heading">
    <tbody>
      <tr>
        <td
          className="title"
          style={{ width: '80%' }}
        >
          { task.title }
        </td>

        <td
          className="task-close"
          style={{ width: '20%' }}
        >
          <button
            className="deal-button close-task"
            onClick={() => setSelectedTask(null)}
          >
            X
          </button>
        </td>
      </tr>
    </tbody>
  </table>
)

export default connect(null, { setSelectedTask })(Header)
