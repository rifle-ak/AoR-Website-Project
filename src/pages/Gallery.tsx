import { useState } from 'react'
import { X, Download, Calendar, User } from 'lucide-react'

interface GalleryItem {
  id: number
  title: string
  author: string
  date: string
  category: string
  imageUrl: string
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: "Epic Base Build",
      author: "RustMaster",
      date: "2024-01-15",
      category: "bases",
      imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3a803d?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Helicopter Raid",
      author: "BanditKing",
      date: "2024-01-14",
      category: "raids",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Sunset at Monument",
      author: "Explorer",
      date: "2024-01-13",
      category: "screenshots",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Clan Victory",
      author: "Warrior",
      date: "2024-01-12",
      category: "events",
      imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Underwater Base",
      author: "BuilderPro",
      date: "2024-01-11",
      category: "bases",
      imageUrl: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Tank Battle",
      author: "TankCommander",
      date: "2024-01-10",
      category: "raids",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
    }
  ]

  const categories = [
    { value: 'all', label: 'All Images' },
    { value: 'bases', label: 'Bases' },
    { value: 'raids', label: 'Raids' },
    { value: 'screenshots', label: 'Screenshots' },
    { value: 'events', label: 'Events' }
  ]

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Community Gallery</h1>
          <p className="text-lg text-dark-300 max-w-3xl mx-auto">
            Amazing moments captured by our community members. Submit your screenshots in Discord to be featured!
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-rust-500 text-white'
                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="card cursor-pointer group hover:border-rust-500 transition-all duration-300"
              onClick={() => setSelectedImage(item)}
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <div className="flex items-center justify-between text-sm text-dark-400">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{item.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-400 text-lg">No images found in this category</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-dark-300 mb-4">
            Want to submit your own screenshots? Join our Discord server!
          </p>
          <a
            href="https://discord.gg/artofrust"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Join Discord
          </a>
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-rust-500 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="bg-dark-800 rounded-lg overflow-hidden">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h2>
                <div className="flex items-center justify-between text-dark-300">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>{selectedImage.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(selectedImage.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const link = document.createElement('a')
                      link.href = selectedImage.imageUrl
                      link.download = `${selectedImage.title}.jpg`
                      link.click()
                    }}
                    className="flex items-center space-x-2 text-rust-500 hover:text-rust-400 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
