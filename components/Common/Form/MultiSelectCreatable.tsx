import React from 'react'
import { useState } from 'react'
import {
  CheckIcon,
  CloseButton,
  Combobox,
  Group,
  Pill,
  PillsInput,
  ScrollArea,
  useCombobox,
} from '@mantine/core'
import SelectItem from '../../../entities/HelpTypes/SelectItem'

interface MultiSelectCreatableProps {
  possibleValues: SelectItem[]
  placeholder?: string
}

const MultiSelectCreatable = ({ possibleValues, placeholder }: MultiSelectCreatableProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const [search, setSearch] = useState('')
  const [data, setData] = useState(possibleValues)
  const [value, setValue] = useState<string[]>([])

  const exactOptionMatch = data.some((item) => item.displayName === search)

  const handleValueSelect = (val: string) => {
    setSearch('')

    if (val === '$create') {
      setData((current) => [...current, { attribute: search, displayName: search }])
      setValue((current) => [...current, search])
    } else {
      setValue((current) =>
        current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
      )
    }
  }

  const handleValueRemove = (val: string) => setValue((current) => current.filter((v) => v !== val))

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ))

  const options = data
    .filter((item) => item.displayName.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option
        value={item.displayName}
        key={item.attribute}
        active={value.includes(item.displayName)}>
        <Group gap="sm">
          {value.includes(item.displayName) ? <CheckIcon size={12} /> : null}
          <span>{item.displayName}</span>
        </Group>
      </Combobox.Option>
    ))

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
      <Combobox.DropdownTarget>
        <PillsInput
          onClick={() => combobox.openDropdown()}
          rightSection={
            value.length !== 0 && (
              <CloseButton
                size="sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setValue([])}
                aria-label="Limpiar valores seleccionados"
              />
            )
          }>
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder={value.length === 0 ? placeholder : ''}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex()
                  setSearch(event.currentTarget.value)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault()
                    handleValueRemove(value[value.length - 1])
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize mah={200} type="scroll">
            {options}

            {!exactOptionMatch && search.trim().length > 0 && (
              <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
            )}

            {exactOptionMatch && search.trim().length > 0 && options.length === 0 && (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default MultiSelectCreatable
