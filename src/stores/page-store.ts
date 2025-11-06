import { Store } from '@tanstack/store'

export type PageStore = {
  currentPage: number
}

let pageStore: Store<PageStore> | null = null

const createPageStore = (): Store<PageStore> => {
  return new Store<PageStore>({
    currentPage: 1,
  })
}

export function initPageStore(): Store<PageStore> {
  if (!pageStore) {
    pageStore = createPageStore()
  }
  return pageStore
}

export function getPageStore(): Store<PageStore> {
  if (!pageStore) return initPageStore()

  return pageStore
}
