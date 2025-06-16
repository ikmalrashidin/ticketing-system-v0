import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"
import { getUser } from "@/lib/auth"

export default function Home() {
  const user = getUser()

  // Redirect to appropriate dashboard if already logged in
  if (user) {
    if (user.role === "OperationStaff") {
      redirect("/dashboard/operation")
    } else if (user.role === "HQ") {
      redirect("/dashboard/hq")
    } else if (user.role === "Admin") {
      redirect("/dashboard/admin")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Staff Query Portal</h1>
          <p className="mt-2 text-gray-600">Centralized platform for managing staff queries</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
