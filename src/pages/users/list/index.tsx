import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { App, Button, Form, Input, Modal, Popconfirm, Switch, Tag } from 'antd';
import React, { useState } from 'react';
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
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();

  const handleCreate = async (values: any) => {
    try {
      await createUser(values);
      msgApi.success('User created');
      setCreateModalVisible(false);
      createForm.resetFields();
    } catch {
      msgApi.error('Failed to create user');
    }
  };

  const handleEnable = async (guid: string) => {
    try {
      await enableUser(guid);
      msgApi.success('User enabled');
    } catch {
      msgApi.error('Failed to enable user');
    }
  };

  const handleDisable = async (guid: string) => {
    try {
      await disableUser(guid);
      msgApi.success('User disabled');
    } catch {
      msgApi.error('Failed to disable user');
    }
  };

  const handleDelete = async (guid: string) => {
    try {
      await deleteUser(guid);
      msgApi.success('User deleted');
    } catch {
      msgApi.error('Failed to delete user');
    }
  };

  const columns: ProColumns<API.UserItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.users.name',
        defaultMessage: 'Name',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.users.email',
        defaultMessage: 'Email',
      }),
      dataIndex: 'email',
    },
    {
      title: intl.formatMessage({
        id: 'pages.users.note',
        defaultMessage: 'Note',
      }),
      dataIndex: 'note',
    },
    {
      title: intl.formatMessage({
        id: 'pages.users.status',
        defaultMessage: 'Status',
      }),
      dataIndex: 'status',
      render: (_, record) => {
        const isActive = record.status === 1;
        return (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Active' : 'Disabled'}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.users.role',
        defaultMessage: 'Role',
      }),
      dataIndex: 'is_admin',
      render: (_, record) => {
        return record.is_admin ? (
          <Tag color="blue">Admin</Tag>
        ) : (
          <Tag>User</Tag>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.common.action',
        defaultMessage: 'Action',
      }),
      valueType: 'option',
      render: (_, record) => [
        record.status === 1 ? (
          <Button
            key="disable"
            type="link"
            size="small"
            onClick={() => handleDisable(record.guid)}
          >
            Disable
          </Button>
        ) : (
          <Button
            key="enable"
            type="link"
            size="small"
            onClick={() => handleEnable(record.guid)}
          >
            Enable
          </Button>
        ),
        <Popconfirm
          key="delete"
          title="Are you sure to delete this user?"
          onConfirm={() => handleDelete(record.guid)}
        >
          <Button type="link" size="small" danger>
            Delete
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserItem>
        headerTitle={intl.formatMessage({
          id: 'pages.users.list',
          defaultMessage: 'User List',
        })}
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
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            {intl.formatMessage({
              id: 'pages.users.create',
              defaultMessage: 'Create User',
            })}
          </Button>,
        ]}
      />

      <Modal
        title={intl.formatMessage({
          id: 'pages.users.create',
          defaultMessage: 'Create User',
        })}
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
