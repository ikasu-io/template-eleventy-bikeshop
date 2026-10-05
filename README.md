# Fettle Bikes — a bike shop website built with Eleventy

> **Fettle Bikes is a fictional bike shop.** The town of Brindlecombe, the
> people, the bikes and the photos are all made up. The site, its content
> and its images were generated with AI, and it is maintained with
> [Ikasu](https://ikasu.io), an AI content copilot for static sites.
> Use it as a starting point for your own shop, workshop or rental.

A one-page website for a shop with a workshop: bikes for sale with a type
filter and "reserve" links, a workshop price list, bike hire, a weekly
group ride, and a visit section with the week's opening hours, an "open
now" badge and the way from the station drawn as a route.

- [Eleventy](https://www.11ty.dev) 3 (now called Build Awesome) and Eleventy Image, nothing else
- One Markdown file per bike: add, sell or reprice a bike by editing a file
- Photos resized and converted to WebP at build time
- No cookies, no external fonts, maps or scripts; works without JavaScript
- Search-engine data for the shop and every bike (schema.org), sitemap and `robots.txt`

## Getting started

Needs Node.js 20 or newer.

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # static site in _site/
```

## Where to change what

| To change … | Edit |
|---|---|
| A bike: price, status (in stock / reserved / sold), text | its file in `src/bikes/` |
| Add a bike | a new file in `src/bikes/` (copy one) plus its photo in `src/images/` |
| Name, address, phone, email, opening hours | `src/_data/shop.json` |
| The notice bar (holidays, closures) | `notice` in `src/_data/shop.json` — it disappears after its `until` date |
| Workshop prices | `src/_data/workshop.json` |
| Hire prices | `src/_data/hire.json` |
| Section headings and texts | the top of `src/index.njk` |
| Colours, fonts, spacing | `src/_includes/styles.css` (tokens at the top) |

If a bike file has a missing or wrong field — a price that isn't a
number, an unknown type, a photo that doesn't exist — the build stops
and names the file and the field.

## Deploying

`npm run build` writes a static site to `_site/`. Any static host works:
Netlify, Cloudflare Pages, GitHub Pages, your own server. Set `url` in
`src/_data/shop.json` to your domain.

## Eleventy is now Build Awesome

Eleventy was renamed Build Awesome in March 2026. Version 3, used here,
is still published as `@11ty/eleventy` and supported; version 4 will be
published as `@awesome.me/buildawesome`, with the same commands,
configuration and plugins. This template moves over once version 4 is
stable.

## Licence

MIT, see [LICENSE](LICENSE). Images: see [IMAGES.md](IMAGES.md).
