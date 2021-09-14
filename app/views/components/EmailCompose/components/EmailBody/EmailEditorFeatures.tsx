import React from 'react'

import { Options as ImportOptions } from 'draft-js-import-html'

import { EmojiFeature } from 'components/TextEditor/features/Emoji'
import { ImageFeature } from 'components/TextEditor/features/Image'
import { RichTextFeature } from 'components/TextEditor/features/RichText'
import { SignatureFeature } from 'components/TextEditor/features/Signature'
import { TemplateExpressionsFeature } from 'components/TextEditor/features/TemplateExpressions'

import { defaultTemplateVariableSuggestions } from '../../default-template-variable-suggestions'

interface Props {
  uploadImage: (file) => Promise<string>
  hasTemplateVariables: boolean | undefined
  signature: string
  hasSignatureByDefault: boolean | undefined
  onEditSignature: () => void
  stateFromHtmlOptions: ImportOptions
}

export function EmailEditorFeatures(props: Props) {
  return (
    <>
      <RichTextFeature />
      <ImageFeature uploadImage={props.uploadImage} />
      <EmojiFeature />
      <TemplateExpressionsFeature
        showInToolbar={!!props.hasTemplateVariables}
        templateVariableSuggestionGroups={defaultTemplateVariableSuggestions}
      />
      <SignatureFeature
        signature={props.signature}
        stateFromHtmlOptions={props.stateFromHtmlOptions}
        hasSignatureByDefault={props.hasSignatureByDefault}
        onEditSignature={props.onEditSignature}
      />
    </>
  )
}
