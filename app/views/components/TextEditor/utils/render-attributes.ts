export const renderAttributes = (attrs: StringMap<string>) =>
  Object.entries(attrs)
    .map(([name, value]) => renderAttribute(name, value))
    .join(' ')
const renderAttribute = (name: string, value: string) =>
  value != undefined ? (value ? `${name}="${value}"` : name) : ''
