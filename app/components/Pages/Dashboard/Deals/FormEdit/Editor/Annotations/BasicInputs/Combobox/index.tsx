import React from 'react'

import { EditTemplateButton } from 'deals/FormEdit/components/EditTemplateButton'
import { Types } from 'deals/FormEdit/utils/types'

interface Props {
  annotation: IFormAnnotation
  defaultValue?: Nullable<string>
  onChange: (data: Record<string, string>) => void
}

export default React.memo(
  ({ annotation, defaultValue, onChange }: Props) => {
    const { rect } = annotation
    const options = annotation.options || []

    const bounds = {
      top: rect[1],
      left: rect[0],
      right: rect[2],
      bottom: rect[3]
    }

    const box = {
      top: bounds.top,
      left: bounds.left,
      width: Math.floor(bounds.right - bounds.left),
      height: Math.floor(bounds.bottom - bounds.top)
    }

    const style = {
      position: 'absolute' as React.CSSProperties['position'],
      left: `${box.left}px`,
      top: `${box.top}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
      backgroundColor: '#d2e5f2',
      border: '1px solid #ccc',
      minWidth: '16px',
      fontSize: '12px'
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({
        [annotation.fieldName]: e.target.value
      })
    }

    return (
      <>
        <select
          style={style}
          className="input-with-template"
          defaultValue={defaultValue || ''}
          onChange={handleChange}
        >
          {options.map((option, index) => (
            <option key={index} value={option.exportValue}>
              {option.displayValue}
            </option>
          ))}
        </select>

        <EditTemplateButton
          style={{
            left: `${box.left}px`,
            top: `${box.top + box.height / 10}px`,
            height: `${box.height}px`
          }}
          annotation={annotation}
          type={Types.COMBOBOX_ANNOTATION}
        />
      </>
    )
  },
  () => true
)
