import { SidebarSection } from './types'

export function getSidebarSections(): SidebarSection[] {
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
        name: 'inverted-container-bg-color',
        type: 'color',
        label: 'Inverted Background Color'
      },
      {
        name: 'container-text-color',
        type: 'color',
        label: 'Text Color'
      },
      {
        name: 'inverted-container-text-color',
        type: 'color',
        label: 'Inverted Text Color'
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

  const bodySection: SidebarSection = {
    name: 'Body',
    fields: [
      {
        name: 'body-bg-color',
        type: 'color',
        label: 'Background Color'
      },
      {
        name: 'body-text-color',
        type: 'color',
        label: 'Text Color'
      },
      {
        name: 'body-font-family',
        type: 'font-family',
        label: 'Font Family'
      },
      {
        name: 'body-font-size',
        type: 'pixel',
        label: 'Font Size'
      },
      {
        name: 'body-font-weight',
        type: 'font-weight',
        label: 'Font Weight'
      }
    ]
  }

  const headersSection: SidebarSection = {
    name: 'Headers',
    fields: [
      {
        name: 'h1-font-family',
        type: 'font-family',
        label: 'H1 Font Family'
      },
      {
        name: 'h1-font-size',
        type: 'pixel',
        label: 'H1 Font Size'
      },
      {
        name: 'h1-font-weight',
        type: 'font-weight',
        label: 'H1 Font Weight'
      },
      {
        name: 'h1-text-color',
        type: 'color',
        label: 'H1 Text Color'
      },
      {
        name: 'h2-font-family',
        type: 'font-family',
        label: 'H2 Font Family'
      },
      {
        name: 'h2-font-size',
        type: 'pixel',
        label: 'H2 Font Size'
      },
      {
        name: 'h2-font-weight',
        type: 'font-weight',
        label: 'H2 Font Weight'
      },
      {
        name: 'h2-text-color',
        type: 'color',
        label: 'H2 Text Color'
      },
      {
        name: 'h3-font-family',
        type: 'font-family',
        label: 'H3 Font Family'
      },
      {
        name: 'h3-font-size',
        type: 'pixel',
        label: 'H3 Font Size'
      },
      {
        name: 'h3-font-weight',
        type: 'font-weight',
        label: 'H3 Font Weight'
      },
      {
        name: 'h3-text-color',
        type: 'color',
        label: 'H3 Text Color'
      }
    ]
  }

  const buttonsSection: SidebarSection = {
    name: 'Buttons',
    fields: [
      {
        name: 'button-font-family',
        type: 'font-family',
        label: 'Font Family'
      },
      {
        name: 'button-font-size',
        type: 'pixel',
        label: 'Font Size'
      },
      {
        name: 'button-font-weight',
        type: 'font-weight',
        label: 'Font Weight'
      },
      {
        name: 'button-text-color',
        type: 'color',
        label: 'Text Color'
      },
      {
        name: 'inverted-button-text-color',
        type: 'color',
        label: 'Inverted Text Color'
      },
      {
        name: 'button-bg-color',
        type: 'color',
        label: 'Background Color'
      },
      {
        name: 'inverted-button-bg-color',
        type: 'color',
        label: 'Inverted Background Color'
      }
    ]
  }

  return [
    logosSection,
    containerSection,
    bodySection,
    headersSection,
    buttonsSection
  ]
}
