import React from 'react'
import AvatarEditor from 'react-avatar-editor'

export default function ImageEditor({
  editorRef,
  image,
  noImageCache,
  width,
  height,
  border,
  color,
  scale,
  rotate,
  borderRadius,
  disableBoundaryChecks
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <AvatarEditor
        ref={editorRef}
        image={
          typeof image === 'string' && noImageCache
            ? `${image}?${new Date().getTime()}`
            : image
        }
        width={width}
        height={height}
        border={border}
        color={color}
        scale={scale}
        rotate={rotate}
        borderRadius={borderRadius}
        crossOrigin="anonymous"
        disableBoundaryChecks={disableBoundaryChecks}
      />
    </div>
  )
}
