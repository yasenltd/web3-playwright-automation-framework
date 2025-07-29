import { devices } from '@playwright/test';

export default {
  testDir: 'src/tests',
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    trace: 'on',
    screenshot: 'on', // 👈 Capture screenshot on test failure
    video: 'off', // 👈 Record video of the test run
    slowMo: 500, // Slow down by 500ms to observe actions
  },
  reporter: [['html', { title: 'Automation Playwright Framework Report',  open: 'always' }]],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  workers: 1, // increase this number to run tests in parallel
};
