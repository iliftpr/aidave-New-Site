export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

export interface Review {
  id: string
  name: string
  business: string
  industry: string
  rating: number
  text: string
  avatar?: string
}

export interface PortfolioItem {
  id: string
  title: string
  industry: string
  description: string
  features: string[]
  imageDesktop: string
  imageMobile: string
  url?: string
}
