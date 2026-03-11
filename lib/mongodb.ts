// This allows the app to work without external database setup

const users = new Map()
const items = new Map()
const searchRequests = new Map()

export interface User {
  _id?: string
  email: string
  password: string
  name: string
  phone?: string
  location?: string
  lostItems?: string[]
  foundItems?: string[]
  searchRequests?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Item {
  _id: string
  title: string
  description: string
  category: string
  itemType: string
  location: string
  color?: string
  image: string
  embedding?: number[]
  visualFeatures?: any
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  uploadedAt: Date
}

class InMemoryDB {
  static async connectDB() {
    return { conn: true }
  }

  static async createUser(userData: User) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const user = {
      _id: id,
      ...userData,
      lostItems: [],
      foundItems: [],
      searchRequests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    users.set(id, user)
    users.set(userData.email, user)
    return user
  }

  static async findUserByEmail(email: string) {
    return users.get(email)
  }

  static async findUserById(id: string) {
    return users.get(id)
  }

  static async createItem(itemData: Item) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const item: Item = {
      _id: id,
      ...itemData,
      uploadedAt: new Date(),
    }
    items.set(id, item)
    return item
  }

  static async findItems(query: any = {}) {
    const itemsArray = Array.from(items.values())
    return itemsArray.filter((item: Item) => {
      if (query.itemType && item.itemType !== query.itemType) return false
      if (query.category && item.category !== query.category) return false
      if (query.userId && item.userId !== query.userId) return false
      return true
    })
  }

  static async findItemById(id: string) {
    return items.get(id)
  }

  static async createSearchRequest(data: any) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const request = {
      _id: id,
      ...data,
      createdAt: new Date(),
    }
    searchRequests.set(id, request)
    return request
  }

  static async findSearchRequests(userId: string) {
    const requestsArray = Array.from(searchRequests.values())
    return requestsArray.filter((req: any) => req.userId === userId)
  }
}

export { users, items, searchRequests, InMemoryDB }

export default InMemoryDB
