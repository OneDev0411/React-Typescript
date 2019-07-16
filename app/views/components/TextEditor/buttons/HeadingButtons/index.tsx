import React from 'react'

import { BasicDropdown } from 'components/BasicDropdown'
import IconTextSize from 'components/SvgIcons/TextSize/IconTextSize'

import { TextButton } from './TextButton'

interface HeadingButtonOption {
  title: string
  component: React.Component
}
interface Props {
  options: HeadingButtonOption[]
}

export default function HeadingButtons(props: Props) {
  return (
    <BasicDropdown
      items={props.options.map(item => ({
        label: item.title,
        Component: item.component
      }))}
      buttonRenderer={props => (
        <div
          {...props}
          style={{
            width: '1.5rem',
            heigt: '1.5rem',
            marginRight: '0.5rem'
          }}
        >
          <IconTextSize />
        </div>
      )}
      itemRenderer={(props, index) => {
        const { Component, label } = props.item

        return (
          <div key={index} {...props}>
            <Component>
              <TextButton title={label} />
            </Component>
          </div>
        )
      }}
    />
  )
}
