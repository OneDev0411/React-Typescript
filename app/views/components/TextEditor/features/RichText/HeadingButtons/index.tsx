import React from 'react'

import { Tooltip } from '@material-ui/core'
import { mdiFormatSize } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { BasicDropdown } from '../../../../BasicDropdown/index'
import { ToolbarIconButton } from '../../../components/ToolbarIconButton'

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
      buttonRenderer={({
        isBlock,
        noBorder,
        isOpen,
        selectedItem,
        ...props
      }) => (
        <Tooltip title="Size">
          <ToolbarIconButton {...props}>
            <SvgIcon path={mdiFormatSize} />
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
