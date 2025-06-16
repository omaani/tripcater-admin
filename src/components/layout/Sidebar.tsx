import Link from "next/link"
import { useRouter } from "next/router"
import {
  Home,
  UserCog,
  Charts,
  UsersRound,
  Briefcase,
  Plane,
  Repeat,
  ShoppingCart,
  LayoutTemplate,
  Inbox,
  Mail,
  Languages,
  TextQuote,
  ShieldCheck,
  CircleDollarSign,
  ScrollText,
  HandHelping,
  KeyRound,
  Settings,
  ChevronRight,
  Menu,
  X,
  PlaneLanding,
  MessageCircle,
  Globe,
  SlidersHorizontal,
  Wrench,
  Logs,
  CalendarSync,
  ChartNoAxesColumn,
  ChartNoAxesCombined,
  ChartBar,
  ChartBarBig,
  ChartPie,
  Receipt,
  ReceiptText,
  Activity,
  TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean | null>(null)
  useEffect(() => {
    const stored = localStorage.getItem('sidebarCollapsed')
    if (stored !== null) {
      setCollapsed(JSON.parse(stored))
    } else {
      setCollapsed(false)
    }
  }, [])
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const router = useRouter()

  // Removed auto-collapse on route change

  const handleHover = (group: string | null) => {
    setOpenGroup(group)
  }

  if (collapsed === null) return null;

  return (
    <aside className={`h-screen bg-white border-r shadow-sm transition-all duration-200 font-[Mulish] ${collapsed ? "w-16" : "w-64"}`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <img src="/assets/logo.svg" alt="Tripcater" className="h-8" />}
        <button onClick={() => {
          const newState = !collapsed
          setCollapsed(newState)
          if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
          }
        }}>
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      <nav className="p-3 text-[15px] font-medium text-gray-800 space-y-2">
        <SidebarNavItem href="/dashboard" icon={<Home size={22} />} label="Dashboard" collapsed={collapsed} currentPath={router.pathname} />
        <SidebarNavItem href="/users" icon={<UserCog size={22} />} label="Users" collapsed={collapsed} currentPath={router.pathname} />
        <SidebarNavItem href="/corporates" icon={<Briefcase size={22} />} label="Corporates" collapsed={collapsed} currentPath={router.pathname} />

        <SidebarGroup title="Sales" groupKey="sales" collapsed={collapsed} open={openGroup === "sales"} onHover={handleHover} groupIcon={<ChartNoAxesCombined size={22} />} items={[
          { label: "Demo Requests", icon: <HandHelping size={18} />, href: "/demo-requests" },
          { label: "Invoices", icon: <ReceiptText size={18} />, href: "/invoices" }
        ]} currentPath={router.pathname} />

        <SidebarGroup title="Trips" groupKey="trips" collapsed={collapsed} open={openGroup === "trips"} onHover={handleHover} groupIcon={<PlaneLanding size={22} />} items={[
          { label: "Trips", icon: <Plane size={18} />, href: "/trips" },
          { label: "Trip Change Requests", icon: <Repeat size={18} />, href: "/trip-change-requests" },
          { label: "Travelers", icon: <UsersRound size={18} />, href: "/travelers" },
          { label: "Shopping Cart", icon: <ShoppingCart size={18} />, href: "/shopping-cart" }
        ]} currentPath={router.pathname} />

        <SidebarGroup title="Communication" groupKey="communication" collapsed={collapsed} open={openGroup === "communication"} onHover={handleHover} groupIcon={<MessageCircle size={22} />} items={[
          { label: "Email Templates", icon: <LayoutTemplate size={18} />, href: "/email-templates" },
          { label: "Queued Emails", icon: <Inbox size={18} />, href: "/queued-emails" },
          { label: "Email Accounts", icon: <Mail size={18} />, href: "/email-accounts" }
        ]} currentPath={router.pathname} />

        <SidebarGroup title="Localization" groupKey="localization" collapsed={collapsed} open={openGroup === "localization"} onHover={handleHover} groupIcon={<Globe size={22} />} items={[
          { label: "Languages", icon: <Languages size={18} />, href: "/languages" },
          { label: "Localized Labels", icon: <TextQuote size={18} />, href: "/localized-resources" }
        ]} currentPath={router.pathname} />

        <SidebarGroup title="Settings" groupKey="settings" collapsed={collapsed} open={openGroup === "settings"} onHover={handleHover} groupIcon={<SlidersHorizontal size={22} />} items={[
          { label: "Permissions", icon: <ShieldCheck size={18} />, href: "/permissions" },
          { label: "Currency", icon: <CircleDollarSign size={18} />, href: "/currencies" },
          { label: "SABRE Tokens", icon: <KeyRound size={18} />, href: "/token-sessions" }
        ]} currentPath={router.pathname} />

        <SidebarGroup title="Maintenance" groupKey="maintenance" collapsed={collapsed} open={openGroup === "maintenance"} onHover={handleHover} groupIcon={<Wrench size={22} />} items={[
          { label: "Schedule Tasks", icon: <CalendarSync size={18} />, href: "/scheduled-tasks" },
          { label: "Logs", icon: <Logs size={18} />, href: "/logs" }
        ]} currentPath={router.pathname} />

        <SidebarGroup title="Reports" groupKey="reports" collapsed={collapsed} open={openGroup === "reports"} onHover={handleHover} groupIcon={<ChartPie size={22} />} items={[
          { label: "Sales summary", icon: <ChartBarBig size={18} />, href: "/sales-summary" },
          { label: "Traveler activity", icon: <Activity size={18} />, href: "/traveler-activity" },
          { label: "Service Level Insights", icon: <TrendingUp size={18} />, href: "/insights" },
        ]} currentPath={router.pathname} />
      </nav>
    </aside>
  )
}

function SidebarNavItem({ href, icon, label, collapsed, currentPath }: { href: string; icon: React.ReactNode; label: string; collapsed: boolean; currentPath: string }) {
  const isActive = currentPath === href
  return (
    <Link href={href} className={`font-bold group relative block`}>
      <div className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${isActive ? "bg-[#E6F0FF] text-[#0E4E96]" : "hover:bg-gray-100"}`}>
        {icon}
        {!collapsed && <span>{label}</span>}
      </div>
      {collapsed && (
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
          {label}
        </span>
      )}
    </Link>
  )
}

function SidebarGroup({ title, groupKey, items, open, onHover, collapsed, groupIcon, currentPath }: {
  title: string
  groupKey: string
  items: { label: string; icon: React.ReactNode; href: string }[]
  open: boolean
  onHover: (key: string | null) => void
  collapsed: boolean
  groupIcon: React.ReactNode
  currentPath: string
}) {
  const groupActive = items.some(item => currentPath.startsWith(item.href))
  return (
    <div
      className="relative group"
      onMouseEnter={() => collapsed && onHover(groupKey)}
      onMouseLeave={() => collapsed && onHover(null)}
    >
      <div
        className={`flex items-center justify-between cursor-pointer p-2 rounded-lg transition-all duration-200 ${groupActive ? "bg-[#E6F0FF] text-[#0E4E96]" : "hover:bg-gray-100"}`}
        onClick={() => {
          if (!collapsed) {
            onHover(open ? null : groupKey)
          }
        }}
      >

        <div className="font-bold flex items-center gap-2">
          {groupIcon}
          {!collapsed && <span>{title}</span>}
        </div>
        {!collapsed && <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />}
      </div>

      {open && !collapsed && (
        <ul className="ml-8 mt-1 space-y-1 text-gray-600">
          {items.map(item => (
            <li key={item.label}>
              <Link href={item.href} className={`flex items-center gap-2 p-1 rounded hover:text-[#0E4E96] transition-colors duration-200 ${currentPath === item.href ? "text-[#0E4E96] font-semibold" : ""}`}>
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Tooltip submenu when collapsed */}
      {collapsed && open && (
        <ul className="absolute left-full top-0 ml-2 mt-0 bg-white rounded-lg shadow-lg border w-48 z-50 animate-fade-in">
          {items.map(item => (
            <li key={item.label}>
              <Link href={item.href} className={`flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200 ${currentPath === item.href ? "bg-[#E6F0FF] text-[#0E4E96] font-semibold" : ""}`}>
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
