import { Layout } from 'antd'
import React, { useState } from 'react'
import { Sidebar } from '../Siderbar/Siderbar'
import { HeaderDashboard } from '../header/HeaderDashboard'

const { Content } = Layout

interface Props {
  children: React.ReactNode
}

export const LayoutDashboard = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout>
      <Sidebar
        collapsed={collapsed}
        onCollapsed={() => {
          return setCollapsed(!collapsed)
        }}
      />
      <Layout className="h-screen">
        <HeaderDashboard />
        <Content className="site-layout my-4 p-6 min-h-[280px] bg-transparent overflow-auto max-h-full">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
