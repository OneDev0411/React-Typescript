import React from 'react'
import { FormControl } from 'react-bootstrap'

class MultiField extends React.Component {
  render = () => {
    const {
      list,
      attribute,
      prefix,
      placeholder,
      onChange,
      onAdd,
      onRemove,
      maxItems = 3,
      errorMessage,
      invalidFields
    } = this.props

    return (
      <div className="multiple">
        {list.map((item, index) => {
          const key = `${prefix}_${index}`
          const isInvalid = invalidFields.includes(key.toLowerCase())

          return (
            <div className="m-row" key={key}>
              <FormControl
                placeholder={placeholder}
                onChange={event => {
                  const { value } = event.target

                  onChange(attribute, index, value)
                }}
              />

              {isInvalid && (
                <span
                  data-balloon-visible
                  data-balloon-pos="up"
                  data-balloon-length="large"
                  className="c-field-balloon c-field-balloon--error"
                  data-balloon={errorMessage}
                />
              )}

              {index === 0 &&
                list.length <= maxItems && (
                  <img
                    src="/static/images/contacts/add.svg"
                    onClick={() => onAdd(attribute)}
                  />
                )}

              {index > 0 && (
                <img
                  src="/static/images/contacts/remove.svg"
                  onClick={e => onRemove(attribute, key)}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }
}

export default MultiField
