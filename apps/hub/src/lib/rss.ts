import rss from '@astrojs/rss'
import { SITE, getPosts, postPath, type Lang } from './site'

export async function blogFeed(lang: Lang) {
  const posts = await getPosts(lang)
  return rss({
    title: lang === 'bg' ? 'Zyankov.eu — блог' : 'Zyankov.eu blog',
    description: lang === 'bg'
      ? 'Статии за думи, игри с думи и изчисления за ремонт.'
      : 'Articles about word games and home-improvement estimates.',
    site: SITE,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postPath(post),
    })),
    customData: `<language>${lang === 'bg' ? 'bg-BG' : 'en-GB'}</language>`,
  })
}
