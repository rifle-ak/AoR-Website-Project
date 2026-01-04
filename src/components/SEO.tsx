import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  type?: 'website' | 'article'
  author?: string
}

const defaultMeta = {
  title: 'Art of Rust - Premium Rust Gaming Community',
  description: 'Join the Art of Rust gaming community. Experience premium Rust servers with active admins, custom events, and an amazing player base.',
  keywords: 'rust, rust game, gaming server, multiplayer, survival, pvp, Art of Rust, AOR',
  image: '/og-image.png',
  url: 'https://artofrust.com',
}

export default function SEO({
  title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  image = defaultMeta.image,
  type = 'website',
  author = 'Art of Rust',
}: SEOProps) {
  const location = useLocation()
  const fullTitle = title ? `${title} | Art of Rust` : defaultMeta.title
  const fullUrl = `${defaultMeta.url}${location.pathname}`

  useEffect(() => {
    // Update document title
    document.title = fullTitle

    // Update meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('author', author)

    // Open Graph
    updateMetaTag('og:title', fullTitle, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:image', image, 'property')
    updateMetaTag('og:url', fullUrl, 'property')
    updateMetaTag('og:type', type, 'property')
    updateMetaTag('og:site_name', 'Art of Rust', 'property')

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image', 'name')
    updateMetaTag('twitter:title', fullTitle, 'name')
    updateMetaTag('twitter:description', description, 'name')
    updateMetaTag('twitter:image', image, 'name')

    // Canonical URL
    updateLinkTag('canonical', fullUrl)
  }, [fullTitle, description, keywords, image, fullUrl, type, author])

  return null
}

function updateMetaTag(
  key: string,
  content: string,
  attribute: string = 'name'
) {
  let element = document.querySelector(
    `meta[${attribute}="${key}"]`
  ) as HTMLMetaElement

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.content = content
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(
    `link[rel="${rel}"]`
  ) as HTMLLinkElement

  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }

  element.href = href
}

// Hook for easy SEO usage
export function useSEO(props: SEOProps) {
  return <SEO {...props} />
}
