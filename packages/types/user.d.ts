export interface UserTypeProvider {
  token: String | any
  searchValue: string
  onSearchValue: (value: string) => void
  userInfo: any
}
