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
          style={{ width: isBackOffice ? '100%': '60%' }}
        >
          { task.title.replace(/&.*;/g, '') }
        </td>

        {
          !isBackOffice &&
          <td
            className="submit"
            style={{ width: '40%' }}
          >
            <SubmitReview
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
