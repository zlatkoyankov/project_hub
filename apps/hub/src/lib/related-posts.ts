// Which blog posts to link from a tool page or under a post. Posts about the same tool come first,
// then posts about related tools (RELATED_TOOLS, both directions), then the same topic, then the
// rest. Within each rank the order of `posts` is kept (getPosts returns the newest first).
import type { Post } from './site'
import { POST_TOOL_IDS, RELATED_TOOLS, postCategory } from './tools'

const catalogId = (post: Post) => (post.data.tool ? POST_TOOL_IDS[post.data.tool] : undefined)

const isRelated = (a: string | undefined, b: string | undefined) =>
  Boolean(a && b && ((RELATED_TOOLS[a] ?? []).includes(b) || (RELATED_TOOLS[b] ?? []).includes(a)))

function rank(post: Post, toolId: string | undefined, category: string | undefined) {
  const id = catalogId(post)
  if (toolId && id === toolId) return 0
  if (isRelated(toolId, id)) return 1
  if (category && postCategory(post.data.tool) === category) return 2
  return 3
}

/** Up to `limit` posts to read next after `post`: related tools first, then the same topic. */
export function relatedPosts(post: Post, posts: Post[], limit = 3): Post[] {
  const toolId = catalogId(post)
  const category = postCategory(post.data.tool)
  return posts
    .filter((entry) => entry.id !== post.id)
    .map((entry, index) => ({ entry, index, rank: rank(entry, toolId, category) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, limit)
    .map(({ entry }) => entry)
}

/**
 * Posts for a tool page: every post about the tool itself, topped up to `min` with posts about
 * related tools, so no tool page is left without articles when a related one exists.
 */
export function postsForTool(toolId: string, posts: Post[], min = 3): Post[] {
  const own = posts.filter((entry) => catalogId(entry) === toolId)
  if (own.length >= min) return own
  const related = posts.filter((entry) => catalogId(entry) !== toolId && isRelated(toolId, catalogId(entry)))
  return [...own, ...related].slice(0, Math.max(min, own.length))
}
