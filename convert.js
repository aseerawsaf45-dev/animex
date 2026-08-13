const fs = require('fs');
let html = fs.readFileSync('C:/Users/PC/.gemini/antigravity-ide/brain/d4cc5e26-970e-41cd-b3b5-83153136acdd/scratch/homepage.html', 'utf8');

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
            prop = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            styleObj[prop] = val;
        }
    });
    return `style={${JSON.stringify(styleObj)}}`;
});

// Self-closing tags
bodyContent = bodyContent.replace(/<img([^>]+)(?<!\/)>/g, '<img$1 />');
bodyContent = bodyContent.replace(/<br>/g, '<br />');

// viewbox to viewBox
bodyContent = bodyContent.replace(/viewbox=/g, 'viewBox=');
bodyContent = bodyContent.replace(/stroke-width=/g, 'strokeWidth=');
bodyContent = bodyContent.replace(/stroke-linejoin=/g, 'strokeLinejoin=');

const jsx = `
export default function Home() {
  return (
    <main>
      ${bodyContent}
    </main>
  );
}
`;

fs.writeFileSync('f:/AnimeX/src/app/page.tsx', jsx);
console.log('Done fixing homepage style conversion!');
