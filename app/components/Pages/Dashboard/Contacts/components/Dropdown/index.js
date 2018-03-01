import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, MenuItem } from 'react-bootstrap'

const propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.shape({
    title: PropTypes.string,
    icon: PropTypes.shape({
      color: PropTypes.string,
      name: PropTypes.string.isRequired
    })
  }).isRequired,
  disabled: PropTypes.bool,
  handleParse: PropTypes.func,
  defaultTitle: PropTypes.string,
  handleOnSelect: PropTypes.func.isRequired
}

const defaultProps = {
  disabled: false,
  handleParse: i => i
}

function DropDownWithIcon({
  name,
  options,
  disabled,
  handleParse,
  defaultTitle,
  handleOnSelect
}) {
  let selectedOption = 'default'
  const selectedOptions = Object.keys(options).filter(
    option => options[option].title === defaultTitle
  )

  if (selectedOptions.length === 1) {
    ;[selectedOption] = selectedOptions
  }

  const { icon: selectedOptionIcon, title: selectedOptionTitle } = options[
    selectedOption
  ]

  const getIcon = ({ name, color }) => (
    <i
      className={`fa fa-${name}`}
      style={{
        marginRight: '.5em',
        color
      }}
    />
  )

  return (
    <span className="contact-stages">
      <Dropdown
        disabled={disabled}
        id={`${name}__dropdown`}
        title={selectedOptionTitle}
        onSelect={(option, event) => {
          const { title } = options[option]

          handleOnSelect(handleParse(title))
          event.stopPropagation()
        }}
        onClick={event => {
          event.stopPropagation()
        }}
      >
        <Dropdown.Toggle>
          {selectedOptionIcon && getIcon(selectedOptionIcon)}
          {selectedOptionTitle}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.keys(options)
            .filter(item => item.toLowerCase() !== selectedOption)
            .map((fieldName, index) => {
              const { icon, title } = options[fieldName]

              return (
                <MenuItem
                  eventKey={fieldName}
                  key={`${name}__dropdown__${index}`}
                  className={fieldName === selectedOption ? 'selected' : ''}
                >
                  {icon && getIcon(icon)}
                  {title}
                </MenuItem>
              )
            })}
        </Dropdown.Menu>
      </Dropdown>
    </span>
  )
}

DropDownWithIcon.propTypes = propTypes
DropDownWithIcon.defaultProps = defaultProps

export default DropDownWithIcon
