import React from 'react'
import { Child } from './List'

export default function App({ name, onSubmit }) {
  return (
    <div>
      Hi <strong>{name}</strong>

      <Child />

      <button onClick={onSubmit}>test callback</button>
    </div>
  )
}