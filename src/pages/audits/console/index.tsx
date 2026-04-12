import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';
import { getConsoleAudits } from '@/services/rustdesk-console/audit';

const ConsoleAudit: React.FC = () => {
  const intl = useIntl();

  const columns: ProColumns<API.ConsoleAuditItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.audits.user',
        defaultMessage: 'User',
      }),
      dataIndex: 'user',
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
        id: 'pages.audits.detail',
        defaultMessage: 'Detail',
      }),
      dataIndex: 'detail',
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
      <ProTable<API.ConsoleAuditItem>
        headerTitle={intl.formatMessage({
          id: 'pages.audits.console',
          defaultMessage: 'Console Audits',
        })}
        rowKey="id"
        request={async (params) => {
          const result = await getConsoleAudits({
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

export default ConsoleAudit;
