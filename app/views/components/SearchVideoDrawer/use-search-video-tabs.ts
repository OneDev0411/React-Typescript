import { Dispatch, SetStateAction, useState } from 'react'

import type { Model } from 'backbone'

import { VideoTab } from './types'

type Tabs = Record<
  VideoTab,
  {
    label: string
    value: VideoTab
  }
>

type UseSearchVideoTabs = [Tabs, VideoTab, Dispatch<SetStateAction<VideoTab>>]

export function useSearchVideoTabs(model: Nullable<Model>): UseSearchVideoTabs {
  const modelTagName: Nullable<string> = model && model.get('tagName')

  const [activeTab, setActiveTab] = useState<VideoTab>(
    modelTagName !== 'video' ? VideoTab.Online : VideoTab.Gallery
  )

  const tabs = {
    [VideoTab.Online]: {
      label: 'Online Videos',
      value: VideoTab.Online
    },
    [VideoTab.Gallery]: {
      label: 'Your Gallery',
      value: VideoTab.Gallery
    },
    [VideoTab.Videobolt]: {
      label: 'Videobolt',
      value: VideoTab.Videobolt
    }
  }

  return [tabs, activeTab, setActiveTab]
}
