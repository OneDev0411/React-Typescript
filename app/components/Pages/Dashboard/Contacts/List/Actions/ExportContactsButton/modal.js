import React from 'react'

import ActionButton from 'components/Button/ActionButton'
import RadioButton from 'components/RadioButton'
import BareModal from 'components/BareModal'

const SAME_ROW_DOWNLOAD_TYPE = 'same'
const SEPARATE_ROW_DOWNLOAD_TYPE = 'separate'
const EXAMPLE_CONTACT_TYPES = ['Primary Contact', 'Partner Contact']

export default function Modal({
  isOpen,
  onClose,
  downloadType = SAME_ROW_DOWNLOAD_TYPE,
  onExportClick,
  onExportTypeChange
}) {
  return (
    <BareModal isOpen={isOpen} onRequestClose={onClose}>
      <div
        style={{
          padding: '0.375rem 1.25rem',
          textAlign: 'center',
          userSelect: 'none'
        }}
      >
        <h2 style={{ fontWeight: 600 }}>
          How do you want partner names to display in spreadsheet?
        </h2>
        <div
          style={{
            marginTop: '1.25rem',
            fontSize: '0.875rem',
            height: '7.5rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#f5f5f5',
              width: '50%',
              float: 'left',
              display: 'flex',
              flexDirection: 'row',
              height: '100%',
              alignItems: 'center'
            }}
          >
            {downloadType === SAME_ROW_DOWNLOAD_TYPE && (
              <ul style={{ padding: 0, margin: 0, width: '100%' }}>
                {EXAMPLE_CONTACT_TYPES.map(item => (
                  <li
                    key={item}
                    style={{
                      backgroundColor: '#e0e0e0',
                      display: 'inline-block',
                      width: '48%',
                      margin: '1%',
                      height: '2.375rem',
                      padding: '0.4375rem 0.5rem'
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {downloadType === SEPARATE_ROW_DOWNLOAD_TYPE && (
              <ul style={{ padding: 0, margin: 0, width: '100%' }}>
                {EXAMPLE_CONTACT_TYPES.map(item => (
                  <li
                    key={item}
                    style={{
                      backgroundColor: '#e0e0e0',
                      display: 'block',
                      height: '2.375rem',
                      padding: '0.4375rem 0.5rem',
                      margin: '1% 0'
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            style={{
              float: 'right',
              width: '45%',
              textAlign: 'left',
              marginTop: '0.9375rem'
            }}
          >
            <RadioButton
              selected={downloadType === SAME_ROW_DOWNLOAD_TYPE}
              title="Same row"
              caption="Good for sending out mailers"
              onClick={() => onExportTypeChange(SAME_ROW_DOWNLOAD_TYPE)}
            />
            <RadioButton
              selected={downloadType === SEPARATE_ROW_DOWNLOAD_TYPE}
              title="Separate rows"
              caption="Good for sending out email"
              onClick={() => onExportTypeChange(SEPARATE_ROW_DOWNLOAD_TYPE)}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '48%',
            margin: '3.3125rem auto'
          }}
        >
          <ActionButton
            style={{
              width: '6.25rem',
              padding: '0 1.625rem'
            }}
            appearance="outline"
            onClick={onClose}
          >
            Cancel
          </ActionButton>
          <ActionButton
            style={{
              width: '8.75rem',
              padding: '0 2.875rem'
            }}
            onClick={onExportClick}
          >
            Export
          </ActionButton>
        </div>
      </div>
    </BareModal>
  )
}
