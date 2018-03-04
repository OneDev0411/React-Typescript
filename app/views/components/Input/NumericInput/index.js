import React from 'react'
import Input from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

function validate(props) {
  const { value, min, max } = props

  if (min && parseFloat(value) < min) {
    return false
  }

  if (max && parseFloat(value) > max) {
    return false
  }

  return true
}

export default props => {
  const { min, max } = props
  const style = {}
  const opt = Object.assign(
    {
      allowNegative: false,
      allowDecimal: false
    },
    props.options || {}
  )

  const isValid = validate(props)

  if (!isValid) {
    style.border = '1px solid red'
  }

  return (
    <div style={{ position: 'relative', display: 'inline' }}>
      <Input
        placeholder={props.placeholder || ''}
        style={style}
        mask={createNumberMask({
          prefix: '',
          suffix: '',
          includeThousandsSeparator: false,
          allowNegative: opt.allowNegative,
          allowLeadingZeroes: false,
          allowDecimal: opt.allowDecimal
        })}
        {...props}
      />

      {props.value &&
        !isValid && (
          <span
            style={{ position: 'absolute', right: '5px', top: '30%' }}
            data-balloon={`value must be greater than ${min} and lower than ${max}`}
            data-balloon-pos="up"
          >
            <i
              style={{
                verticalAlign: 'middle',
                fontSize: '18px',
                color: '#ec4b35'
              }}
              className="fa fa-times-circle"
            />
          </span>
        )}
    </div>
  )
}
