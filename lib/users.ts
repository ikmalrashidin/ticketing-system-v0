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

export async function getUserById(id: string): Promise<User | null> {
  const user = MOCK_USERS.find((u) => u.id === id)

  if (user) {
    // Remove password before returning
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  return null
}

export async function getAllUsers(): Promise<User[]> {
  // Remove passwords before returning
  return MOCK_USERS.map(({ password: _, ...user }) => user)
}
