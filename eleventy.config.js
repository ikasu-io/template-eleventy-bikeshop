// Fettle Bikes — Eleventy configuration. Content lives in src/; README.md
// says where to change what.
import fs from 'node:fs';
import path from 'node:path';
import Image, { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

const IMAGES = 'src/images';
const TYPES = ['city', 'gravel', 'cargo', 'kids', 'used'];
const STATUSES = ['in-stock', 'reserved', 'sold'];

// `image: city-bike` in content → "/images/city-bike.jpg", whatever the
// extension. Stops the build if there is no such photo.
function imagePath(name, where) {
  const file = fs.readdirSync(IMAGES).find((f) => path.parse(f).name === name);
  if (!file) throw new Error(`${where}: there is no photo named "${name}" in ${IMAGES}/`);
  return `/images/${file}`;
}

// Checks one bike file's front matter, so a bad edit stops the build with
// the file and the field named instead of producing a broken page.
function checkBike(item) {
  const d = item.data;
  const where = item.inputPath.replace(/^\.\//, '');
  const fail = (field, rule) => {
    throw new Error(`${where}: "${field}" ${rule}`);
  };
  if (typeof d.title !== 'string' || !d.title) fail('title', 'is missing');
  if (!TYPES.includes(d.type)) fail('type', `must be one of ${TYPES.join(', ')}`);
  if (typeof d.price !== 'number' || d.price <= 0) fail('price', 'must be a number in pounds, e.g. 749');
  if (!STATUSES.includes(d.status)) fail('status', `must be one of ${STATUSES.join(', ')}`);
  if (typeof d.sizes !== 'string' || !d.sizes) fail('sizes', 'is missing');
  if (!Array.isArray(d.specs) || d.specs.length === 0) fail('specs', 'needs at least one line');
  if (typeof d.alt !== 'string' || !d.alt) fail('alt', 'is missing (describe the photo)');
  imagePath(d.image, where);
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/fonts': 'fonts', 'src/favicon.svg': 'favicon.svg' });

  // Photos become WebP in four widths at build time; the original stays out
  // of the output.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ['webp'],
    widths: [480, 800, 1200, 1600],
    sharpWebpOptions: { quality: 72 },
    htmlOptions: {
      imgAttributes: { loading: 'lazy', decoding: 'async', sizes: '100vw' },
      fallback: 'smallest',
    },
  });

  // The preview image for links shared on social media and in chats.
  eleventyConfig.on('eleventy.after', async ({ directories }) => {
    await Image(`src${imagePath('hero-shop', 'og.jpg')}`, {
      widths: [1200],
      formats: ['jpeg'],
      outputDir: directories.output,
      filenameFormat: () => 'og.jpg',
      transform: (sharp) => sharp.resize(1200, 630, { fit: 'cover' }),
      sharpJpegOptions: { quality: 80, mozjpeg: true },
    });
  });

  eleventyConfig.addCollection('bikes', (api) => {
    const bikes = api.getFilteredByGlob('src/bikes/*.md');
    bikes.forEach(checkBike);
    return bikes.sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
  });

  eleventyConfig.addFilter('image', (name) => imagePath(name, 'src/index.njk'));
  eleventyConfig.addFilter('pounds', (n) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: n % 1 ? 2 : 0 }).format(n),
  );
  // True while a date (YYYY-MM-DD) has not ended yet, as of the build.
  eleventyConfig.addFilter('notOver', (date) => {
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    return end > new Date();
  });
  eleventyConfig.addFilter('json', (value) => JSON.stringify(value));
  eleventyConfig.addFilter('dashes', (s) => String(s).replace('-', '–'));
  eleventyConfig.addFilter('bikeTypes', (bikes) => TYPES.filter((t) => bikes.some((b) => b.data.type === t)));

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
}
