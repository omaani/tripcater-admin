import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import { toast } from "react-toastify"; // make sure this is installed and configured
import { CorporateInfoForm } from "./tabs/CorporateInfoForm";
import { CorporateTravelersTable } from "./tabs/CorporateTravelersTable";
import { CorporateTripsTable } from "./tabs/CorporateTripsList";
import { CorporateApprovalsTable } from "./tabs/CorporateApprovalProcessList";
import { CorporateTravelPoliciesTable } from "./tabs/CorporateTravelPoliciesList";
import { CorporatePriceSettingsTable } from "./tabs/CorporatePriceMarkupSettingsList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Home,
  Settings,
  Users,
  ShieldCheck,
  Workflow,
  PlaneTakeoff,
  ArrowLeft,
} from "lucide-react";

const tabs = [
  { label: "Info", value: "info", icon: <Home size={20} /> },
  { label: "Settings", value: "settings", icon: <Settings size={20} /> },
  { label: "Travelers", value: "travelers", icon: <Users size={20} /> },
  { label: "Travel Policies", value: "policies", icon: <ShieldCheck size={20} /> },
  { label: "Approval Process", value: "approvals", icon: <Workflow size={20} /> },
  { label: "Trips", value: "trips", icon: <PlaneTakeoff size={20} /> },
];

export const CorporateEditLayout = ({ corporateId }: { corporateId: string }) => {
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [travelers, setTravelers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [open, setOpen] = useState(false);

  const handleSendActivation = async () => {
    try {
      await api.post(`/corporate/send-activation/${corporateId}`);
      toast.success("Activation email has been sent.");
    } catch (error) {
      toast.error("Failed to send activation email.");
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/corporate/${corporateId}`);
        setBasicInfo(res.data.data?.basicInfo);
        setTravelers(res.data.data?.travelers || []);
        setTrips(res.data.data?.bookings || []);
        setApprovals(res.data.data?.approvalProcesses || []);
        setPolicies(res.data.data?.travelPolicies || []);
        setSettings(res.data.data?.priceMarkupSettings || []);
      } catch {
        setBasicInfo({ name: "Corporate" });
        setTravelers([]);
        setTrips([]);
        setApprovals([]);
        setPolicies([]);
        setSettings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [corporateId]);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Edit Company Info – <span className="text-primary font-bold">{basicInfo?.name || "..."}</span>
        </h3>
        <div className="flex items-center gap-3">
          {/* Send Activation Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Send Activation</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Send Activation Email</DialogTitle>
              <p>This will send a new activation email to the user. The previous link (if any) will be invalidated.</p>
              <DialogFooter className="mt-4">
                <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSendActivation}>Send</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Link
            href="/corporates"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft size={16} /> Back to List
          </Link>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm p-4 border">
        <div className="flex gap-6 border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 pb-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-primary"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Info Tab */}
        {activeTab === "info" && (
          <div className="space-y-6 max-w-2xl">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-5 w-1/3 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
                <div className="h-5 w-1/3 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
                <div className="h-5 w-1/3 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
                <div className="h-5 w-1/3 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
                <div className="h-5 w-1/3 bg-gray-200 rounded" />
                <div className="h-8 w-32 bg-gray-200 rounded" />
              </div>
            ) : (
              <CorporateInfoForm basicInfo={basicInfo} />
            )}
          </div>
        )}

        {activeTab === "travelers" && !loading && (
          <CorporateTravelersTable travelers={travelers} />
        )}

        {activeTab === "trips" && !loading && (
          <CorporateTripsTable trips={trips} />
        )}

        {activeTab === "approvals" && !loading && (
          <CorporateApprovalsTable approvalProcesses={approvals} />
        )}

        {activeTab === "policies" && !loading && (
          <CorporateTravelPoliciesTable travelPolicies={policies} />
        )}

        {activeTab === "settings" && !loading && (
          <CorporatePriceSettingsTable priceSettings={settings} />
        )}
      </div>
    </div>
  );
};
