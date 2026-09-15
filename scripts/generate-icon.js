// Generates resources/icon-marketplace.png (128x128) — the gradient tile icon
// used for the VS Code Marketplace gallery listing. Pure Node (zlib only), so it
// runs anywhere without native image tooling. Regenerate with: npm run icon
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const SIZE = 128;
const SS = 4; // supersampling factor for anti-aliasing

// Rounded-rect signed distance (<= 0 means inside), centered box.
function rrDist(x, y, cx, cy, halfW, halfH, r) {
    const dx = Math.max(Math.abs(x - cx) - (halfW - r), 0);
    const dy = Math.max(Math.abs(y - cy) - (halfH - r), 0);
    return Math.hypot(dx, dy) - r;
}

const GRAD_A = [0x00, 0x7a, 0xff]; // #007AFF
const GRAD_B = [0xaf, 0x52, 0xde]; // #AF52DE

// Four inner tiles: [x, y, size] in 128-space, radius 8.
const TILES = [[16, 16, 42], [70, 16, 42], [16, 70, 42], [70, 70, 42]];

// Straight-alpha color at a sub-sampled point.
function sample(x, y) {
    if (rrDist(x, y, 64, 64, 64, 64, 24) > 0) return [0, 0, 0, 0]; // outside card
    const t = Math.min(1, Math.max(0, (x + y) / (SIZE * 2)));
    let r = GRAD_A[0] + (GRAD_B[0] - GRAD_A[0]) * t;
    let g = GRAD_A[1] + (GRAD_B[1] - GRAD_A[1]) * t;
    let b = GRAD_A[2] + (GRAD_B[2] - GRAD_A[2]) * t;
    for (const [tx, ty, s] of TILES) {
        if (rrDist(x, y, tx + s / 2, ty + s / 2, s / 2, s / 2, 8) <= 0) {
            const a = 0.9; // white tile at 90% opacity over the gradient
            r = 255 * a + r * (1 - a);
            g = 255 * a + g * (1 - a);
            b = 255 * a + b * (1 - a);
            break;
        }
    }
    return [r, g, b, 1];
}

// Render with premultiplied averaging so card edges anti-alias correctly.
const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let py = 0; py < SIZE; py++) {
    raw[py * (SIZE * 4 + 1)] = 0; // filter type 0
    for (let px = 0; px < SIZE; px++) {
        let pr = 0, pg = 0, pb = 0, pa = 0;
        for (let sy = 0; sy < SS; sy++) {
            for (let sx = 0; sx < SS; sx++) {
                const x = px + (sx + 0.5) / SS;
                const y = py + (sy + 0.5) / SS;
                const [r, g, b, a] = sample(x, y);
                pr += r * a; pg += g * a; pb += b * a; pa += a;
            }
        }
        const n = SS * SS;
        const alpha = pa / n;
        const r = pa > 0 ? pr / pa : 0;
        const g = pa > 0 ? pg / pa : 0;
        const b = pa > 0 ? pb / pa : 0;
        const off = py * (SIZE * 4 + 1) + 1 + px * 4;
        raw[off] = Math.round(r);
        raw[off + 1] = Math.round(g);
        raw[off + 2] = Math.round(b);
        raw[off + 3] = Math.round(alpha * 255);
    }
}

// Minimal PNG (RGBA, 8-bit) encoder.
const crcTable = (() => {
    const t = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c >>> 0;
    }
    return t;
})();
function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crc]);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 6;  // color type RGBA
const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
]);

const out = path.join(__dirname, '..', 'resources', 'icon-marketplace.png');
fs.writeFileSync(out, png);
console.log(`Wrote ${out} (${png.length} bytes)`);
