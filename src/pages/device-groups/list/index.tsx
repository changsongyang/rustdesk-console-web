import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { App, Button, Form, Input, Modal, Popconfirm } from 'antd';
import React, { useState } from 'react';
import {
  createDeviceGroup,
  deleteDeviceGroup,
  getDeviceGroupList,
  updateDeviceGroup,
} from '@/services/rustdesk-console/deviceGroup';

const DeviceGroupList: React.FC = () => {
  const intl = useIntl();
  const { message: msgApi } = App.useApp();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();

  const handleCreate = async (values: API.CreateDeviceGroupParams) => {
    try {
      await createDeviceGroup(values);
      msgApi.success('Device group created');
      setCreateModalVisible(false);
      createForm.resetFields();
    } catch {
      msgApi.error('Failed to create device group');
    }
  };

  const handleDelete = async (guid: string) => {
    try {
      await deleteDeviceGroup(guid);
      msgApi.success('Device group deleted');
    } catch {
      msgApi.error('Failed to delete device group');
    }
  };

  const columns: ProColumns<API.DeviceGroupItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.deviceGroups.name',
        defaultMessage: 'Name',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.deviceGroups.note',
        defaultMessage: 'Note',
      }),
      dataIndex: 'note',
    },
    {
      title: intl.formatMessage({
        id: 'pages.deviceGroups.deviceCount',
        defaultMessage: 'Device Count',
      }),
      dataIndex: 'device_count',
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
          title="Are you sure to delete this device group?"
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
      <ProTable<API.DeviceGroupItem>
        headerTitle={intl.formatMessage({
          id: 'pages.deviceGroups.list',
          defaultMessage: 'Device Groups',
        })}
        rowKey="guid"
        request={async (params) => {
          const result = await getDeviceGroupList({
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
              id: 'pages.deviceGroups.create',
              defaultMessage: 'Create Device Group',
            })}
          </Button>,
        ]}
      />

      <Modal
        title={intl.formatMessage({
          id: 'pages.deviceGroups.create',
          defaultMessage: 'Create Device Group',
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
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default DeviceGroupList;
