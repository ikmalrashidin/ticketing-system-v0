import type { User } from "@/types"

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: "user1",
    name: "John Operation",
    role: "OperationStaff",
    username: "john",
    password: "password123",
  },
  {
    id: "user2",
    name: "Jane HQ",
    role: "HQ",
    department: "Finance",
    username: "jane",
    password: "password123",
  },
  {
    id: "user3",
    name: "Admin User",
    role: "Admin",
    username: "admin",
    password: "password123",
  },
  {
    id: "user4",
    name: "Sarah HQ",
    role: "HQ",
    department: "HR",
    username: "sarah",
    password: "password123",
  },
  {
    id: "user5",
    name: "Mike Operation",
    role: "OperationStaff",
    username: "mike",
    password: "password123",
  },
]

// In a real app, you would use a proper authentication system
// This is just a simple mock implementation using localStorage

export async function login(username: string, password: string): Promise<User | null> {
  // Find user with matching credentials
  const user = MOCK_USERS.find((u) => u.username === username && u.password === password)

  if (user) {
    // Remove password before storing in localStorage
    const { password: _, ...userWithoutPassword } = user

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))

    return userWithoutPassword
  }

  return null
}

export function logout(): void {
  localStorage.removeItem("user")
}

export function getUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  const userJson = localStorage.getItem("user")

  if (!userJson) {
    return null
  }

  try {
    return JSON.parse(userJson) as User
  } catch (error) {
    console.error("Error parsing user from localStorage:", error)
    return null
  }
}
