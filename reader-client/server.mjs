import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const files = { '/': ['index.html','text/html'], '/index.html':['index.html','text/html'], '/reader.js':['reader.js','text/javascript'], '/authority.js':['authority.js','text/javascript'], '/style.css':['style.css','text/css'] };
createServer(async (req,res) => { const entry=files[new URL(req.url,'http://localhost').pathname];if(!entry){res.writeHead(404);res.end('Not found');return;}try{const data=await readFile(new URL(entry[0],import.meta.url));res.writeHead(200,{'Content-Type':entry[1]+'; charset=utf-8','Cache-Control':'no-store'});res.end(data);}catch{res.writeHead(500);res.end('Could not load file');} }).listen(3101,'127.0.0.1',()=>console.log('Independent reader: http://localhost:3101'));
