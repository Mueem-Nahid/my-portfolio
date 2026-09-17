/**
 * Caps oversized screenshots so image optimization stays fast and reliable
 * (very large sources can be slow, memory-hungry, or rejected in production).
 *
 * Usage: node scripts/optimize-images.mjs [--max-edge 4000]
 *
 * Runs over public/images/projects/<slug>/webp/*.webp in place. Keep the
 * original full-resolution files elsewhere (the PNGs next to the webp folder
 * are left untouched).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const MAX_EDGE = (() => {
  const i = process.argv.indexOf("--max-edge");
  return i !== -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : 4000;
})();

const base = path.join(process.cwd(), "public", "images", "projects");

async function run() {
  let changed = 0;
  let saved = 0;

  for (const project of fs.readdirSync(base)) {
    const dir = path.join(base, project, "webp");
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!/\.webp$/i.test(file)) continue;
      const full = path.join(dir, file);
      const before = fs.statSync(full).size;

      // Read into memory first: writing in place while sharp holds a file
      // handle fails on Windows (UNKNOWN: unknown error, open).
      const input = fs.readFileSync(full);
      const meta = await sharp(input).metadata();
      if (!meta.width || !meta.height) continue;
      if (Math.max(meta.width, meta.height) <= MAX_EDGE) continue;

      const buffer = await sharp(input)
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      fs.writeFileSync(full, buffer);

      const after = fs.statSync(full).size;
      changed++;
      saved += before - after;
      console.log(
        `${project}/${file}: ${meta.width}x${meta.height} (${Math.round(before / 1024)}KB) -> ` +
          `${Math.round(after / 1024)}KB`,
      );
    }
  }

  console.log(
    changed === 0
      ? `\nNo images exceed ${MAX_EDGE}px.`
      : `\nResized ${changed} image(s), saved ${Math.round(saved / 1024)}KB.`,
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
