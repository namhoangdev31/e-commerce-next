/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { UserContext } from '../providers/UserProvider'

export const useSearch = () => {
  const { onSearchValue, searchValue } = useContext(UserContext)

  const router = useRouter()

  useEffect(() => {
    onSearchValue('')
  }, [router.pathname])

  return {
    onSearchValue,
    searchValue,
  }
}
