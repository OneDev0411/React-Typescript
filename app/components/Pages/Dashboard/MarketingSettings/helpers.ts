import { SidebarSection } from './types'

export function getSidebarSections(
  settings: BrandSettingsPalette
): SidebarSection[] {
  const logosSection: SidebarSection = {
    name: 'Logos',
    fields: [
      {
        name: 'container-logo-square',
        type: 'image',
        label: 'Container Square'
      },
      {
        name: 'container-logo-wide',
        type: 'image',
        label: 'Container Wide'
      },
      {
        name: 'body-logo-square',
        type: 'image',
        label: 'Body Square'
      },
      {
        name: 'body-logo-wide',
        type: 'image',
        label: 'Body Wide'
      }
    ]
  }

  const containerSection: SidebarSection = {
    name: 'Container',
    fields: [
      {
        name: 'container-bg-color',
        type: 'color',
        label: 'Background Color'
      },
      {
        name: 'container-font-family',
        type: 'font-family',
        label: 'Font Family'
      },
      {
        name: 'container-font-size',
        type: 'pixel',
        label: 'Font Size'
      },
      {
        name: 'container-font-weight',
        type: 'font-weight',
        label: 'Font Weight'
      }
    ]
  }

  return [logosSection, containerSection]
}
