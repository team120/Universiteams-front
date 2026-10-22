import { render } from '../utils/tests'
import TextEditor from '@/components/Common/TextEditor/TextEditor'

type UpdateHandler = (props: { editor: typeof mockEditor }) => void

const mockEditor = {
  isEmpty: false,
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

  it('should send an empty editor as an empty message', () => {
    const onChange = jest.fn()
    render(<TextEditor onChange={onChange} />)
    mockEditor.isEmpty = true
    mockEditor.getHTML.mockReturnValue('<p></p>')

    mockEditor.handler?.({ editor: mockEditor })

    expect(onChange).toHaveBeenCalledWith('')
  })

  it('should send the HTML of a message', () => {
    const onChange = jest.fn()
    render(<TextEditor onChange={onChange} />)
    mockEditor.isEmpty = false
    mockEditor.getHTML.mockReturnValue('<p>Hola</p>')

    mockEditor.handler?.({ editor: mockEditor })

    expect(onChange).toHaveBeenCalledWith('<p>Hola</p>')
  })
})
