import React from 'react'
import { connect } from 'react-redux'
import Comments from '../comments'
import SubmitReview from '../submit-review'

const Header = ({
  task,
  isBackOffice
}) => (
  <table className="heading">
    <tbody>
      <tr>
        <td
          className="title"
          style={{ width: isBackOffice ? '100%': '70%' }}
        >
          { task.title }
        </td>

        {
          !isBackOffice &&
          <td
            className="submit"
            style={{ width: '30%' }}
          >
            <SubmitReview
              key={task.id}
              task={task}
            />
          </td>
        }
      </tr>
    </tbody>
  </table>
)


export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice
}))(Header)
