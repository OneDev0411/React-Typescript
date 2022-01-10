function stripTags(html: string): string {
  const tmp = document.createElement('DIV')

  tmp.innerHTML = html

  return tmp.textContent || tmp.innerText || ''
}

export function sanitizeDomainAgreement(
  agreement: IDomainAgreement
): IDomainAgreement {
  const isContentEmpty = stripTags(agreement.content).trim() === ''

  return {
    ...agreement,
    content: isContentEmpty
      ? `Please read the agreement at <a href="${agreement.url}" target="_blank">${agreement.url}</a>`
      : agreement.content
  }
}
