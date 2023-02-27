import { IRect } from '../types'

const DefaultAttributes = [
  'data-type',
  'css-class',
  'padding',
  'alt',
  'title',
  'width',
  'height',
  'data-json',
  'src'
]

export function logResult({
  text,
  json,
  rect,
  attrs
}: {
  text: string
  json: object
  rect: IRect
  attrs: Record<string, string>
}) {
  const attributes = Object.entries(attrs)
    .reduce((list, [key, value]) => {
      return DefaultAttributes.includes(key)
        ? list
        : [...list, `  ${key}="${value}"`]
    }, [])
    .join('\n')

  // This snippet will be used by template team
  console.log(`
{% set fancyFont %}
${JSON.stringify({ ...json, url: './blocks.json' })}
{% endset %}
<mj-image
  data-type="canvas-text"
  css-class="fancy-font"
  padding="0"
  alt="${text}"
  title="${text}"
  width="${parseInt(rect.width.toString(), 10)}" 
  height="auto" 
  data-json="{{ fancyFont | encode }}" 
  src="https://fancy.rechat.com/text.png?q={{fancyFont | encode }}"
${attributes}>
</mj-image>`)
}
