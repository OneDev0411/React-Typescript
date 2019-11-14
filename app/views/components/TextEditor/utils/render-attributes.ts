export const renderAttributes = (attrs: StringMap<string | undefined>) =>
  Object.entries(attrs)
    .map(([name, value]) => renderAttribute(name, value))
    .join(' ')
const renderAttribute = (name: string, value: string | undefined) =>
  value != undefined ? (value ? `${name}="${value}"` : name) : ''
