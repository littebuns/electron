import {
    CrownFilled,
    InfoCircleFilled,
    ReloadOutlined,
    SmileFilled
} from '@ant-design/icons';
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { Modal, Tooltip } from 'antd';
import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import CCSFileUpload from './pages/FileUpload/CCSFileLoad';
import Welcome from './pages/Welcome';

export default () => {

    const ipcHandle = (): void => window.electron.ipcRenderer.send('check-for-updates')
    const [pathname, setPathname] = useState('welcome')
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    return (
        <div
            id="pro-layout"
            style={{
                height: '100vh',
                width: '100%',
            }}
        >
            <ProLayout
                siderWidth={210}
                defaultCollapsed={true}
                breakpoint={false}
                route={{
                    path: '/',
                    routes: [
                        {
                            path: '/welcome',
                            name: '欢迎',
                            icon: <SmileFilled />,
                        },
                        {
                            path: '/ccsfileload',
                            name: '磁吸文件上传',
                            icon: <CrownFilled />,
                        },
                        {
                            path: '/admin',
                            name: '管理页',
                            icon: <CrownFilled />,
                            access: 'canAdmin',
                            component: './Admin',
                            routes: [
                                {
                                    path: '/admin/sub-page1',
                                    name: '一级页面',
                                    icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
                                    component: './Welcome',
                                },
                                {
                                    path: '/admin/sub-page2',
                                    name: '二级页面',
                                    icon: <CrownFilled />,
                                    component: './Welcome',
                                },
                                {
                                    path: '/admin/sub-page3',
                                    name: '三级页面',
                                    icon: <CrownFilled />,
                                    component: './Welcome',
                                },
                            ],
                        }
                    ]
                }}
                location={{
                    pathname,
                }}
                avatarProps={{
                    // src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                    title: 'DMC',
                    size: 'small',
                }}
                actionsRender={(props) => {
                    if (props.isMobile) return [];
                    return [
                        <Tooltip title="信息" >
                            <InfoCircleFilled key="InfoCircleFilled" onClick={showModal} />
                            <Modal
                                title="基础信息"
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                open={isModalOpen}
                                onOk={handleOk}
                            >
                                <p>Some contents...</p>
                                <p>Some contents...</p>
                                <p>Some contents...</p>
                            </Modal>
                        </Tooltip>,
                        <Tooltip title="检查更新">
                            <ReloadOutlined key="QuestionCircleFilled" onClick={ipcHandle} />

                        </Tooltip>

                        // <GithubFilled key="GithubFilled" />,
                    ];
                }}
                menuItemRender={(item, dom) => (
                    <div
                        onClick={() => {
                            setPathname(item.path || '/welcome');
                            navigate(item.path || '/welcome');
                        }}
                    >
                        {dom}
                    </div>
                )}
            >
                <div>
                    <PageContainer
                        style={{
                            minHeight: 800,
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<Welcome />} />
                            <Route path="/welcome" element={<Welcome />} />
                            <Route path="/ccsfileload" element={<CCSFileUpload />} />
                            <Route path="*" element={<Welcome />} />
                        </Routes>
                    </PageContainer>
                </div>
            </ProLayout>
        </div>
    );
};