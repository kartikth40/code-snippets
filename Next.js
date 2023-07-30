// Points to note - 
// - no server components inside client conponents
// - when changing server comp. to client, remember to remove asyncronization from comp declaractions


// data rendering options
export const dynamic = 'auto'  // 'auto' (default) | 'force-dynamic' | 'force-static'
export const revalidate = 3600 // revalidate data after certain no. of seconds

// data fetching using axios
//

// generateStaticParams
// used when data do not change very often (ideal for blog posts), should be used with revalidate 
export async function generateStaticParams() {
  const posts = await fetch('endpoint_url').then(res => res.json())
  return posts.map(post => ({slug: post.slug}))  // unique identifiers as slugs
}

