import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between">
            <h1 className="text-2xl font-bold">URMS</h1>
            <div className="space-x-4">
              <a href="/dashboard">Dashboard</a>
              <a href="/resources">Resources</a>
              <a href="/bookings">Bookings</a>
              <a href="/login">Login</a>
            </div>
          </div>
        </nav>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
