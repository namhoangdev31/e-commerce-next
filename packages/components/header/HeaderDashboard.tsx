import { Avatar, Button, Input, Layout, theme } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { ExclamationMarkIcon } from '../../assets/icons/ExclamationMarkIcon'
import { SearchIcon } from '../../assets/icons/SearchIcon'
import { useSearch } from '../../hooks/useSearch'
import {
  NAME_PAGE,
  NOT_SHOW_INPUT,
  Routes,
  SHOW_BUTTONBACK,
} from '../../constants/Routes'
// import { useAuth } from '@/hooks/useAuth'

const { Header } = Layout

export const HeaderDashboard = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken()
  const { onSearchValue, searchValue } = useSearch()
  const { pathname, back } = useRouter()
  // const { userInfo } = useAuth()

  return (
    <header className="p-0 bg-transparent z-[99]">
      <div className="py-3 px-4 flex justify-between bg-[#F8FAFC]">
        <div className="flex-1 flex gap-2 items-center">
          {SHOW_BUTTONBACK[pathname as Routes] && (
            <Button
              icon={<ArrowLeftOutlined className="text-sm" />}
              onClick={() => back()}
              size="small"
            />
          )}
          <div>
            <p className="text-[#5B8DEF] font-poppins text-xs font-normal">
              Page / {NAME_PAGE[pathname as Routes]}
            </p>
            <p className="font-montserrat text-2xl font-bold" style={{ color: colorPrimary }}>
              {NAME_PAGE[pathname as Routes]}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_25px_30px] gap-[3px] rounded-md bg-white items-center">
          {!NOT_SHOW_INPUT[pathname as Routes] && (
            <Input
              prefix={<SearchIcon className="mr-[3px]" />}
              className="bg-[#F8FAFC] placeholder-[#5B8DEF] text-md font-normal leading-4"
              placeholder="Buscar"
              size="middle"
              onChange={(event) => onSearchValue(event.target.value)}
              value={searchValue}
            />
          )}
          {NOT_SHOW_INPUT[pathname as Routes] && <div></div>}
          <Button icon={<ExclamationMarkIcon />} type="text" size="small"></Button>

          {/*<Avatar size="small">{userInfo?.username.slice(0, 2).toUpperCase()}</Avatar>*/}
        </div>
      </div>
    </header>
  )
}
