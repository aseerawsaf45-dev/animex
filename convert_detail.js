const fs = require('fs');
let html = fs.readFileSync('C:/Users/PC/.gemini/antigravity-ide/brain/d4cc5e26-970e-41cd-b3b5-83153136acdd/scratch/detail.html', 'utf8');

// Extract the body content (between <body ...> and </body>)
const bodyStart = html.indexOf('<body');
const startIdx = html.indexOf('>', bodyStart) + 1;
const endIdx = html.indexOf('</body>');
let bodyContent = html.substring(startIdx, endIdx);

// Remove script tags
bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');

// Convert HTML comments to JSX comments
bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

bodyContent = bodyContent.replace(/class=/g, 'className=');

// Convert any inline style="..." to JSX object syntax style={{ ... }}
bodyContent = bodyContent.replace(/style=\"([^\"]+)\"/g, (match, p1) => {
    const styleObj = {};
    p1.split(';').forEach(rule => {
        const parts = rule.split(':');
        if (parts.length === 2) {
            let prop = parts[0].trim();
            let val = parts[1].trim();
            // Convert kebab-case to camelCase
            prop = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            styleObj[prop] = val;
        }
    });
    return `style={${JSON.stringify(styleObj)}}`;
});

bodyContent = bodyContent.replace(/<img([^>]+)(?<!\/)>/g, '<img$1 />');
bodyContent = bodyContent.replace(/<br>/g, '<br />');
bodyContent = bodyContent.replace(/<hr([^>]+)(?<!\/)>/g, '<hr$1 />');
bodyContent = bodyContent.replace(/<input([^>]+)(?<!\/)>/g, '<input$1 />');
bodyContent = bodyContent.replace(/viewbox=/g, 'viewBox=');
bodyContent = bodyContent.replace(/stroke-width=/g, 'strokeWidth=');
bodyContent = bodyContent.replace(/stroke-dasharray=/g, 'strokeDasharray=');
bodyContent = bodyContent.replace(/stroke-dashoffset=/g, 'strokeDashoffset=');
bodyContent = bodyContent.replace(/stroke-linecap=/g, 'strokeLinecap=');

const jsx = `
'use client';

export default function AnimeDetail() {
  return (
    <main className="font-body antialiased relative min-h-screen flex flex-col">
      ${bodyContent}
    </main>
  );
}
`;
if(!fs.existsSync('f:/AnimeX/src/app/anime')) fs.mkdirSync('f:/AnimeX/src/app/anime');
fs.writeFileSync('f:/AnimeX/src/app/anime/page.tsx', jsx);
console.log('Done fixing detail page style conversion!');
