#!/usr/bin/env node
// Build script: obfusca widget/index.html e viewer.html → widget/publish/

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const SRC_DIR  = path.join(__dirname, 'widget');
const OUT_DIR  = path.join(__dirname, 'widget', 'publish');

const FILES = ['index.html', 'viewer.html'];

// Opzioni obfuscator: buon compromesso leggibilità/protezione
const OBFUSCATOR_OPTS = [
    '--compact true',
    '--control-flow-flattening false',
    '--dead-code-injection false',
    '--identifier-names-generator hexadecimal',
    '--rename-globals false',
    '--self-defending false',
    '--string-array true',
    '--string-array-encoding rc4',
    '--string-array-threshold 0.75',
    '--split-strings false',
    '--transform-object-keys true',
].join(' ');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

FILES.forEach(filename => {
    const srcPath = path.join(SRC_DIR, filename);
    if (!fs.existsSync(srcPath)) {
        console.warn(`Skipping ${filename} (not found)`);
        return;
    }

    let html = fs.readFileSync(srcPath, 'utf8');

    // Trova e obfusca tutti i blocchi <script> normali (non type=...)
    let count = 0;
    html = html.replace(/<script(?!\s+type)(\s[^>]*)?>[\s\S]*?<\/script>/gi, (match) => {
        // Estrai il contenuto del tag
        const openTagEnd = match.indexOf('>') + 1;
        const closeTagStart = match.lastIndexOf('<\/script>');
        const openTag = match.slice(0, openTagEnd);
        const jsContent = match.slice(openTagEnd, closeTagStart);

        if (!jsContent.trim()) return match;

        // Scrivi JS in file temporaneo, obfusca, rileggi
        const tmpIn  = path.join(os.tmpdir(), `_makor_in_${Date.now()}.js`);
        const tmpOut = path.join(os.tmpdir(), `_makor_out_${Date.now()}.js`);
        fs.writeFileSync(tmpIn, jsContent, 'utf8');

        try {
            execSync(`javascript-obfuscator "${tmpIn}" --output "${tmpOut}" ${OBFUSCATOR_OPTS}`, { stdio: 'pipe' });
            const obfuscated = fs.readFileSync(tmpOut, 'utf8');
            count++;
            return `${openTag}\n${obfuscated}\n<\/script>`;
        } finally {
            if (fs.existsSync(tmpIn))  fs.unlinkSync(tmpIn);
            if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
        }
    });

    const outPath = path.join(OUT_DIR, filename);
    fs.writeFileSync(outPath, html, 'utf8');

    const srcSize  = Math.round(fs.statSync(srcPath).size  / 1024);
    const outSize  = Math.round(fs.statSync(outPath).size  / 1024);
    console.log(`✓ ${filename}  ${srcSize}KB → ${outSize}KB  (${count} script obfuscati)`);
});

console.log(`\nOutput: ${OUT_DIR}`);
