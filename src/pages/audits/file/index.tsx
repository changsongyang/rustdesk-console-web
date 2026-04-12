import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';
import { getFileAudits } from '@/services/rustdesk-console/audit';

const FileAudit: React.FC = () => {
  const intl = useIntl();

  const columns: ProColumns<API.FileAuditItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.audits.from',
        defaultMessage: 'From',
      }),
      dataIndex: 'from',
    },
    {
      title: intl.formatMessage({
        id: 'pages.audits.fromName',
        defaultMessage: 'From Name',
      }),
      dataIndex: 'from_name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.audits.to',
        defaultMessage: 'To',
      }),
      dataIndex: 'to',
    },
    {
      title: intl.formatMessage({
        id: 'pages.audits.toName',
        defaultMessage: 'To Name',
      }),
      dataIndex: 'to_name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.audits.filename',
        defaultMessage: 'Filename',
      }),
      dataIndex: 'filename',
    },
    {
      title: intl.formatMessage({
        id: 'pages.audits.action',
        defaultMessage: 'Action',
      }),
      dataIndex: 'action',
    },
    {
      title: intl.formatMessage({
        id: 'pages.audits.time',
        defaultMessage: 'Time',
      }),
      dataIndex: 'time',
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.FileAuditItem>
        headerTitle={intl.formatMessage({
          id: 'pages.audits.file',
          defaultMessage: 'File Transfer Audits',
        })}
        rowKey="id"
        request={async (params) => {
          const result = await getFileAudits({
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
      />
    </PageContainer>
  );
};

export default FileAudit;
