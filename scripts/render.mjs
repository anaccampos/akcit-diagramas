import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(resolve(root, 'diagramas/renderizados'), { recursive: true });
for (const name of ['estrutura', 'consulta']) {
  const result = spawnSync(process.execPath, [
    resolve(root, 'node_modules/@mermaid-js/mermaid-cli/src/cli.js'),
    '-i', resolve(root, `diagramas/${name}.mmd`),
    '-o', resolve(root, `diagramas/renderizados/${name}.svg`),
    '-c', resolve(root, 'mermaid.config.json'),
    '-b', 'white'
  ], { stdio: 'inherit', cwd: root });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
