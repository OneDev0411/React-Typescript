import React from 'react'

import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import RadioButton from '../../../../../../../views/components/RadioButton'
import BareModal from '../../../../../../../views/components/BareModal'

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
          padding: '6px 20px',
          textAlign: 'center',
          userSelect: 'none'
        }}
      >
        <h2 style={{ fontWeight: 600 }}>
          How do you want partner names to display in spreadsheet?
        </h2>
        <div
          style={{
            marginTop: '20px',
            fontSize: '14px',
            height: '120px'
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
                      height: '38px',
                      padding: '7px 8px'
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
                      height: '38px',
                      padding: '7px 8px',
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
              marginTop: '15px'
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
            margin: '53px auto'
          }}
        >
          <ActionButton
            style={{
              width: '100px',
              padding: '0 26px'
            }}
            appearance="outline"
            onClick={onClose}
          >
            Cancel
          </ActionButton>
          <ActionButton
            style={{
              width: '140px',
              padding: '0 46px'
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
