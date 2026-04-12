import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="RustDesk Console"
      links={[
        {
          key: 'RustDesk',
          title: 'RustDesk',
          href: 'https://rustdesk.com',
          blankTarget: true,
        },
        {
          key: 'GitHub',
          title: 'GitHub',
          href: 'https://github.com/rustdesk',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
