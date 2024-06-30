import { create } from 'zustand'

interface SidebarStoreState {
  opened: boolean
  toggle: () => void
}

const useSidebarStore = create<SidebarStoreState>((set) => ({
  opened: false,
  toggle: () => set((state) => ({ opened: !state.opened })),
}))

export default useSidebarStore
