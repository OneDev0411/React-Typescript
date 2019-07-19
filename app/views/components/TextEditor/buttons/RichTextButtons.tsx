import React from 'react'

import IconButton from './IconButton'
import IconBold from '../../SvgIcons/Bold/IconBold'
import IconItalic from '../../SvgIcons/Italic/IconItalic'
import IconUnderline from '../../SvgIcons/Underline/IconUnderline'
import { Separator } from '../styled'
import IconList from '../../SvgIcons/List/ListIcon'
import IconNumberedList from '../../SvgIcons/NumberedList/IconNumberedList'
import HeadingButtons from './HeadingButtons'

export function RichTextButtons({ richButtonsPlugin }) {
  const {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    OLButton,
    ULButton,
    H1Button,
    H3Button,
    H4Button,
    H6Button
  } = richButtonsPlugin

  return (
    <>
      <BoldButton>
        <IconButton>
          <IconBold />
        </IconButton>
      </BoldButton>

      <ItalicButton>
        <IconButton>
          <IconItalic />
        </IconButton>
      </ItalicButton>

      <UnderlineButton>
        <IconButton>
          <IconUnderline />
        </IconButton>
      </UnderlineButton>

      <Separator />

      <ULButton>
        <IconButton isBlockButton>
          <IconList />
        </IconButton>
      </ULButton>

      <OLButton>
        <IconButton isBlockButton>
          <IconNumberedList />
        </IconButton>
      </OLButton>

      <Separator />

      <HeadingButtons
        options={[
          {
            title: 'Small',
            component: H6Button
          },
          {
            title: 'Medium',
            component: H4Button
          },
          {
            title: 'Large',
            component: H3Button
          },
          {
            title: 'Huge',
            component: H1Button
          }
        ]}
      />

      <Separator />
    </>
  )
}
