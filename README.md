<div align="center">

# nickrodi.com

### **Portfolio self-hosted and built with modern web frameworks**


[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

##### Currently being hosted from my living room using a Raspberry Pi 5 running Debian, and Cloudflare's tunnelling client to connect the server to the public internet.



### [**Visit Live Website »**](https://nickrodi.com)

</div>

## Hosting

Public traffic flows through Cloudflare Tunnel to `http://localhost:3000`.
The live site is managed by PM2 with the process name `website`.

## Updating The Live Site

just run:

```bash
./deploy.sh
```

## Notes to remember

Projects live in `src/content/projects.ts`, ordered most impressive first. The list
renders in three tiers by `variant`: `featured`, then `default`, then `mini`.

- `featured` — image sits on the left at 56% of the card, cropped to roughly 1.7:1, so
  keep the subject centred. A `video: { src, poster }` plays there instead of the image:
  encode with `ffmpeg -an -vf "scale=1280:-2,fps=30" -crf 27 -movflags +faststart`.
- `default` — 112px square thumbnail, centre-cropped, so crop wide screenshots to the
  interesting part first.
- `mini` — text only, no image.