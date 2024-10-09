import { Button, Divider, theme } from 'antd'
import styles from './styles.module.css'
import { LeftArrowIcon } from '../../../assets/icons/LeftArrowIcon'
import { AppIcon } from '../../../assets/icons/AppIcon'

interface Props {
  collapsed: boolean
  onCollapsed: () => void
}

export const SidebarHeader = ({ collapsed, onCollapsed }: Props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  // const { userInfo } = useAuth();

  return (
    <div
      className={styles.contentHeader}
      style={{ backgroundColor: colorBgContainer }}
    >
      <div className={`${!collapsed ? styles.infoHeader : styles.collapsed}`}>
        <AppIcon className="w-[44px]" />
        {!collapsed && (
          <div className={styles.info}>
            {/*<p className={styles.roleUser}>{userInfo?.role?.type}</p>*/}
            {/*<p className={styles.username}>{userInfo?.username}</p>*/}
          </div>
        )}
      </div>
      <div
        className={`${styles.buttonMenu} ${collapsed && styles.buttonRigth}`}
      >
        <Button
          icon={<LeftArrowIcon />}
          type="default"
          onClick={onCollapsed}
        ></Button>
      </div>
      <Divider />
    </div>
  )
}
