import {
    unbanUser,
    deleteUserUsingPOST,
    listUserByPageUsingPOST,
    updateUserUsingPOST,
    banUser
} from '@/services/openbi/userController';
import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
import {
    FooterToolbar,
    ModalForm,
    PageContainer,
    ProDescriptions,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button, Divider, Drawer, Input, message} from 'antd';
import React, {useRef, useState} from 'react';
import UpdateForm from './components/UpdateForm';

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.UserUpdateRequest) => {
    const hide = message.loading('Configuring');
    try {
        await updateUserUsingPOST(fields);
        hide();

        message.success('Update successful');
        return true;
    } catch (error) {
        hide();
        message.error('Update failed, please try again!');
        return false;
    }
};


const banUserAction = async (id?: number, userRole?: string) => {
    if (!id) {
        return
    }

    const url = userRole === 'ban' ? unbanUser : banUser
    const res = await url({id})
    message.success('Success!');
    return true
}

const TableList: React.FC = () => {
    /**
     * @en-US The pop-up window of the distribution update window
     * @zh-CN 分布更新窗口的弹窗
     * */
    const [updateModalOpen, handleUpdateModalOpen] = useState<string>('');

    const [showDetail, setShowDetail] = useState<boolean>(false);

    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.User>();
    const [selectedRowsState, setSelectedRows] = useState<API.User[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);

    /**
     * @en-US International configuration
     * @zh-CN 国际化配置
     * */
    const intl = useIntl();

    const columns: ProColumns<API.User>[] = [

        {
            title: (
                <FormattedMessage
                    id="userAccount"
                    defaultMessage="Account"
                />
            ),
            dataIndex: 'userAccount',
        },
        {
            title: (
                <FormattedMessage
                    id="userName"
                    defaultMessage="Name"
                />
            ),
            dataIndex: 'userName',
        },
        {
            title: <FormattedMessage id="userRole" defaultMessage="Role"/>,
            dataIndex: 'userRole',
            valueType: 'select',
            fieldProps: {
                options: [
                    {
                        label: 'Admin',
                        value: 'admin',
                    },
                    {
                        label: 'User',
                        value: 'user',
                    },
                    {
                        label: 'Disabled',
                        value: 'ban',
                    },
                ],
            },
            renderText: (dom, row) => {
                return dom === 'admin' ? 'Admin' : 'User'
            }
        },
        {
            title: (
                <FormattedMessage
                    id="userProfile"
                    defaultMessage="Profile"
                />
            ),
            dataIndex: 'userProfile',
            hideInForm: true,
        },
        // {
        //   title: <FormattedMessage id="useAvatar" defaultMessage="Status"/>,
        //   dataIndex: 'userRole',
        //   valueType: 'select',
        //   fieldProps: {
        //     options: [
        //       {
        //         label: 'Disabled',
        //         value: 'ban',
        //       },
        //
        //     ],
        //   },
        //   hideInSearch: false,
        //   renderText: (data) => data === 'ban' ? 'Disabled' : 'Enabled'
        // },
        {
            title: (
                <FormattedMessage
                    id="createTime"
                    defaultMessage="Create Time"
                />
            ),
            hideInSearch: true,
            dataIndex: 'createTime',
            valueType: 'dateTime',
        },
        {
            title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
            dataIndex: 'option',
            valueType: 'option',
            render: (_, row, index, action) => [
                <a
                    key="config"
                    onClick={() => {
                        handleUpdateModalOpen('detail');
                        setCurrentRow(row);
                    }}
                >
                    <FormattedMessage id="detail" defaultMessage="Detail"/>
                </a>,
                <a
                    key="config"
                    onClick={() => {
                        handleUpdateModalOpen('edit');
                        setCurrentRow(row);
                    }}
                >
                    <FormattedMessage id="edit" defaultMessage="Edit"/>
                </a>,
                <a key="subscribeAlert" onClick={async () => {
                    const res = await banUserAction(row.id, row.userRole)
                    if (res) {
                        actionRef.current?.reload()
                    }
                }}>
                    <FormattedMessage
                        id="delete"
                        defaultMessage={row.userRole === 'ban' ? 'Enable' : 'Disable'}
                    />
                </a>,
                // delete
                <a key="subscribeAlert" onClick={async () => {
                    const res = await deleteUserUsingPOST({id: row.id})
                    if (res) {
                        actionRef.current?.reload()
                        message.success('Success!')
                    }
                }
                }>
                    <FormattedMessage
                        id="delete"
                        defaultMessage="Delete"
                    />
                </a>,
            ],

        },
    ];

    return (

        <PageContainer
            ghost
            header={{
                // title: 'Smart Analysis',
                breadcrumb: {},
                style: {textAlign: 'center'},
            }}>
            {/*<h2 style={{fontWeight: "bold", textAlign: "center"}}>User Management</h2>*/}
            {/*<br/>*/}
            <ProTable<API.User, API.UserQueryRequest>
                headerTitle={intl.formatMessage({
                    id: 'pages.searchTable.title',
                    defaultMessage: 'User List',
                })}
                actionRef={actionRef}
                rowKey="id" // 设置为 "id"，作为唯一标识符
                search={{
                    labelWidth: 75,
                }}
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    current: currentPage, // Set the current page
                    onChange: (page, pageSize) => {
                        setCurrentPage(page); // Update the currentPage state when the page changes
                    },
                }}
                toolBarRender={() => []}
                request={async (
                    params: API.UserQueryRequest & {
                        pageSize?: number;
                        current?: number;
                        keyword?: string;
                    },
                ) => {
                    const res = await listUserByPageUsingPOST({...params, current: currentPage, pageSize: params.pageSize});

                    return {
                        code: res.code,
                        data: res.data?.records,
                        message: res.message,
                        current: res.data?.current, //1
                        pageSize: res.data?.size, //10
                        total: res.data?.total, //total!不是pageTotal!!
                    }
                }}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        console.log("selected row：" + selectedRows);
                        setSelectedRows(selectedRows);
                    },
                }}
            />
            <UpdateForm
                onSubmit={async (value) => {
                    const success = await handleUpdate({
                        id: currentRow?.id,
                        ...value
                    });
                    if (success) {
                        handleUpdateModalOpen('');
                        setCurrentRow(undefined);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
                onCancel={() => {
                    handleUpdateModalOpen('');
                    if (!showDetail) {
                        setCurrentRow(undefined);
                    }
                }}
                updateModalOpen={updateModalOpen}
                values={currentRow || {}}
            />
        </PageContainer>
    );
};

export default TableList;
