

type Modifiers = Partial<Pick<KeyboardEvent, 'ctrlKey' | 'altKey' | 'shiftKey'>>

export function getShortcutTooltip(title: string, key: string, modifiers: Modifiers = {
  ctrlKey: true
}){
  return `${title} (${modifiers2String(modifiers) + key})`
}

const isMac = typeof navigator !== undefined && navigator.platform.toUpperCase().indexOf('MAC')>=0;

const ctrlSymbol = isMac ? '⌘' : 'Ctrl+'
const shiftSymbol = isMac ? '⇧' : 'Shift+'
const altSymbol = isMac ? '⌥' : 'Alt+'


function modifiers2String(modifiers: Modifiers){
  const ctrlKey = modifiers.ctrlKey ? ctrlSymbol : ''
  const shiftKey = modifiers.shiftKey ? shiftSymbol : ''
  const altKey = modifiers.altKey ? altSymbol : ''
  return `${altKey}${ctrlKey}${shiftKey}`
}
