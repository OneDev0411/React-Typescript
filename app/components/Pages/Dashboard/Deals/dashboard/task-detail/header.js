import React from 'react'

const Header = ({
  task,
  onCloseTask
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
            onClick={() => onCloseTask()}
          >
            X
          </button>
        </td>
      </tr>
    </tbody>
  </table>
)

export default Header
