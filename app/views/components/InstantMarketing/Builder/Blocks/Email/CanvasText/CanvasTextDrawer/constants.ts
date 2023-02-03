import { Konva, LabelConfig } from 'pikaso'

export interface CanvasTextProperties {
  container: Konva.LabelConfig
  text: Konva.TextConfig
  tag: Konva.TagConfig
  config?: LabelConfig
}

export const DefaultCanvasTextProperties: CanvasTextProperties = {
  container: {
    x: 0,
    y: 0
  },
  text: {
    text: 'Sample Text',
    fontSize: 40,
    fontFamily: 'Lato',
    lineHeight: 1.1,
    padding: 10,
    fill: '#000'
  },
  tag: {
    fill: 'transparent'
  }
}
