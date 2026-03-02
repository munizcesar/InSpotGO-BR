import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const searchData = posts
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map(post => ({
      title: post.data.title,
      description: post.data.description ?? '',
      category: post.data.category ?? '',
      url: `/posts/${post.slug}/`,
    }));

  return new Response(JSON.stringify(searchData), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
