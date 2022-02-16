/**
 * This function replaces all {{nunjucksVariable}} with [[[nunjucksVariable]]] format.
 * Because CKEditor uses {variableName} format in its internal template system and it
 * conflicts with Nunjucks variables.
 */
function protectNunjucksVariables(text: string): string {
  // Accept {{}} as valid format because our CKEditor plugin uses it for creating new variables
  const nunjucksVariableFormat = /{{([^}]*)}}/g

  return text.replace(nunjucksVariableFormat, '[[[$1]]]')
}

/**
 * Replace all [[[nunjucksVariable]]] with {{nunjucksVariable}} to recover the variables.
 */
function recoverNunjucksVariables(text: string): string {
  const nunjucksProtectedVariableFormat = /\[\[\[([^\]]*)\]\]\]/g

  return text.replace(nunjucksProtectedVariableFormat, '{{$1}}')
}

/**
 * Support having nunjucks variables on CKEditor *
 */
export function supportNunjucksVariables(): void {
  // Users may open the builder multiple times. According to the fact that the CKEDITOR
  // is a global constant, we need to make sure this patch applies once.
  // @ts-ignore
  if (CKEDITOR.SUPPORT_NUNJUCKS_VARIABLES_PATCH) {
    return
  }

  // @ts-ignore
  CKEDITOR.SUPPORT_NUNJUCKS_VARIABLES_PATCH = true

  // This regex comes from https://github.com/ckeditor/ckeditor4/blob/major/core/template.js#L12
  const rePlaceholder = /{([^}]+)}/g

  // The main logic of this function is borrowed from:
  // https://github.com/ckeditor/ckeditor4/blob/major/core/template.js#L60
  //
  // It is not possible to store the main function and call it after running our logic because
  // this function is not pure. It calls the `source` method to access the template and also
  // sometimes modifies the buffer argument if it was provided!!!
  // So the easiest and safest way to have the new logic is re-implementing the whole function :(
  //
  // @ts-ignore
  CKEDITOR.template.prototype.output = function update(
    data: object,
    buffer?: Optional<string[]>
  ): string | number {
    const template =
      typeof this.source === 'function' ? this.source(data) : this.source

    // Change the nunjucks variables format
    const protectedTemplate = protectNunjucksVariables(template)

    // Replace the CKEditor variables with values on data argument
    const output = protectedTemplate.replace(
      rePlaceholder,
      (fullMatch, dataKey) => {
        if (data[dataKey] === undefined) {
          return fullMatch
        }

        return data[dataKey]
      }
    )

    // Recover the nunjucks variables
    const recoveredOutput = recoverNunjucksVariables(output)

    return buffer ? buffer.push(recoveredOutput) : recoveredOutput
  }
}
