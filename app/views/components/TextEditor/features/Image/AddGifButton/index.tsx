import * as React from 'react'

import { Tooltip } from '@material-ui/core'

import useToggle from 'react-use/lib/useToggle'

import { mdiGif } from '@mdi/js'

import GifDrawer from 'components/GifDrawer'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { ToolbarIconButton } from '../../../components/ToolbarIconButton'
import { GifItem } from '../../../../GifDrawer/types'

interface Props {
  onImageSelected: (url: string, width: number) => void
}

/**
 * When clicked, opens a dialog which lets user select a gif and finally
 * calls `onImageSelected` prop with the url of the selected gif image.
 * @param props
 * @constructor
 */
export function AddGifButton(props: Props) {
  const [gifDrawerOpen, toggleGifDrawerOpen] = useToggle(false)

  const onSelect = (item: GifItem) => {
    if (item && gifDrawerOpen) {
      toggleGifDrawerOpen(false)
      props.onImageSelected(item.url, item.dims[0])
    }
  }

  return (
    <>
      <Tooltip title="Search and insert GIF">
        <ToolbarIconButton onClick={toggleGifDrawerOpen}>
          <SvgIcon path={mdiGif} />
        </ToolbarIconButton>
      </Tooltip>
      <GifDrawer
        isOpen={gifDrawerOpen}
        onClose={toggleGifDrawerOpen}
        onSelect={onSelect}
      />
    </>
  )
}
