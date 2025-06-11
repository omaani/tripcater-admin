import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import { CorporateInfoForm } from "./tabs/CorporateInfoForm";
import { CorporateTravelersTable } from "./tabs/CorporateTravelersTable";
import {CorporateTripsTable} from "./tabs/CorporateTripsList";
import {CorporateApprovalsTable} from "./tabs/CorporateApprovalProcessList";
import {CorporateTravelPoliciesTable} from "./tabs/CorporateTravelPoliciesList";
import {CorporatePriceSettingsTable} from "./tabs/CorporatePriceMarkupSettingsList";

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
        <Link
          href="/corporates"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Back to List
        </Link>
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

        {/* Travelers Tab */}
        {activeTab === "travelers" && !loading && (
          <CorporateTravelersTable travelers={travelers} />
        )}

         {/* Trips Tab */}
        {activeTab === "trips" && !loading && (
          <CorporateTripsTable trips={trips} />
        )}

         {/* Approvals Tab */}
        {activeTab === "approvals" && !loading && (
          <CorporateApprovalsTable approvalProcesses={approvals} />
        )}

         {/* Policies Tab */}
          {activeTab === "policies" && !loading && (
            <CorporateTravelPoliciesTable travelPolicies={policies} />
          )}

          {/* settings Tab */}
          {activeTab === "settings" && !loading && (
            <CorporatePriceSettingsTable priceSettings={settings} />
          )}
      </div>
    </div>
  );
};
