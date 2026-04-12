import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { App, Button, Form, Input, Modal, Popconfirm, Switch, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import {
  createUser,
  deleteUser,
  disableUser,
  enableUser,
  getUserList,
} from '@/services/rustdesk-console/user';

const UserList: React.FC = () => {
  const intl = useIntl();
  const { message: msgApi } = App.useApp();
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();

  const handleCreate = async (values: any) => {
    try {
      await createUser({ ...values, is_admin: values.is_admin || false });
      msgApi.success(
        intl.formatMessage({ id: 'pages.users.createSuccess', defaultMessage: 'User created' }),
      );
      setCreateModalVisible(false);
      createForm.resetFields();
      actionRef.current?.reload();
    } catch {
      msgApi.error(
        intl.formatMessage({ id: 'pages.users.createFailed', defaultMessage: 'Failed to create user' }),
      );
    }
  };

  const handleEnable = async (guid: string) => {
    try {
      await enableUser(guid);
      msgApi.success(
        intl.formatMessage({ id: 'pages.users.enableSuccess', defaultMessage: 'User enabled' }),
      );
      actionRef.current?.reload();
    } catch {
      msgApi.error(
        intl.formatMessage({ id: 'pages.users.enableFailed', defaultMessage: 'Failed to enable user' }),
      );
    }
  };

  const handleDisable = async (guid: string) => {
    try {
      await disableUser(guid);
      msgApi.success(
        intl.formatMessage({ id: 'pages.users.disableSuccess', defaultMessage: 'User disabled' }),
      );
      actionRef.current?.reload();
    } catch {
      msgApi.error(
        intl.formatMessage({ id: 'pages.users.disableFailed', defaultMessage: 'Failed to disable user' }),
      );
    }
  };

  const handleDelete = async (guid: string) => {
    try {
      await deleteUser(guid);
      msgApi.success(
        intl.formatMessage({ id: 'pages.users.deleteSuccess', defaultMessage: 'User deleted' }),
      );
      actionRef.current?.reload();
    } catch {
      msgApi.error(
        intl.formatMessage({ id: 'pages.users.deleteFailed', defaultMessage: 'Failed to delete user' }),
      );
    }
  };

  const columns: ProColumns<API.UserItem>[] = [
    {
      title: <FormattedMessage id="pages.users.name" defaultMessage="Name" />,
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="pages.users.email" defaultMessage="Email" />,
      dataIndex: 'email',
    },
    {
      title: <FormattedMessage id="pages.users.note" defaultMessage="Note" />,
      dataIndex: 'note',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.users.status" defaultMessage="Status" />,
      dataIndex: 'status',
      width: 100,
      render: (_, record) => {
        const isActive = record.status === 1;
        return <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Disabled'}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="pages.users.role" defaultMessage="Role" />,
      dataIndex: 'is_admin',
      width: 80,
      render: (_, record) =>
        record.is_admin ? (
          <Tag color="blue">Admin</Tag>
        ) : (
          <Tag>User</Tag>
        ),
    },
    {
      title: <FormattedMessage id="pages.common.action" defaultMessage="Action" />,
      valueType: 'option',
      width: 200,
      render: (_, record) => (
        <>
          {record.status === 1 ? (
            <Button key="disable" type="link" size="small" onClick={() => handleDisable(record.guid)}>
              <FormattedMessage id="pages.users.disable" defaultMessage="Disable" />
            </Button>
          ) : (
            <Button key="enable" type="link" size="small" onClick={() => handleEnable(record.guid)}>
              <FormattedMessage id="pages.users.enable" defaultMessage="Enable" />
            </Button>
          )}
          <Popconfirm
            key="delete"
            title={
              <FormattedMessage
                id="pages.users.deleteConfirm"
                defaultMessage="Are you sure to delete this user?"
              />
            }
            onConfirm={() => handleDelete(record.guid)}
          >
            <Button type="link" size="small" danger>
              <FormattedMessage id="pages.common.delete" defaultMessage="Delete" />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserItem>
        headerTitle={<FormattedMessage id="pages.users.list" defaultMessage="User List" />}
        actionRef={actionRef}
        rowKey="guid"
        request={async (params) => {
          const result = await getUserList({
            current: params.current || 1,
            pageSize: params.pageSize || 10,
          });
          return {
            data: result.data || [],
            total: result.total || 0,
            success: true,
          };
        }}
        columns={columns}
        search={false}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        toolBarRender={() => [
          <Button key="create" type="primary" onClick={() => setCreateModalVisible(true)}>
            <FormattedMessage id="pages.users.create" defaultMessage="Create User" />
          </Button>,
        ]}
      />

      <Modal
        title={<FormattedMessage id="pages.users.create" defaultMessage="Create User" />}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => createForm.submit()}
      >
        <Form form={createForm} onFinish={handleCreate}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="is_admin" label="Admin" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default UserList;
