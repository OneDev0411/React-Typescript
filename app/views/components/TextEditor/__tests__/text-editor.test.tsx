import { ReactNode } from 'react'
import { fireEvent, render } from '@testing-library/react'

import * as React from 'react'

import { useEditorState } from 'components/TextEditor/hooks/use-editor-state'

import { TestBed } from '../../../../../tests/unit/TestBed'
import { ImageFeature } from '../features/Image'

import { TextEditor } from '..'

const TE = ({ children }: { children?: ReactNode }) => {
  const [editorState, setEditorState] = useEditorState('')

  return (
    <TextEditor onChange={setEditorState} editorState={editorState}>
      {children}
    </TextEditor>
  )
}

// https://gitlab.com/rechat/web/issues/2948
describe('TextEditor', () => {
  it('should render', () => {
    render(
      <TestBed>
        <TE />
      </TestBed>
    )
  })

  // js-dom seems to have problem with selection API. These mocks are still not
  // enough
  beforeAll(() => {
    ;(window as any).document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document
      }
    })
  })

  it('should show image picker button if ImageFeature is used, and it should open image picker dialog', done => {
    const { getByTestId, container } = render(
      <TestBed>
        <TE>
          <ImageFeature />
        </TE>
      </TestBed>
    )

    fireEvent.click(getByTestId('add-image-button'))

    const file = new File(
      [
        '<svg width="48" height="38" viewBox="0 0 48 38" xmlns="http://www.w3.org/2000/svg"><g stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path d="M1 15v6M47 1v30" stroke="#2196F3"/><path stroke="#C7C7C7" fill="#C7C7C7" d="M47 35L1 21v-6L47 1z"/><path d="M25 29.223a7 7 0 1 1-14 0V24" stroke="#C7C7C7"/></g></svg>'
      ],
      'example.svg',
      {
        type: 'image/svg+xml'
      }
    )
    const imageInput = container.querySelector<HTMLInputElement>(
      'input[type=file]'
    )!

    // https://github.com/testing-library/react-testing-library/issues/93#issuecomment-403887769
    Object.defineProperty(imageInput, 'files', {
      value: [file]
    })

    fireEvent.change(imageInput)

    done() // FIXME: fix jsdom problems with selection api and check if image exists
    // setTimeout(() => {
    //   const image = baseElement.querySelector('.DraftEditor-root img')
    //
    //   console.log(
    //     baseElement.querySelector('.DraftEditor-root')!.textContent,
    //     image
    //   )
    //   done()
    // }, 100)
  })

  it('should not show image picker button if ImageFeature is used', () => {
    const { queryByTestId } = render(
      <TestBed>
        <TE />
      </TestBed>
    )

    expect(queryByTestId('add-image-button')).toBeNull()
  })
})
