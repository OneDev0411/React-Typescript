import React from 'react'

interface Props {
  value: string
  show: boolean
  multiline: boolean
  inputPlaceholder: string
  onChange(value: string): void
}

export function UserEntry({
  value,
  show,
  multiline,
  inputPlaceholder,
  onChange
}: Props) {
  if (!show) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target

    onChange(multiline ? value : value.split('\n').join(''))
  }

  return (
    <textarea
      value={value}
      rows={multiline ? 5 : 1}
      placeholder={inputPlaceholder}
      onChange={handleChange}
      className="confirmation-input"
      style={{
        lineHeight: 1,
        height: multiline ? '80px' : 'auto'
      }}
    />
  )
}
