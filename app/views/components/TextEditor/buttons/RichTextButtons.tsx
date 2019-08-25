import React from 'react'

import { getShortcutTooltip } from 'utils/get-shortcut-tooltip'

import { ToolbarToggleButton } from './ToolbarToggleButton'
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
        <ToolbarToggleButton
          tooltip={getShortcutTooltip('Bold', 'B')}
          edge="start"
        >
          <IconBold />
        </ToolbarToggleButton>
      </BoldButton>

      <ItalicButton>
        <ToolbarToggleButton tooltip={getShortcutTooltip('Italic', 'I')}>
          <IconItalic />
        </ToolbarToggleButton>
      </ItalicButton>

      <UnderlineButton>
        <ToolbarToggleButton tooltip={getShortcutTooltip('Underline', 'U')}>
          <IconUnderline />
        </ToolbarToggleButton>
      </UnderlineButton>

      <Separator />

      <ULButton>
        <ToolbarToggleButton tooltip="Bulleted List" isBlockButton>
          <IconList color="inherit" size={{ width: 16, height: 16 }} />
        </ToolbarToggleButton>
      </ULButton>

      <OLButton>
        <ToolbarToggleButton tooltip="Numbered List" isBlockButton>
          <IconNumberedList />
        </ToolbarToggleButton>
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
