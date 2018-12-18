import React, { Fragment } from 'react'
import Slider from 'rc-slider/lib/Slider'
import 'rc-slider/assets/index.css'

import ActionButton from '../Button/ActionButton'

export default function Footer({
  scale,
  disableRotate,
  disableScale,
  disableChangePhoto,
  onScaleChange,
  onRotateClick,
  onChange,
  onSave
}) {
  return (
    <Fragment>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '320px'
        }}
      >
        {disableScale || (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '260px'
            }}
          >
            <img
              src="/static/icons/image-icon.svg"
              alt="-"
              style={{ width: '14px', height: '14px' }}
            />
            <Slider
              min={1}
              max={2}
              step={0.01}
              defaultValue={scale}
              onChange={onScaleChange}
              style={{
                width: '190px',
                margin: '0',
                padding: '10px 0'
              }}
              trackStyle={{
                backgroundColor: '#004ce6'
              }}
              handleStyle={{
                borderColor: '#004ce6'
              }}
            />
            <img
              src="/static/icons/image-icon.svg"
              alt="+"
              style={{ width: '24px', height: '24px' }}
            />
          </div>
        )}
        {disableRotate || (
          <div>
            <button
              title="rotate"
              type="button"
              style={{ background: 'none', border: 'none', outline: 'none' }}
              onClick={onRotateClick}
            >
              <img
                src="/static/icons/rotate-icon.svg"
                alt="+"
                style={{ width: '24px', height: '24px' }}
              />
            </button>
          </div>
        )}
      </div>
      <div>
        {disableChangePhoto || (
          <ActionButton
            style={{ marginRight: '10px', width: '120px', paddingLeft: '11px' }}
            appearance="outline"
            onClick={onChange}
          >
            Change Photo
          </ActionButton>
        )}
        <ActionButton
          style={{ width: '120px', paddingLeft: '22px' }}
          onClick={async () => onSave()}
        >
          Save Photo
        </ActionButton>
      </div>
    </Fragment>
  )
}
