import React from 'react'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'

const Container = styled.div`
  width: 100%;

  div {
    height: 100%;
    width: 100%;
  }

  > div > label > div {
    display: flex;
    align-items: center;
  }
`

export default function UploaderModal({
  accept,
  onDrop,
  minSize,
  maxSize,
  notes,
  showRules
}) {
  return (
    <Container>
      <Dropzone
        data-test="image-uploader-modal-dropzone"
        accept={accept}
        minSize={minSize}
        maxSize={maxSize}
        multiple={false}
        onDrop={onDrop}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f2f2f2'
        }}
        activeStyle={{
          boxShadow: '0 0 4px 1px inset rgb(0, 76, 230)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            height: 'auto'
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
              fontFamily: 'LatoRegular',
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
                fontFamily: 'LatoRegular',
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
              fontFamily: 'LatoRegular',
              fontSize: '16px',
              fontWeight: '400',
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
    </Container>
  )
}
