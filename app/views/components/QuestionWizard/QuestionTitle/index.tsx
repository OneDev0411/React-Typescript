import React from 'react'

interface Props {
  children: React.ReactNode
}

export function QuestionTitle({ children }: Props) {
  return (
    <>
      <h4
        style={{
          background: '#f0f2f5',
          borderRadius: '16px 16px 16px 0',
          display: 'inline-block',
          padding: '16px 32px',
          minWidth: '300px'
        }}
      >
        {children}
      </h4>
    </>
  )
}
