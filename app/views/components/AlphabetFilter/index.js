import React from 'react'
import Flex from 'styled-flex-component'

import { Divider } from 'components/Divider'

import { LetterButton, LetterButtonContent } from './styled'

const alphabet = new Array(26)
  .fill(null)
  .map((_, i) => String.fromCharCode('A'.charCodeAt(0) + i))

/**
 * A component which enables filtering based on first letter in alphabet
 * @param value
 * @param onChange
 * @returns {*}
 * @constructor
 */
export function AlphabetFilter({ value, onChange }) {
  return (
    <Flex full row alignCenter justifyEvenly style={{ marginLeft: '1rem' }}>
      <LetterButton onClick={() => onChange(null)} active={!value}>
        <LetterButtonContent>All</LetterButtonContent>
      </LetterButton>
      <Divider vertical height=".9rem" margin=".5rem" />
      {alphabet.map(letter => (
        <LetterButton
          active={letter === value}
          onClick={() => onChange(letter)}
          key={letter}
        >
          <LetterButtonContent>{letter}</LetterButtonContent>
        </LetterButton>
      ))}
    </Flex>
  )
}
