/* eslint-disable prettier/prettier */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react'
import { Layout, Menu } from 'antd'

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  InteractionOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import Interaction from './components/Interaction'
import History from './components/History'

const { Header, Sider, Content } = Layout

const App = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [tabName, setTabName] = useState('interaction')
  const [isShowHistory, setIsShowHistory] = useState(false)
  const [historyProtein1, setHistoryProtein1] = useState('')
  const [historyProtein2, setHistoryProtein2] = useState('')

  const toggle = () => {
    setCollapsed(!collapsed)
  }
  const showInteraction = (protein1: string, protein2: string) => {
    setTabName('interaction')
    setHistoryProtein1(protein1)
    setHistoryProtein2(protein2)
    setIsShowHistory(true)
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className='logo' />
        <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
          <Menu.Item
            key='2'
            icon={<InteractionOutlined />}
            onClick={() => setTabName('interaction')}>
            Protein Interaction
          </Menu.Item>
          <Menu.Item
            key='3'
            icon={<HistoryOutlined />}
            onClick={() => setTabName('history')}>
            History
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Header className='site-layout-background' style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: toggle,
            }
          )}
        </Header>
        <Content
          className='site-layout-background'
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}>
          {tabName === 'interaction' ? (
            <Interaction isShowHistory={isShowHistory} showHistory={setIsShowHistory} historyProtein1={historyProtein1} historyProtein2={historyProtein2} />
          ) : (
              <History showInteraction={showInteraction} />
            )}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
