import React from 'react'

import { Tooltip } from '@material-ui/core'

import { BasicDropdown } from '../../../../BasicDropdown/index'
import IconTextSize from '../../../../SvgIcons/TextSize/IconTextSize'

import { TextButton } from './TextButton'
import { ToolbarIconButton } from '../../../components/ToolbarIconButton'

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
        <Tooltip title="Size">
          <ToolbarIconButton {...props}>
            <IconTextSize />
          </ToolbarIconButton>
        </Tooltip>
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
