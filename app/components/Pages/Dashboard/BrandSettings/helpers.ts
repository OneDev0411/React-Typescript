import isEqual from 'lodash/isEqual'

import { DEFAULT_BRAND_PALETTE } from 'utils/constants'

import { SidebarSection, SidebarSectionField } from './types'

export function getSimpleSidebarSections(): SidebarSection[] {
  const paletteSection: SidebarSection = {
    name: 'Brand Palette',
    fields: [
      {
        names: [
          'body-logo-square',
          'container-logo-square',
          'body-logo-wide',
          'container-logo-wide',
          'inverted-logo-square',
          'inverted-logo-wide'
        ],
        type: 'image',
        label: 'Logo'
      },
      {
        names: [
          'container-text-color',
          'h1-text-color',
          'h2-text-color',
          'h3-text-color',
          'inverted-container-bg-color',
          'button-bg-color'
        ],
        type: 'color',
        label: 'Primary Color'
      }
    ]
  }

  return [paletteSection]
}

export function getSidebarSections(): SidebarSection[] {
  const informationSection: SidebarSection = {
    name: 'Information',
    fields: [
      {
        names: ['name'],
        type: 'text',
        label: 'Brand Name'
      },
      {
        names: ['phone_number'],
        type: 'text',
        label: 'Phone Number'
      },
      {
        names: ['website'],
        type: 'text',
        label: 'Website'
      }
    ]
  }
  const bodySection: SidebarSection = {
    name: 'Body',
    fields: [
      {
        names: ['body-logo-square'],
        type: 'image',
        label: 'Square Logo'
      },
      {
        names: ['body-logo-wide'],
        type: 'image',
        label: 'Wide Logo'
      },
      'divider',
      {
        names: ['body-bg-color'],
        type: 'color',
        label: 'Background Color'
      },
      {
        names: ['body-text-color'],
        type: 'color',
        label: 'Text Color'
      },
      {
        names: ['body-font-family'],
        type: 'font-family',
        label: 'Font Family'
      },
      {
        names: ['body-font-size'],
        type: 'pixel',
        label: 'Font Size'
      },
      {
        names: ['body-font-weight'],
        type: 'font-weight',
        label: 'Font Weight'
      }
    ]
  }
  const containerSection: SidebarSection = {
    name: 'Container',
    fields: [
      {
        names: ['container-logo-square'],
        type: 'image',
        label: 'Square Logo'
      },
      {
        names: ['container-logo-wide'],
        type: 'image',
        label: 'Wide Logo'
      },
      'divider',
      {
        names: ['container-bg-color'],
        type: 'color',
        label: 'Background Color'
      },
      {
        names: ['container-text-color'],
        type: 'color',
        label: 'Text Color'
      },
      {
        names: ['container-font-family'],
        type: 'font-family',
        label: 'Font Family'
      },
      {
        names: ['container-font-size'],
        type: 'pixel',
        label: 'Font Size'
      },
      {
        names: ['container-font-weight'],
        type: 'font-weight',
        label: 'Font Weight'
      },
      {
        names: ['light-text-color'],
        type: 'color',
        label: 'Light Text Color'
      },
      {
        names: ['light-font-family'],
        type: 'font-family',
        label: 'Light Font Family'
      },
      {
        names: ['light-font-size'],
        type: 'pixel',
        label: 'Light Font Size'
      },
      {
        names: ['light-font-weight'],
        type: 'font-weight',
        label: 'Light Font Weight'
      }
    ]
  }

  const colorizedContainerSection: SidebarSection = {
    name: 'Colorized Container',
    fields: [
      {
        names: ['inverted-logo-square'],
        type: 'image',
        label: 'Square Logo'
      },
      {
        names: ['inverted-logo-wide'],
        type: 'image',
        label: 'Wide Logo'
      },
      'divider',
      {
        names: ['inverted-container-bg-color'],
        type: 'color',
        label: 'Background Color'
      },
      {
        names: ['inverted-container-text-color'],
        type: 'color',
        label: 'Text Color'
      },
      {
        names: ['inverted-light-text-color'],
        type: 'color',
        label: 'Light Text Color'
      },
      {
        names: ['inverted-h1-text-color'],
        type: 'color',
        label: 'H1 Text Color'
      },
      {
        names: ['inverted-h2-text-color'],
        type: 'color',
        label: 'H2 Text Color'
      },
      {
        names: ['inverted-h3-text-color'],
        type: 'color',
        label: 'H3 Text Color'
      },
      {
        names: ['inverted-button-text-color'],
        type: 'color',
        label: 'Button Text Color'
      },
      {
        names: ['inverted-button-bg-color'],
        type: 'color',
        label: 'Button Background Color'
      }
    ]
  }

  const headersSection: SidebarSection = {
    name: 'Headers',
    fields: [
      {
        names: ['h1-font-family'],
        type: 'font-family',
        label: 'H1 Font Family'
      },
      {
        names: ['h1-font-size'],
        type: 'pixel',
        label: 'H1 Font Size'
      },
      {
        names: ['h1-font-weight'],
        type: 'font-weight',
        label: 'H1 Font Weight'
      },
      {
        names: ['h1-text-color'],
        type: 'color',
        label: 'H1 Text Color'
      },
      'divider',
      {
        names: ['h2-font-family'],
        type: 'font-family',
        label: 'H2 Font Family'
      },
      {
        names: ['h2-font-size'],
        type: 'pixel',
        label: 'H2 Font Size'
      },
      {
        names: ['h2-font-weight'],
        type: 'font-weight',
        label: 'H2 Font Weight'
      },
      {
        names: ['h2-text-color'],
        type: 'color',
        label: 'H2 Text Color'
      },
      'divider',
      {
        names: ['h3-font-family'],
        type: 'font-family',
        label: 'H3 Font Family'
      },
      {
        names: ['h3-font-size'],
        type: 'pixel',
        label: 'H3 Font Size'
      },
      {
        names: ['h3-font-weight'],
        type: 'font-weight',
        label: 'H3 Font Weight'
      },
      {
        names: ['h3-text-color'],
        type: 'color',
        label: 'H3 Text Color'
      }
    ]
  }

  const buttonsSection: SidebarSection = {
    name: 'Buttons',
    fields: [
      {
        names: ['button-font-family'],
        type: 'font-family',
        label: 'Font Family'
      },
      {
        names: ['button-font-size'],
        type: 'pixel',
        label: 'Font Size'
      },
      {
        names: ['button-font-weight'],
        type: 'font-weight',
        label: 'Font Weight'
      },
      {
        names: ['button-text-color'],
        type: 'color',
        label: 'Text Color'
      },
      {
        names: ['button-bg-color'],
        type: 'color',
        label: 'Background Color'
      },
      {
        names: ['button-border'],
        type: 'border',
        label: 'Border Color'
      }
    ]
  }

  return [
    informationSection,
    bodySection,
    containerSection,
    colorizedContainerSection,
    headersSection,
    buttonsSection
  ]
}

export function getPreferredSidebarView(
  settings: BrandMarketingPalette
): 'simple' | 'full' {
  if (isEqual(settings, DEFAULT_BRAND_PALETTE)) {
    return 'simple'
  }

  const simpleSidebarSections = getSimpleSidebarSections()
  const shouldShowSimple = simpleSidebarSections.every(section => {
    return section.fields.every((field: SidebarSectionField) => {
      const intendedValue = settings[field.names[0]]

      return field.names.every(
        fieldName => settings[fieldName] === intendedValue
      )
    })
  })

  if (shouldShowSimple) {
    return 'simple'
  }

  return 'full'
}
