import React from 'react'
import Flex from 'styled-flex-component'

import { Section } from '../components/Section'
import Icon from '../../../../../../views/components/SvgIcons/LastTouched/IconLastTouched.js'

export function LastTouched(props) {
  const { last_touch } = props.contact

  return (
    <Section
      title="Last Touched"
      bodyStyle={{
        padding: '1em',
        fontSize: '1.6rem',
        color: last_touch ? '#17283a' : '#8da2b5'
      }}
    >
      <Flex alignCenter>
        <Icon
          style={{
            marginRight: '1em',
            fill: last_touch ? '#17283a' : '#8da2b5'
          }}
        />
        {last_touch ? (
          <div>
            Last Touch was 3 days ago, you wanted to be in touch every 7 days.
          </div>
        ) : (
          <div>You have not added any touches for this contact.</div>
        )}
      </Flex>
    </Section>
  )
}
