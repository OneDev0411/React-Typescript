import React from 'react'
import Comments from './comments'
import SubmitReview from './submit-review'
export default ({
  task
}) => (
  <table className="heading">
    <tbody>
      <tr>
        <td className="title">{ task.title.replace(/&.*;/g, '') }</td>
        <td className="submit">
          <SubmitReview
            task={task}
          />
        </td>
      </tr>
    </tbody>
  </table>
)
