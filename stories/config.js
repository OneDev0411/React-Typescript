import { configure } from '@storybook/react'

import buttons from './components/buttons'
import dropdowns from './components/dropdowns'

function loadStories() {
  console.clear()

  buttons()
  dropdowns()
}

configure(loadStories, module)
