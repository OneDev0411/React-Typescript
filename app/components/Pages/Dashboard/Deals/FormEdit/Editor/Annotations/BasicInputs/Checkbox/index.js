import React from 'react'

import { useTheme } from '@material-ui/core'

import parseAppearanceString from 'deals/FormEdit/utils/appearance'
import { normalizeCheckboxValue } from 'deals/FormEdit/utils/normalize-checkbox-value'
import { Types } from 'deals/FormEdit/utils/types'

import { EditTemplateButton } from 'deals/FormEdit/components/EditTemplateButton'

import { CheckboxInput } from './styled'

export default React.memo(props => {
  const theme = useTheme()

  const { annotation } = props
  const { rect } = annotation

  const appearance = parseAppearanceString(annotation.defaultAppearance)

  const box = {
    left: rect[0],
    top: rect[1],
    width: Math.floor(rect[2] - rect[0]),
    height: Math.floor(rect[3] - rect[1])
  }

  return (
    <>
      <CheckboxInput
        type="checkbox"
        className="input-with-template"
        title={annotation.fieldName}
        id={annotation.fieldName}
        box={box}
        appearance={appearance}
        key={annotation.fieldName}
        onClick={e =>
          props.onChange({
            [props.annotation.fieldName]: e.target.checked
          })
        }
        defaultChecked={normalizeCheckboxValue(props.defaultValue)}
      />

      <EditTemplateButton
        style={{
          left: box.left - box.width - theme.spacing(1.5),
          top: box.top - theme.spacing(0.5)
        }}
        annotation={props.annotation}
        type={Types.CHECKBOX_ANNOTATION}
      />
    </>
  )
})
