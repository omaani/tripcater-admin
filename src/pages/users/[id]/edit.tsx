import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "react-toastify"
import api from "@/services/api"
import { MainLayout } from "@/components/layout/MainLayout"
import withAuth from "@/components/ProtectedPage"

function EditUserPage() {
  const router = useRouter()
  const { id } = router.query

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roleId: 1,
    status: "A",
  })

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (id) fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/user/${id}`)
      if (res.data.success) {
        setUser(res.data.data)
      } else {
        toast.error("User not found")
        router.push("/users")
      }
    } catch (err) {
      console.error("Error loading user", err)
      toast.error("Error loading user")
      router.push("/users")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const res = await api.put(`/user/edit/${id}`, user)
      if (res.data.success) {
        toast.success("User updated")
        //router.push("/users")
      } else {
        toast.error(res.data.message || "Update failed")
      }
    } catch (err) {
      toast.error("Update failed")
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      const res = await api.delete(`/user/delete/${id}`)
      if (res.data.success) {
        toast.success("User deleted successfully!")
        router.push("/users")
      } else {
        toast.error(res.data.message || "Delete failed")
      }
    } catch (err) {
      toast.error("Delete failed")
    }
  }

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Both password fields are required")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    try {
      const res = await api.post(`/user/change-password/${id}`, { newPassword })
      if (res.data.success) {
        toast.success("Password changed successfully")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast.error(res.data.message || "Password update failed")
      }
    } catch (err) {
      toast.error("Password update failed")
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-[#f6f7fb] min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#1F2A44]">Edit User</h1>
          <div className="flex items-center gap-2">
            <Link href="/users" className="text-sm text-[#0E4E96] hover:underline">← Back to user list</Link>
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>Delete User</Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="First Name" value={user.firstName} onChange={e => setUser({ ...user, firstName: e.target.value })} />
            <Input placeholder="Last Name" value={user.lastName} onChange={e => setUser({ ...user, lastName: e.target.value })} />
            <Input placeholder="Email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />

            <Select value={String(user.roleId)} onValueChange={value => setUser({ ...user, roleId: parseInt(value) })}>
              <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Administrators</SelectItem>
              </SelectContent>
            </Select>

            <Select value={user.status} onValueChange={value => setUser({ ...user, status: value as "A" | "I" })}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Active</SelectItem>
                <SelectItem value="I">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            {/* <Button variant="outline" onClick={() => router.push("/users")}>Cancel</Button> */}
            <Button className="bg-[#0E4E96] text-white" onClick={handleUpdate} disabled={saving}>Save</Button>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-[#1F2A44]">Change Password</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button className="bg-[#0E4E96] text-white" onClick={handleChangePassword}>Update Password</Button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-slide-down">
              <h2 className="text-lg font-semibold text-[#1F2A44] mb-4">Confirm Delete</h2>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this user?</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete}>Yes, Delete</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default withAuth(EditUserPage)
