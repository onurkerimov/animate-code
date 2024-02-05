import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  addons: ['@storybook/addon-a11y', '@storybook/addon-essentials'],
  "stories": [
    "../packages/**/*.stories.@(js|jsx|ts|tsx)",
    "../examples/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  }
}

export default config
