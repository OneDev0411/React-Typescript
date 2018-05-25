import React from 'react'

export default function DeletingMessage() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '3.6rem',
        color: 'red',
        backgroundColor: 'rgba(255, 255, 255, 0.6)'
      }}
    >
      Deleting...
    </div>
  )
}
