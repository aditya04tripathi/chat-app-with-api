export default {
  apps: [
    {
      name: "vite-app",
      script: "pnpm",
      args: "preview",
      cwd: "/Users/tripathi/_development/web_dev/chhoti-cutie",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "cluster",
    },
    {
      name: "nest-app",
      script: "pnpm",
      args: "start:prod",
      cwd: "/Users/tripathi/_development/web_dev/chhoti-cutie/backend",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "fork",
    },
  ],
};
