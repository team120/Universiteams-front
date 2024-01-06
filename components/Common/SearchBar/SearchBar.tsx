import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { ActionIcon, CloseButton, Input } from '@mantine/core'
import { IconCheck, IconSearch } from '@tabler/icons-react'

import Theme from 'src/app/theme'

interface SearchBarProps {
  endpoint: string
  width?: number
}

const SearchBar = (props: SearchBarProps) => {
  const [searchText, setSearchText] = useState('')
  const router = useRouter()

  // Set searchBar width
  const widthEmpty = props.width ?? 55
  const widthWithText = widthEmpty - 5

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
        placeholder="Buscar..."
        style={{ width: searchText ? `${widthWithText}vw` : `${widthEmpty}vw` }}
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
        ml={10}
        color={Theme.colors?.orange?.[4]}
        aria-label="Search button"
        onClick={searchNowClick}
        style={{ display: searchText ? undefined : 'none' }}>
        <IconCheck style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
    </>
  )
}

export default SearchBar
