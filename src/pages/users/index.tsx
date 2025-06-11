import { MainLayout } from "@/components/layout/MainLayout"
import withAuth from "@/components/ProtectedPage"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Pencil, X } from "lucide-react"
import Link from "next/link"
import api from "@/services/api"
import { toast } from "react-toastify"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type User = {
    id: number
    firstName: string
    lastName: string
    email: string
    roleName: string
    status: "A" | "I"
    createdDate: string | null
}

function UsersPage() {
    const [filters, setFilters] = useState({
        firstName: "",
        lastName: "",
        email: "",
        status: "",
    })
    const [users, setUsers] = useState<User[]>([])
    const [pageIndex, setPageIndex] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [loading, setLoading] = useState(false)
    const isInitialLoad = useRef(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roleId: 1,
    })

    const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
    const [submitAttempted, setSubmitAttempted] = useState(false)

    useEffect(() => {
        if (isInitialLoad.current) {
            fetchUsers()
            isInitialLoad.current = false
        } else {
            searchUsers()
        }
    }, [pageIndex, pageSize])

    useEffect(() => {
        if (showAddForm) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }, [showAddForm])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await api.get(`/users/list?pageIndex=${pageIndex}&pageSize=${pageSize}`)
            const data = res.data?.data
            if (data?.users) {
                setUsers(data.users)
                setTotalPages(data.totalPages)
                setTotalItems(data.totalItems)
            }
        } catch (err) {
            console.error("Failed to fetch users:", err)
        } finally {
            setLoading(false)
        }
    }

    const searchUsers = async () => {
        setLoading(true)
        try {
            const payload = {
                firstName: filters.firstName,
                lastName: filters.lastName,
                email: filters.email,
                roleId: 0,
                status: filters.status === "active" ? "A" : filters.status === "inactive" ? "I" : "",
                pageIndex,
                pageSize,
            }
            const res = await api.post("/users/search", payload)
            const data = res.data?.data
            if (data?.users) {
                setUsers(data.users)
                setTotalPages(data.totalPages)
                setTotalItems(data.totalItems)
            } else {
                setUsers([])
            }
        } catch (err) {
            console.error("Failed to search users:", err)
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        setPageIndex(0)
        searchUsers()
    }

    const handleCreateUser = async () => {
        setSubmitAttempted(true)
        const { firstName, lastName, email, password } = newUser
        if (!firstName || !lastName || !email || !password) {
            toast.error("Please fill all required fields")
            return
        }
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address")
            return
        }
        try {
            const res = await api.post("/user/new", newUser)
            if (res.data.success) {
                toast.success("User created successfully")
                setShowAddForm(false)
                setNewUser({ firstName: "", lastName: "", email: "", password: "", roleId: 1 })
                setTouched({})
                setSubmitAttempted(false)
                fetchUsers()
            } else {
                toast.error(res.data.message || "Failed to create user")
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || "Error occurred"
            toast.error(message)
        }
    }

    const getInputClass = (field: string) => {
        const value = (newUser as any)[field]
        return submitAttempted && !value ? "border-red-500" : ""
    }

    return (
        <MainLayout>
            <div className="p-6 space-y-6 bg-[#f6f7fb] min-h-screen">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#1F2A44]">Users</h1>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-[#0E4E96] text-white rounded-md hover:bg-[#0c3d75] text-sm"
                    >
                        Add User
                    </button>
                </div>

                {showAddForm && (
                    <div
                        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
                        onClick={() => setShowAddForm(false)}
                    >
                        <div
                            className="bg-white p-6 rounded-xl w-full max-w-xl shadow-2xl relative animate-slide-down"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-lg font-semibold text-[#1F2A44] mb-4">Create New User</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    placeholder="First Name *"
                                    className={getInputClass("firstName")}
                                    value={newUser.firstName}
                                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                    onBlur={() => setTouched({ ...touched, firstName: true })}
                                />
                                <Input
                                    placeholder="Last Name *"
                                    className={getInputClass("lastName")}
                                    value={newUser.lastName}
                                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                    onBlur={() => setTouched({ ...touched, lastName: true })}
                                />
                                <Input
                                    placeholder="Email *"
                                    type="email"
                                    className={getInputClass("email")}
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    onBlur={() => setTouched({ ...touched, email: true })}
                                />
                                <Input
                                    placeholder="Password *"
                                    type="password"
                                    className={getInputClass("password")}
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    onBlur={() => setTouched({ ...touched, password: true })}
                                />
                                <Select value={String(newUser.roleId)} onValueChange={(value) => setNewUser({ ...newUser, roleId: parseInt(value) })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Administrators</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button className="bg-[#0E4E96] text-white" onClick={handleCreateUser}>Save</Button>
                                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white p-4 rounded-lg border space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            placeholder="First Name"
                            value={filters.firstName}
                            onChange={(e) => setFilters({ ...filters, firstName: e.target.value })}
                        />
                        <Input
                            placeholder="Last Name"
                            value={filters.lastName}
                            onChange={(e) => setFilters({ ...filters, lastName: e.target.value })}
                        />
                        <Input
                            placeholder="Email"
                            value={filters.email}
                            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                        />
                        <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">All</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end">
                        <Button className="bg-[#0E4E96] hover:bg-[#0c3d75] text-white text-sm" onClick={handleSearch}>
                            Search
                        </Button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-500 mb-2">Total records: {totalItems}</p>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-600 border-b">
                                    <th className="p-2">#</th>
                                    <th className="p-2">First Name</th>
                                    <th className="p-2">Last Name</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Role</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Created</th>
                                    <th className="p-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading
                                    ? [...Array(pageSize)].map((_, idx) => (
                                        <tr key={idx} className="animate-pulse">
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <td key={i} className="p-2">
                                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                    : users.map((user, idx) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="p-2">{pageIndex * pageSize + idx + 1}</td>
                                            <td className="p-2">{user.firstName}</td>
                                            <td className="p-2">{user.lastName}</td>
                                            <td className="p-2">{user.email}</td>
                                            <td className="p-2">{user.roleName}</td>
                                            <td className="p-2">
                                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${user.status === 'A' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {user.status === 'A' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-2">
                                                {user.createdDate ? new Date(user.createdDate).toLocaleDateString() : "-"}
                                            </td>
                                            <td className="p-2 text-right">
                                                <Link href={`/users/${user.id}/edit`}>
                                                    <Button variant="secondary" size="sm" className="flex items-center gap-1">
                                                        <Pencil className="w-4 h-4" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    Page {pageIndex + 1} of {totalPages} | Total records: {totalItems}
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm">
                        <label className="mr-2">Page size:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(parseInt(e.target.value))
                                setPageIndex(0)
                            }}
                            className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
                        >
                            {[10, 20, 30, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPageIndex(i)}
                                    className={`px-3 py-1 rounded-full border text-sm transition ${pageIndex === i
                                        ? "bg-[#0E4E96] text-white border-[#0E4E96]"
                                        : "bg-white text-[#0E4E96] border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}

export default withAuth(UsersPage)