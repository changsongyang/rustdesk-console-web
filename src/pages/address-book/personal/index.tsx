import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Card, Empty } from 'antd';
import React from 'react';

const PersonalAddressBook: React.FC = () => {
  const intl = useIntl();

  return (
    <PageContainer>
      <Card>
        <Empty
          description={intl.formatMessage({
            id: 'pages.addressBook.personal.empty',
            defaultMessage: 'No personal address book data',
          })}
        />
      </Card>
    </PageContainer>
  );
};

export default PersonalAddressBook;
