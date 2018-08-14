import React from 'react'

export function WrapStory(Component, name) {
  return () => (
    <div style={{ padding: '0.75em' }}>
      <h2>{name}</h2>
      <Component />
    </div>
  )
}
