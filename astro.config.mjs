import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  site: 'https://inspotgo.com.br',
  adapter: cloudflare(),
  build: {
    format: 'directory',
  },
});
