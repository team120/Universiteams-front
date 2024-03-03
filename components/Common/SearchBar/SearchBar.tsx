import React, { useEffect, useState } from 'react'
import { CloseButton, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import { Url } from '@/services/url'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedValue } from '@mantine/hooks'

interface SearchBarProps {
  endpoint: string
  width?: number
}

const SearchBar = (props: SearchBarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchQuery = useSearchParams()

  const [generalSearch, setGeneralSearch] = useState('')
  const [debouncedGeneralSearch] = useDebouncedValue(generalSearch, 400)

  // Set searchBar width
  const widthEmpty = props.width ?? 55
  const widthWithText = widthEmpty - 5

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
        style={{ width: generalSearch ? `${widthWithText}vw` : `${widthEmpty}vw` }}
        value={generalSearch}
        onChange={(event) => setGeneralSearch(event.currentTarget.value)}
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
