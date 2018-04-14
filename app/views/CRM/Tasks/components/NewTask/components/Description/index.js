import React from 'react'

export default function Note(props) {
  const { input } = props

  return (
    <div className="c-new-task__description c-new-task__field c-new-task__field--textarea">
      <textarea
        {...input}
        placeholder="Description ..."
        className="c-new-task__field__input"
      />
    </div>
  )
}
