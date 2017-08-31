import React from 'react'

export default ({
                  height = '20',
                  width = '19',
                  fill = '#B0B0B0'
                }) =>
  (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20">
      <g fill="none" fillRule="evenodd">
        <path d="M-2-2h24v24H-2z" />
        <g fill={fill} fillRule="nonzero">
          <path d="M16 20H2c-1.103 0-2-.897-2-2V4c0-1.102.897-2 2-2h7v2H2v14h14V9h2v9c0 1.103-.897 2-2 2z" />
          <path
            d="M7.808 8.365l2.828 2.827-3.535.707zM18.414 3.414A2 2 0 1 0 15.586.586L9.222 6.95l2.829 2.829 6.363-6.365z"
          />
        </g>
      </g>
    </svg>
  )
