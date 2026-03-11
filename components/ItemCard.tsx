interface Item {
  _id: string
  title: string
  description: string
  category: string
  itemType: string
  location: string
  image: string
  uploadedAt: string
}

interface ItemCardProps {
  item: Item
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="bg-gray-200 h-48 flex items-center justify-center">
        {item.image ? (
          <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{item.title}</h3>
          <span
            className={`text-xs px-2 py-1 rounded ${
              item.itemType === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {item.itemType === "lost" ? "Lost" : "Found"}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{item.category}</span>
          <span>{item.location}</span>
        </div>
      </div>
    </div>
  )
}
