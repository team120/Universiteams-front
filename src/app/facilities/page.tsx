'use client'
import React, { useMemo } from 'react'
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  MRT_Row,
} from 'mantine-react-table'
import { NextPage } from 'next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ActionIcon, Alert, Anchor, Box, Button, Center, Flex, Text, Tooltip } from '@mantine/core'
import { IconAlertCircle, IconArrowLeft, IconEdit, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { CurrentUserQueryOptions, UserSystemRole } from '../../../services/currentUser'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import SkeletonFull from '../../../components/Common/Loader/SkeletonFull'
import { Facilities, FacilitiesQueryKey, FacilityRelations } from '../../../services/facilities'
import Facility from '../../../entities/Facility/Facility'
import FacilityEditForm from '../../../components/Facility/FacilityEditForm'
import FacilityCreateForm from '../../../components/Facility/FacilityCreateForm'

const FacilitiesAdminPage: NextPage = () => {
  const router = useRouter()

  const handleGoToLoginClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/account/login')
  }

  const currentUserQuery = useQuery(CurrentUserQueryOptions.currentUser())

  const queryClient = useQueryClient()

  const columns = useMemo<MRT_ColumnDef<Facility>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
      },
      {
        accessorKey: 'abbreviation',
        header: 'Abreviatura',
      },
      {
        accessorKey: 'web',
        header: 'Web',
      },
      {
        accessorKey: 'institution.name',
        header: 'Institución',
      },
    ],
    []
  )

  const facilitiesQuery = useQuery({
    queryKey: [FacilitiesQueryKey],
    queryFn: () => Facilities.getFacilities({ relations: [FacilityRelations.institution] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => Facilities.deleteFacility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FacilitiesQueryKey] })
      notifications.show({
        title: 'Regional eliminada',
        message: 'La regional se ha eliminado exitosamente',
        color: 'green',
      })
      modals.closeAll()
    },
    onError: (error) => {
      notifications.show({
        title: 'Error al eliminar la regional',
        message: error.message,
        color: 'red',
      })
      modals.closeAll()
    },
  })

  const openDeleteConfirmModal = (row: MRT_Row<Facility>) =>
    modals.openConfirmModal({
      title: '¿Está seguro que desea eliminar esta regional?',
      children: (
        <Text>
          ¿Está seguro que desea eliminar la regional {row.original.name}? Esta acción no se puede
          deshacer.
        </Text>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate(row.original.id),
    })

  const table = useMantineReactTable({
    columns,
    data: facilitiesQuery.data ?? [],
    enableColumnPinning: true,
    initialState: {
      columnPinning: {
        left: ['mrt-row-actions'],
      },
    },
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (originalRow) => String(originalRow.id),
    mantineToolbarAlertBannerProps: facilitiesQuery.isError
      ? {
          color: 'red',
          children: 'Error al cargar los datos',
        }
      : undefined,
    mantineTableContainerProps: {
      style: {
        minHeight: '500px',
      },
    },
    renderCreateRowModalContent: ({ table }) => {
      return <FacilityCreateForm table={table} />
    },
    renderEditRowModalContent: ({ row, table }) => {
      return <FacilityEditForm facility={row.original} table={table} />
    },
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Editar">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Eliminar">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true)
        }}>
        Crear Nueva Regional
      </Button>
    ),
    state: {
      isLoading: facilitiesQuery.isLoading,
      isSaving: deleteMutation.isPending,
      showAlertBanner: facilitiesQuery.isError,
      showProgressBars: facilitiesQuery.isFetching,
    },
  })

  if (currentUserQuery.isLoading) return <SkeletonFull />

  if (
    currentUserQuery.error instanceof AxiosError &&
    currentUserQuery.error.response?.status === 401
  ) {
    return (
      <>
        <Alert variant="light" color="red.6" title="Error" icon={<IconAlertCircle />}>
          <Text size="lg" style={{ weight: 500 }} mb="xs">
            Debes estar autenticado para acceder a esta página
          </Text>
          <Anchor size="md" onClick={handleGoToLoginClick}>
            <Center inline>
              <IconArrowLeft stroke={1.5} />
              <Box ml={5}>Ir a la página de inicio de sesión</Box>
            </Center>
          </Anchor>
        </Alert>
      </>
    )
  }

  if (currentUserQuery.data?.systemRole !== UserSystemRole.ADMIN) {
    return (
      <>
        <Alert variant="light" color="red.6" title="Error" icon={<IconAlertCircle />}>
          <Text size="lg" style={{ weight: 500 }} mb="xs">
            No tiene permisos para acceder a esta página
          </Text>
        </Alert>
      </>
    )
  }

  if (facilitiesQuery.isLoading) return <SkeletonFull />

  return <MantineReactTable table={table} />
}

export default FacilitiesAdminPage