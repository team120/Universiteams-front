import React, { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Select, Stack, Grid, ActionIcon, Group, MultiSelect } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowUp, IconArrowDown, IconTrash } from '@tabler/icons-react'
import Theme from 'src/app/theme'

import { Url } from '@/services/url'
import SelectItem from '@/entities/HelpTypes/SelectItem'

interface UserFilterContentProps {
  sortAttributes: SelectItem[]
  interests: SelectItem[]
}

const UserFilterContent = (props: UserFilterContentProps) => {
  const form = useForm({
    initialValues: {
      generalSearch: '',
      sortBy: '',
      inAscendingOrder: true,
      interests: [] as string[],
    },
  })

  const searchQuery = useSearchParams()

  useEffect(() => {
    form.setValues({
      generalSearch: searchQuery.get('generalSearch') ?? '',
      sortBy: searchQuery.get('sortBy') ?? '',
      inAscendingOrder: searchQuery.get('inAscendingOrder') !== 'false',
      interests: searchQuery.getAll('interest') ?? [],
    })
  }, [searchQuery])

  const router = useRouter()
  const pathname = usePathname()

  const handleSortByChange = (value: string | null) => {
    Url.setUrlParam(router, pathname, searchQuery, 'sortBy', value)
  }

  const handleInterestsChange = (value: string[]) => {
    Url.replaceArrayInUrl(router, pathname, searchQuery, 'interest', value)
  }

  const handleOrderChange = () => {
    const value = !form.values.inAscendingOrder
    Url.setUrlParam(router, pathname, searchQuery, 'inAscendingOrder', value.toString())
  }

  const reset = () => {
    form.reset()
    router.push(`${pathname}`)
  }

  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

  return (
    <>
      <form>
        <Stack gap="xs" ml={isMobile ? 'xs' : 0} mr={isMobile ? 'xs' : 0}>
          <Grid align="flex-end">
            <Grid.Col span="auto">
              <Select
                label="Ordenar por"
                placeholder='Ej: "nombre"'
                data={[{ value: '', label: '' }].concat(
                  props.sortAttributes.map((attr) => ({
                    value: attr.attribute,
                    label: attr.displayName,
                  }))
                )}
                clearable
                value={form.values.sortBy}
                onChange={handleSortByChange}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <ActionIcon variant="transparent" onClick={handleOrderChange}>
                {form.values.inAscendingOrder ? <IconArrowUp /> : <IconArrowDown />}
              </ActionIcon>
            </Grid.Col>
          </Grid>

          <MultiSelect
            label="Intereses"
            placeholder={form.values.interests.length === 0 ? 'Ej: "Inteligencia Artificial"' : ''}
            data={[{ value: '', label: '' }].concat(
              props.interests.map((attr) => ({
                value: attr.attribute,
                label: attr.displayName,
              }))
            )}
            clearable
            value={form.values.interests}
            onChange={handleInterestsChange}
          />

          <Group grow mt="xs">
            <ActionIcon color="red" onClick={reset}>
              <IconTrash />
            </ActionIcon>
          </Group>
        </Stack>
      </form>
    </>
  )
}

export default UserFilterContent
