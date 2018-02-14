import React from 'react'
import Editable from '../Editable'

export default ({ jobs, onChangeAttribute, onAddAttribute }) => {
  if (!jobs) {
    return null
  }

  return (
    <div>
      {jobs.length > 0 ? (
        jobs.map(item => (
          <li key={`job__${item.id}`}>
            <div className="name">Jobs</div>
            <div className="data">
              <Editable
                type="job_title"
                id={item.id}
                showEdit
                showAdd
                attributeName="job_titles"
                onAdd={onAddAttribute}
                text={item.job_title}
                onChange={onChangeAttribute}
              />
            </div>
          </li>
        ))
      ) : (
        <li>
          <div className="name">Jobs</div>
          <div className="data">
            <Editable
              type="job_title"
              id={null}
              showEdit
              showAdd={false}
              text="-"
              onChange={onChangeAttribute}
            />
          </div>
        </li>
      )}
    </div>
  )
}
