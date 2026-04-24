import type { Plugin } from 'vite';
import { generateAiDocs } from './generate-ai-docs.js';

/**
 * Vite plugin that regenerates AI-readable documentation artifacts
 * (llms.txt, openapi.json, per-endpoint markdown, robots.txt, sitemap.xml)
 * from src/data/endpoints/*.ts into public/ at dev server start and build start.
 *
 * Runs in Vite's Node context, so no extra runtime (tsx/ts-node) is needed.
 */
export function aiDocsPlugin(): Plugin {
  let ran = false;

  const run = (label: string) => {
    try {
      const stats = generateAiDocs();
      // eslint-disable-next-line no-console
      console.log(
        `[ai-docs] (${label}) wrote ${stats.resources} resources, ${stats.endpoints} endpoints → public/`,
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ai-docs] generation failed:', err);
      throw err;
    }
  };

  return {
    name: 'trustpager-ai-docs',
    // Runs once when the dev server starts.
    configureServer() {
      if (!ran) {
        run('dev');
        ran = true;
      }
    },
    // Runs at the start of every production build.
    buildStart() {
      run('build');
    },
  };
}
