import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://photocut4u.co.uk',
  integrations: [
    react(),
    sitemap(),
    icon({ include: { lucide: ['camera', 'video', 'heart', 'star', 'mail', 'phone', 'map-pin', 'calendar', 'arrow-right', 'play', 'chevron-right', 'chevron-left', 'instagram', 'youtube', 'facebook', 'twitter'] } })
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  trailingSlash: 'always',
  build: {
    assets: 'assets',
  }
});