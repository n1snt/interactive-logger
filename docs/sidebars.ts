import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a sidebar for each doc of that group
 * - provide next/previous navigation
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 *
 * Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'intro',
        'core-concepts',
        'examples',
        'architecture',
        'faq',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/interactive-logger',
        'api-reference/create-instance',
        'api-reference/get-logger',
        'api-reference/download-logs',
        'api-reference/inject-button',
        'api-reference/withdraw-button',
        'api-reference/enable-console-interception',
        'api-reference/disable-console-interception',
        'api-reference/is-console-interception-enabled',
        'api-reference/set-console-logging',
        'api-reference/set-timestamps',
        'api-reference/get-timestamps',
        'api-reference/set-enabled',
        'api-reference/get-enabled',
        'api-reference/enable-console-interface',
        'api-reference/disable-console-interface',
        'api-reference/clear',
        'api-reference/get-stats',
        'api-reference/set-max-logs',
        'api-reference/get-max-logs',
        'api-reference/logger-instance-write-log',
        'api-reference/logger-instance-set-console-logging',
        'api-reference/logger-instance-set-timestamps',
        'api-reference/logger-instance-set-enabled',
      ],
    },
  ],
};

export default sidebars;
