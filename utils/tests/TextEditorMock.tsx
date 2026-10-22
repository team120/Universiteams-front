// Stand-in for the rich text editor, which needs a real browser
const TextEditor = (props: {
  content?: string
  label?: string
  onChange: (content: string) => void
}) => (
  <textarea
    aria-label={props.label ?? 'Mensaje'}
    defaultValue={props.content}
    onChange={(event) => props.onChange(event.target.value)}
  />
)

export default TextEditor
