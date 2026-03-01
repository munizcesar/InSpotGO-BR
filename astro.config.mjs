import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://inspotgo.com.br',
  build: {
    format: 'directory',
  },
});
