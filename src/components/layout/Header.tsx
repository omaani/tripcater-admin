import { Bell, LogOut, Settings as SettingsIcon, User, Activity, Mail, Inbox } from "lucide-react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/router"

export function Header() {
  
  const router = useRouter()
  const { logout } = useAuth()

  const avatarUrl = "/assets/avatar.jpg"

  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const notifRef = useRef(null)
  const menuRef = useRef(null)

  const [userProfile, setUserProfile] = useState<{ firstName: string; lastName: string; email: string } | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const res = await api.get("/user/profile")
        // if (res.data.success) {
        //   setUserProfile(res.data.data)
        // }
      } catch (error) {
        console.error("Failed to load user profile", error)
      }
    }
    fetchProfile()
  }, [])

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-white shadow-sm border-b border-gray-200 font-[Mulish]">
      <div className="font-bold text-[#1F2A44] text-lg">&nbsp;</div>
      <div className="flex items-center gap-6 relative">
        {/* Notifications */}
        <div
          className="relative cursor-pointer"
          ref={notifRef}
          onClick={() => {
            setNotifOpen(!notifOpen)
            setMenuOpen(false)
          }}
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5">3</span>
          {notifOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-md border rounded w-[340px] max-h-[400px] flex flex-col z-50 animate-dropdown">
              <div className="flex items-center justify-between px-4 pt-3">
                <h6 className="font-bold text-gray-900">Notifications</h6>
                <button className="hover:text-primary-mild text-gray-500" title="Mark all as read">
                  <Inbox className="w-5 h-5" />
                </button>
              </div>
              <ul className="px-2 pt-2 pb-1 divide-y overflow-y-auto flex-1 text-sm text-gray-700">
                <li className="py-3 px-2 flex gap-3 hover:bg-gray-100 rounded-lg cursor-pointer relative">
                  <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm flex-1">
                    <p><span className="font-semibold">Jeremiah Minsk</span> mentioned you in comment.</p>
                    <span className="text-xs text-gray-500">2 minutes ago</span>
                  </div>
                  <span className="absolute top-3 right-4 w-2 h-2 bg-gray-400 rounded-full" />
                </li>
                <li className="py-3 px-2 flex gap-3 hover:bg-gray-100 rounded-lg cursor-pointer relative">
                  <div className="bg-orange-200 w-8 h-8 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-800" />
                  </div>
                  <div className="text-sm flex-1">
                    <p><span className="font-semibold">Max Alexander</span> invited you to new project.</p>
                    <span className="text-xs text-gray-500">10 minutes ago</span>
                  </div>
                  <span className="absolute top-3 right-4 w-2 h-2 bg-orange-500 rounded-full" />
                </li>
                <li className="py-3 px-2 flex gap-3 hover:bg-gray-100 rounded-lg cursor-pointer relative">
                  <div className="bg-sky-200 w-8 h-8 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-sky-700" />
                  </div>
                  <div className="text-sm flex-1">
                    <p>Please submit your daily report.</p>
                    <span className="text-xs text-gray-500">3 hours ago</span>
                  </div>
                  <span className="absolute top-3 right-4 w-2 h-2 bg-orange-500 rounded-full" />
                </li>
              </ul>
              <div className="p-3 border-t border-gray-200">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl py-2 text-sm">
                  View All Activity
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div
          className="relative cursor-pointer"
          ref={menuRef}
          onClick={() => {
            setMenuOpen(!menuOpen)
            setNotifOpen(false)
          }}
        >
          <Image
            src={avatarUrl}
            alt="User avatar"
            width={36}
            height={36}
            className="rounded-full border hover:ring-2 hover:ring-blue-400"
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-xl border rounded-2xl w-56 z-50 overflow-hidden animate-dropdown py-4">
              <ul className="text-sm text-gray-800 font-semibold">
                <li className="py-2 px-3 flex items-center gap-3">
                  <span className="avatar avatar-circle avatar-md">
                    <Image
                      src={avatarUrl}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </span>
                  <div>
                    <div className="font-bold text-gray-900">
                      {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "Omar Maani"}
                    </div>
                    <div className="text-xs font-normal text-gray-600">
                      {userProfile? userProfile.email : "oalmeani@gmail.com"}
                    </div>

                  </div>
                </li>
                <li className="border-t mx-2 my-1" />
                <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center">
                  <User className="w-4 h-4" /> Profile
                </li>
                <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center">
                  <SettingsIcon className="w-4 h-4" /> Account Setting
                </li>
                <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center">
                  <Activity className="w-4 h-4" /> Activity Log
                </li>
                <li className="border-t mx-2 my-1" />
                <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center text-red-600"
                  onClick={() => {
                    logout()
                    router.push("/login")
                  }}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

//export default withAuth(Header)