import React from 'react'

export default ({
  checklist
}) => {
  const labels = []

  if (checklist.is_deactivated === true) {
    labels.push('BACKUP')
  }

  if (checklist.is_terminated) {
    labels.push('TERMINATED')
  }

  return (
    <ul className="labels">
      {
        labels.map(name =>
          <li
            key={`LBL_${name}`}
            className={`p-label ${name}`}
          >
            { name }
          </li>
        )
      }
    </ul>
  )
}
