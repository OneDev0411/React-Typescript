import React, { ReactNode } from 'react'

import { getShortcutTooltip } from 'utils/get-shortcut-tooltip'

import { ToolbarToggleButton } from './ToolbarToggleButton'
import IconBold from '../../SvgIcons/Bold/IconBold'
import IconItalic from '../../SvgIcons/Italic/IconItalic'
import IconUnderline from '../../SvgIcons/Underline/IconUnderline'
import { Separator } from '../styled'
import IconList from '../../SvgIcons/List/ListIcon'
import IconNumberedList from '../../SvgIcons/NumberedList/IconNumberedList'
import HeadingButtons from './HeadingButtons'
import { iconSizes } from '../../SvgIcons/icon-sizes'
import { RichTextFeature } from '../types'

interface Props {
  richButtonsPlugin: any
  features?: RichTextFeature[]
}

export function RichTextButtons({
  richButtonsPlugin,
  features = Object.values(RichTextFeature)
}: Props) {
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

  const buttons: { feature: RichTextFeature; ui: ReactNode }[] = [
    {
      feature: RichTextFeature.INLINE_FORMATTING,
      ui: (
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
        </>
      )
    },
    {
      feature: RichTextFeature.LIST,
      ui: (
        <>
          <ULButton>
            <ToolbarToggleButton tooltip="Bulleted List" isBlockButton>
              <IconList color="inherit" size={iconSizes.small} />
            </ToolbarToggleButton>
          </ULButton>

          <OLButton>
            <ToolbarToggleButton tooltip="Numbered List" isBlockButton>
              <IconNumberedList />
            </ToolbarToggleButton>
          </OLButton>
        </>
      )
    },
    {
      feature: RichTextFeature.SIZE,
      ui: (
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
      )
    }
  ]

  return (
    <>
      {buttons
        .filter(({ feature }) => features!.includes(feature))
        .map(({ feature, ui }) => (
          <React.Fragment key={feature}>
            {ui}
            <Separator />
          </React.Fragment>
        ))}
    </>
  )
}
