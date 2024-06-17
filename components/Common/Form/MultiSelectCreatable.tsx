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
  value?: SelectItem[]
  onChange?: (value: SelectItem[]) => void
}

const MultiSelectCreatable = ({
  possibleValues,
  placeholder,
  value: propValue,
  onChange,
}: MultiSelectCreatableProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const [search, setSearch] = useState('')
  const [data, setData] = useState(possibleValues)
  const [value, setValue] = useState<SelectItem[]>(propValue || [])

  const exactOptionMatch = data.some((item) => item.label === search)

  const handleValueSelect = (attribute: string) => {
    setSearch('')

    if (attribute === '$create') {
      setData((current) => [...current, { value: search, label: search }])
      setValue((current) => [...current, { value: search, label: search }])
      onChange && onChange([...value, { value: search, label: search }])
    } else {
      const matchingDisplayName = data.find((item) => item.value === attribute)?.label || ''
      const newValue =
        value.find((v) => v.value === attribute) !== undefined
          ? value.filter((v) => v.value !== attribute)
          : [
              ...value,
              {
                value: attribute,
                label: matchingDisplayName,
              },
            ]
      setValue(() => newValue)
      onChange && onChange(newValue)
    }
  }

  const handleValueRemove = (val: SelectItem) => {
    const newValue = value.filter((v) => v.value !== val.value)
    setValue(() => newValue)
    onChange && onChange(newValue)
  }

  const values = value.map((item) => (
    <Pill key={item.value} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item.label}
    </Pill>
  ))

  const options = data
    .filter((item) => item.label.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option
        value={item.value}
        key={item.value}
        active={value.find((v) => v.value === item.value) !== undefined}>
        <Group gap="sm">
          {value.find((v) => v.value === item.value) !== undefined ? <CheckIcon size={12} /> : null}
          <span>{item.label}</span>
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
