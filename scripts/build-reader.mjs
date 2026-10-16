import { mkdir, copyFile, writeFile } from 'node:fs/promises';

// Explicit public asset list: never package the local server or development evidence.
const output = new URL('../reader-dist/', import.meta.url);
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'reader.js', 'authority.js', 'style.css']) {
  await copyFile(new URL(`../reader-client/${name}`, import.meta.url), new URL(name, output));
}
await copyFile(new URL('../LICENSE', import.meta.url), new URL('LICENSE', output));
await writeFile(new URL('404.html', output), '<!doctype html><html lang="en"><meta charset="utf-8"><title>Not found — Open Agenda</title><h1>Page not found</h1><p><a href="/">Open the independent reader</a></p></html>');
console.log('Independent reader ready: reader-dist/ (six public files, no build service required).');
