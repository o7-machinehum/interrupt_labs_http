# Rootkit Labs website

Run `hugo server --disableFastRender` to preview the site. GitHub Actions builds
and deploys it when changes reach `master`; generated files in `docs/` are ignored.

## Typography

The homepage, product pages, and blog share the font choices in `static/css/fonts.css`:
Metropolis regular for body text, bold for headings, and semibold for controls and
labels. Use the `--font-sans` variables in page styles so these choices stay
consistent. Code uses `--font-mono`; social icons keep their dedicated icon fonts.
Product titles share the original homepage Phantomdrive title style in
`static/css/products.css`: Metropolis Bold, normal letter spacing, a 1.08 line
height, and a responsive 40–88px size across the homepage and product pages.

## Product pages

All products use `layout: "product"` and the same
[`layouts/_default/product.html`](layouts/_default/product.html) template. Edit
each product's Markdown file in `content/` to change its content. Use
[`blackpants.md`](content/blackpants.md) as a simple example and
[`phantomdrive.md`](content/phantomdrive.md) for the optional sections.

Each page opens with a full-screen product photo using `cover` and `image_alt`,
with `title` and a short `tagline` overlaid. `hero_position` optionally adjusts the
image crop (for example, `"center 25%"`). `hero_mobile_position` overrides the crop
on screens up to 700px wide, on both the product page and its homepage panel.
Use a horizontal value above 50% to show more of the photo's right side, or below
50% for the left side (for example, `"70% center"`). Desktop crops stay unchanged.
The featured video appears immediately
below the photo, without a duplicate heading above the player, followed by the
introduction and deeper sections. The top navigation contains only the Rootkit Labs
home logo. `shop` supplies the purchase link beneath the product title and the
always-visible floating Buy now button at the bottom right.
The Markdown body supplies the introduction, falling back to
`description` when empty. Set `hide_intro: true` to skip that section, as Phantomdrive
does to lead directly from its video into the story and unlock sequence.

Set `featured_video` to the main, up-to-date product introduction, with `title`,
`embed`, and optionally `url`. Update that field when a new introduction is ready.
Keep older videos and talks in `videos`, without repeating the featured video.

Every product includes `specs` and `gallery` for the shared Product Details section
and image carousel. Keep these fields when adding another product. The other
sections are optional; omit a field to leave its section out.

| Field | Content |
| --- | --- |
| `story` | `title`, `text`, and a background `image` |
| `steps` | `title` and `items`, each with `title` and `text` |
| `specs` | Entries with `label` and `text` |
| `gallery` | Images beneath the specs, each with `image`, `alt`, and `caption` |
| `feature` | A feature panel with `id`, `title`, `text`, `image`, `alt`, and optional `links` (`label`, `url`); see Blackhat's Edgar case |
| `media` | Articles with `publisher`, `title`, and `url` |
| `videos` | Full-length videos with `title` and `embed`; optional `url` records the original link |
| `related_posts` | Hugo content paths for relevant blog posts; drafts are excluded |
| `faq` | Entries with `question` and `answer` |

Section text and FAQ answers support Markdown, including links. Use YouTube's
`https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0` URL for embeds, without start
offsets. Media, Videos, and From the blog remain separate light sections.

Shared components live in `layouts/partials/product-*.html`; styling is in
`static/css/products.css` and the shared product components in `static/css/style.css`.
Gallery behavior lives in `static/js/product.js`. Add a reusable
partial and a call in the shared layout when a new kind of section is needed.

The additional Blackpants rear and Ovrdrive interior photos come from the
[Blackpants](https://shop.rootkitlabs.com/products/blackpants) and
[Ovrdrive](https://shop.rootkitlabs.com/products/ovrdrive-usb) shop listings.
