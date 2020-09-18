import React from 'react'

import { IconButton, useTheme } from '@material-ui/core'

import { mdiFileDocumentEdit } from '@mdi/js'

import parseAppearanceString from 'deals/FormEdit/utils/appearance'
import { normalizeCheckboxValue } from 'deals/FormEdit/utils/normalize-checkbox-value'
import { Types } from 'deals/FormEdit/utils/types'
import { useDefaultValueContext } from 'deals/FormEdit/Editor/DefaultValues/use-default-value-content'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { CheckboxInput } from './styled'

export default React.memo(props => {
  const theme = useTheme()

  const { annotation } = props
  const { rect } = annotation

  const appearance = parseAppearanceString(annotation.defaultAppearance)
  const defaultValueContext = useDefaultValueContext()

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

      <IconButton
        className="button-default-value"
        variant="outlined"
        color="secondary"
        size="small"
        style={{
          position: 'absolute',
          left: box.left - box.width,
          top: box.top - theme.spacing(3),
          cursor: 'pointer'
        }}
        onClick={() =>
          defaultValueContext.setAnnotation(
            props.annotation,
            Types.CHECKBOX_ANNOTATION
          )
        }
      >
        <SvgIcon
          size={`${theme.spacing(2)}px`}
          path={mdiFileDocumentEdit}
          color={theme.palette.secondary.main}
        />
      </IconButton>
    </>
  )
})
