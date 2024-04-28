import React, { useEffect, useState } from 'react'
import { CloseButton, TextInput, useMantineTheme } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import { Url } from '@/services/url'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks'
import Theme from 'src/app/theme'

const SearchBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchQuery = useSearchParams()

  const [generalSearch, setGeneralSearch] = useState('')
  const [debouncedGeneralSearch] = useDebouncedValue(generalSearch, 400)

  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

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
          width: isMobile ? '55vw' : '55vw',
        }}
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
