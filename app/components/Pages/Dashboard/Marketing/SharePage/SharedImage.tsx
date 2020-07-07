import React from 'react'

import { SharedMediaProps } from './types'

export default function SharedImage({ url }: SharedMediaProps) {
  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <a href="/">
          <img
            alt="brand"
            style={{
              minHeight: '2.5rem',
              maxHeight: '2.5rem'
            }}
            src="/static/images/logo.svg"
          />
        </a>
      </div>
      <div
        style={{
          width: '100%',
          minHeight: '30vh',
          marginBottom: '1.5rem'
        }}
      >
        <img
          style={{
            maxWidth: '100%',
            maxHeight: '100%'
          }}
          alt="preview"
          src={url}
        />
      </div>
      <ol>
        <li>Press and hold on the image above.</li>
        <li>Select share option from the pop up menu.</li>
        <li>
          Select Facebook, Instagram or another app to share the image to.
        </li>
      </ol>
    </div>
  )
}
