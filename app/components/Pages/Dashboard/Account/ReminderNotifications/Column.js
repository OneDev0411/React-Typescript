import React from 'react'
import Flex, { FlexItem } from 'styled-flex-component'

import Item from './Item'

export default function({ title, items, settings, options, onChange }) {
  return (
    <Flex
      full
      column
      style={{
        paddingLeft: '2rem'
      }}
    >
      <h2 style={{ marginBottom: '3rem' }}>{title}</h2>
      {items.map(item => (
        <FlexItem key={item.name}>
          <Item
            {...item}
            value={
              (
                settings.find(
                  setting =>
                    setting.object_type === item.type &&
                    setting.event_type === item.name
                ) || {}
              ).reminder
            }
            options={options}
            onChange={onChange}
          />
        </FlexItem>
      ))}
    </Flex>
  )
}
