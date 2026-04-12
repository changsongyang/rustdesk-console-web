import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { App, Button, message, Popconfirm, Tag } from 'antd';
import React from 'react';
import {
  deleteDevice,
  disableDevice,
  enableDevice,
  getDeviceList,
} from '@/services/rustdesk-console/device';

const DeviceList: React.FC = () => {
  const intl = useIntl();
  const { message: msgApi } = App.useApp();

  const handleEnable = async (guid: string) => {
    try {
      await enableDevice(guid);
      msgApi.success('Device enabled');
    } catch {
      msgApi.error('Failed to enable device');
    }
  };

  const handleDisable = async (guid: string) => {
    try {
      await disableDevice(guid);
      msgApi.success('Device disabled');
    } catch {
      msgApi.error('Failed to disable device');
    }
  };

  const handleDelete = async (guid: string) => {
    try {
      await deleteDevice(guid);
      msgApi.success('Device deleted');
    } catch {
      msgApi.error('Failed to delete device');
    }
  };

  const columns: ProColumns<API.DeviceItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      copyable: true,
      width: 200,
    },
    {
      title: intl.formatMessage({
        id: 'pages.devices.hostname',
        defaultMessage: 'Hostname',
      }),
      dataIndex: 'hostname',
    },
    {
      title: intl.formatMessage({
        id: 'pages.devices.os',
        defaultMessage: 'OS',
      }),
      dataIndex: 'os',
    },
    {
      title: intl.formatMessage({
        id: 'pages.devices.status',
        defaultMessage: 'Status',
      }),
      dataIndex: 'status',
      render: (_, record) => {
        const isOnline = record.status === 'online';
        return (
          <Tag color={isOnline ? 'green' : 'default'}>
            {isOnline ? 'Online' : 'Offline'}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.devices.user',
        defaultMessage: 'User',
      }),
      dataIndex: 'user_name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.devices.deviceGroup',
        defaultMessage: 'Device Group',
      }),
      dataIndex: 'device_group_name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.devices.lastOnline',
        defaultMessage: 'Last Online',
      }),
      dataIndex: 'last_online_time',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.common.action',
        defaultMessage: 'Action',
      }),
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="enable"
          type="link"
          size="small"
          onClick={() => handleEnable(record.guid)}
        >
          Enable
        </Button>,
        <Button
          key="disable"
          type="link"
          size="small"
          onClick={() => handleDisable(record.guid)}
        >
          Disable
        </Button>,
        <Popconfirm
          key="delete"
          title="Are you sure to delete this device?"
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
      <ProTable<API.DeviceItem>
        headerTitle={intl.formatMessage({
          id: 'pages.devices.list',
          defaultMessage: 'Device List',
        })}
        rowKey="guid"
        request={async (params) => {
          const result = await getDeviceList({
            current: params.current || 1,
            pageSize: params.pageSize || 10,
            accessible: 'all',
            status: 'all',
          });
          return {
            data: result.data || [],
            total: result.total || 0,
            success: true,
          };
        }}
        columns={columns}
        search={false}
        pagination={{ defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};

export default DeviceList;
