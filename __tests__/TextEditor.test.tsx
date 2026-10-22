import { render } from '../utils/tests'
import TextEditor from '@/components/Common/TextEditor/TextEditor'

type UpdateHandler = (props: { editor: typeof mockEditor }) => void

const mockEditor = {
  state: { doc: { textContent: '' } },
  getHTML: jest.fn(),
  handler: undefined as UpdateHandler | undefined,
  on(_event: string, handler: UpdateHandler) {
    this.handler = handler
  },
}

// The real editor needs a browser; this one lets the test fire updates
jest.mock('@tiptap/react', () => ({ useEditor: () => mockEditor }))
jest.mock('@mantine/tiptap', () => {
  const Stub = ({ children }: { children?: React.ReactNode }) => <>{children}</>
  return {
    RichTextEditor: new Proxy(Stub, {
      get: (target, key) => (key in target ? target[key as keyof typeof target] : Stub),
    }),
    Link: {},
  }
})

describe('TextEditor', () => {
  beforeEach(() => {
    mockEditor.handler = undefined
  })

  it.each([
    ['an empty editor', '', '<p></p>'],
    ['blank lines', ' \n ', '<p></p><p> </p><p></p>'],
  ])('should send %s as an empty message', (_, textContent, html) => {
    const onChange = jest.fn()
    render(<TextEditor onChange={onChange} />)
    mockEditor.state.doc.textContent = textContent
    mockEditor.getHTML.mockReturnValue(html)

    mockEditor.handler?.({ editor: mockEditor })

    expect(onChange).toHaveBeenCalledWith('')
  })

  it('should send the HTML of a message', () => {
    const onChange = jest.fn()
    render(<TextEditor onChange={onChange} />)
    mockEditor.state.doc.textContent = 'Hola'
    mockEditor.getHTML.mockReturnValue('<p>Hola</p>')

    mockEditor.handler?.({ editor: mockEditor })

    expect(onChange).toHaveBeenCalledWith('<p>Hola</p>')
  })
})
