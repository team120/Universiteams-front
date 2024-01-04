import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { ActionIcon, CloseButton, Input } from '@mantine/core'
import { IconCheck, IconSearch } from '@tabler/icons-react'

import Theme from 'src/app/theme'

interface SearchBarProps {
  endpoint: string
}

const SearchBar = (props: SearchBarProps) => {
  const [searchText, setSearchText] = useState('')
  const router = useRouter()

  const searchNowClick = () => {
    if (!searchText) return
    router.push(`/${props.endpoint}?q=${searchText}`)
  }

  const searchNowButton = (event: React.KeyboardEvent<any>) => {
    if (!searchText) return
    if (event.key != 'Enter') return
    router.push(`/${props.endpoint}?q=${searchText}`)
  }

  return (
    <>
      <Input
        placeholder="Buscar proyectos..."
        style={{ width: '80vw' }}
        value={searchText}
        onChange={(event) => setSearchText(event.currentTarget.value)}
        onKeyUp={(event) => searchNowButton(event)}
        leftSection={<IconSearch size={16} />}
        rightSectionPointerEvents="all"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => setSearchText('')}
            style={{ display: searchText ? undefined : 'none' }}
          />
        }
      />
      <ActionIcon
        variant="filled"
        color={Theme.colors?.orange?.[4]}
        aria-label="Search button"
        style={{ display: searchText ? undefined : 'none' }}
        onClick={searchNowClick}>
        <IconCheck style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
    </>
  )
}

export default SearchBar
