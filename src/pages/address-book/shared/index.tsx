import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import {
  App as AntApp,
  App,
  Button,
  Form,
  Input,
  Modal,
  message,
  Popconfirm,
} from 'antd';
import React, { useState } from 'react';
import {
  addSharedAddressBook,
  deleteSharedAddressBooks,
  getSharedAddressBooks,
  updateSharedAddressBook,
} from '@/services/rustdesk-console/addressBook';

const SharedAddressBook: React.FC = () => {
  const intl = useIntl();
  const { message: msgApi } = AntApp.useApp();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleCreate = async (values: API.AddSharedAddressBookParams) => {
    try {
      await addSharedAddressBook(values);
      msgApi.success('Address book created');
      setCreateModalVisible(false);
      createForm.resetFields();
    } catch {
      msgApi.error('Failed to create address book');
    }
  };

  const handleBatchDelete = async () => {
    try {
      await deleteSharedAddressBooks(selectedRowKeys as string[]);
      msgApi.success('Address books deleted');
      setSelectedRowKeys([]);
    } catch {
      msgApi.error('Failed to delete address books');
    }
  };

  const columns: ProColumns<API.SharedAddressBook>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.addressBook.name',
        defaultMessage: 'Name',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.addressBook.note',
        defaultMessage: 'Note',
      }),
      dataIndex: 'note',
    },
    {
      title: intl.formatMessage({
        id: 'pages.addressBook.peerCount',
        defaultMessage: 'Peer Count',
      }),
      dataIndex: 'peer_count',
    },
    {
      title: intl.formatMessage({
        id: 'pages.common.action',
        defaultMessage: 'Action',
      }),
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title="Are you sure to delete this address book?"
          onConfirm={async () => {
            try {
              await deleteSharedAddressBooks([record.guid]);
              msgApi.success('Address book deleted');
            } catch {
              msgApi.error('Failed to delete address book');
            }
          }}
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
      <ProTable<API.SharedAddressBook>
        headerTitle={intl.formatMessage({
          id: 'pages.addressBook.shared',
          defaultMessage: 'Shared Address Books',
        })}
        rowKey="guid"
        request={async (params) => {
          const result = await getSharedAddressBooks({
            pageSize: params.pageSize || 10,
            page: params.current || 1,
          });
          return {
            data: result.data || [],
            total: result.total || 0,
            success: true,
          };
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            {intl.formatMessage({
              id: 'pages.addressBook.create',
              defaultMessage: 'Create Address Book',
            })}
          </Button>,
          selectedRowKeys.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title="Are you sure to delete selected address books?"
              onConfirm={handleBatchDelete}
            >
              <Button danger>
                {intl.formatMessage({
                  id: 'pages.common.batchDelete',
                  defaultMessage: 'Batch Delete',
                })}
              </Button>
            </Popconfirm>
          ),
        ]}
      />

      <Modal
        title={intl.formatMessage({
          id: 'pages.addressBook.create',
          defaultMessage: 'Create Address Book',
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
          <Form.Item name="note" label="Note">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default SharedAddressBook;
