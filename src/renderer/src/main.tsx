import './assets/main.css'

import { App, ConfigProvider } from 'antd'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Layout from './layout'


const container = document.getElementById('root')
// 用条件判断替代非空断言操作符，提高代码安全性
if (container) {
  createRoot(container).render(
    <ConfigProvider>
      <App style={{width: '100%'}}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </App>
    </ConfigProvider> as any
  )
}
