import React from 'react'
import Dropzone from 'react-dropzone'

export default function UploaderModal({
  accept,
  onDrop,
  minSize,
  maxSize,
  notes,
  showRules
}) {
  return (
    <Dropzone
      accept={accept}
      minSize={minSize}
      maxSize={maxSize}
      multiple={false}
      onDrop={onDrop}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'f2f2f2'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: '18.5%'
        }}
      >
        <img
          style={{
            marginBottom: '25px'
          }}
          src="/static/icons/gif-png-jpg.svg"
          alt="gif, png or jpg"
        />
        <h3
          style={{
            fontFamily: 'Barlow',
            fontSize: '20px',
            fontWeight: 'normal',
            margin: '0'
          }}
        >
          Drop your photo to upload
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '250px',
            padding: '5px'
          }}
        >
          <hr style={{ width: '100px' }} />
          <span
            style={{
              opacity: '0.5',
              fontFamily: 'Barlow',
              fontWeight: 'normal',
              width: '20px'
            }}
          >
            OR
          </span>
          <hr style={{ width: '100px' }} />
        </div>
        <span
          style={{
            width: '182px',
            height: '40px',
            lineHeight: '40px',
            fontFamily: 'Barlow',
            fontSize: '16px',
            fontWeight: '500',
            fontStyle: 'normal',
            fontStretch: 'normal',
            letterSpacing: '0.1px',
            textAlign: 'center',
            color: '#ffffff',
            backgroundColor: '#004ce6',
            borderRadius: '5px'
          }}
        >
          Choose from files
        </span>
        {!!notes && notes}
        {showRules && (
          <ul style={{ padding: '10px 8px' }}>
            <li>- accepted formats: {accept}</li>
            <li>{minSize > 0 && `- Minimum file size: ${minSize} bytes`}</li>
            {maxSize < Infinity && `- Maximum file size: ${maxSize} bytes`}
          </ul>
        )}
      </div>
    </Dropzone>
  )
}
