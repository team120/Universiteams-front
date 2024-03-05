import React, { useEffect, useState } from 'react'
import { CloseButton, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import { Url } from '@/services/url'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebouncedValue } from '@mantine/hooks'

interface SearchBarProps {
  width?: number // You might consider removing this if you're going to use all space
}

const SearchBar = (props: SearchBarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchQuery = useSearchParams()

  const [generalSearch, setGeneralSearch] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [debouncedGeneralSearch] = useDebouncedValue(generalSearch, 400)

  const searchNowButton = () => {
    Url.setUrlParam(router, pathname, searchQuery, 'generalSearch', generalSearch)
  }

  useEffect(() => {
    searchNowButton()
  }, [debouncedGeneralSearch])

  return (
    <>
      <TextInput
        placeholder="Buscar..."
        style={{
          width: isFocused || generalSearch ? '100%' : '55vw', // Adjust this value as needed
        }}
        value={generalSearch}
        onChange={(event) => setGeneralSearch(event.currentTarget.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        leftSection={<IconSearch size={16} />}
        rightSectionPointerEvents="all"
        rightSection={
          <CloseButton
            aria-label="Limpiar búsqueda"
            onClick={() => setGeneralSearch('')}
            style={{ display: generalSearch ? undefined : 'none' }}
          />
        }
      />
    </>
  )
}

export default SearchBar
