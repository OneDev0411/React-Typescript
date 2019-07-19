export function getTitle(attribute_def, label) {
  if (attribute_def.has_label && label) {
    return `${label} (${attribute_def.label})`
  }

  return attribute_def.label
}
