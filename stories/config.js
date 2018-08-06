import { configure } from '@storybook/react'

import buttons from './components/buttons'

function loadStories() {
  console.clear()

  buttons()
}

configure(loadStories, module)
