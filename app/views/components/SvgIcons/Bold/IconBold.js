import React from 'react'

function Bold(props) {
  const { width = 16, height = 16 } = props

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.463 7.308a4.18 4.18 0 0 0-2.9-7.143H2.867a.833.833 0 1 0 0 1.667h.675c.092 0 .167.075.167.167V14a.167.167 0 0 1-.167.167h-.675a.833.833 0 1 0 0 1.666h6.642a4.495 4.495 0 0 0 1.953-8.524v-.001zm-2.9-5.476a2.508 2.508 0 0 1 0 5.015H5.542a.167.167 0 0 1-.167-.166V2c0-.092.075-.167.167-.167l3.02-.001zm.946 12.333H5.542A.167.167 0 0 1 5.375 14V8.68c0-.092.075-.167.167-.167H9.509a2.826 2.826 0 0 1 0 5.651z"
        fillRule="nonzero"
      />
    </svg>
  )
}

export default Bold
