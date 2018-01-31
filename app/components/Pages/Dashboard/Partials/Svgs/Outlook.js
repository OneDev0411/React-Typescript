import React from 'react'

const Outlook = ({ fill = '#276BA6', width = '1em', height = '1em' }) => (
  <svg
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={width}
    height={height}
    viewBox="0 0 16 16"
  >
    <defs>
      <path id="a" d="M0 .018h15.981v15.98H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="b" fill="#fff">
        <use xlinkHref="#a" />
      </mask>
      <path
        fill={fill}
        d="M0 1.632v12.535L9.38 16V.018L0 1.632m9.962 5.996v4.205h5.304s.776-.108.712-1.124l.003-5.492-3.885 2.622s-1.1.885-2.134-.21"
        mask="url(#b)"
      />
      <path
        fill={fill}
        d="M9.962 3.262h5.347s.63-.043.63.64l-4.834 3.212-1.143-.727V3.262"
      />
      <path
        fill="#FFFFFE"
        d="M4.688 9.546c-.567 0-1.027-.752-1.027-1.68 0-.927.46-1.679 1.027-1.679s1.027.752 1.027 1.68c0 .927-.46 1.68-1.027 1.68zm.025-4.51c-1.18 0-2.136 1.27-2.136 2.835 0 1.566.956 2.835 2.136 2.835 1.18 0 2.135-1.27 2.135-2.835s-.956-2.835-2.135-2.835z"
      />
    </g>
  </svg>
)

export default Outlook
