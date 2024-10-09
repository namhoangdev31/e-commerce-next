import { Layout } from 'antd'
import styles from './styles.module.css'
import { SidebarHeader } from './SiderbarHeader/SiderbarHeader'
import { MenuSidebar } from './menuSiderbar/MenuSiderbar'

const { Sider } = Layout

interface Props {
  collapsed: boolean
  onCollapsed: () => void
}

export const Sidebar = ({ collapsed, onCollapsed }: Props) => {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      // className={styles.siderbar}
      className={`${styles.siderbar} ${!collapsed ? styles.collapsed : ''}`}
    >
      <div className={styles.containerMenu}>
        <SidebarHeader collapsed={collapsed} onCollapsed={onCollapsed} />
        <MenuSidebar />
      </div>
    </Sider>
  )
}
