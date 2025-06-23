"use client";

import { useEffect, useRef, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import withAuth from "@/components/ProtectedPage";
import { Eye, PlaneTakeoff } from "lucide-react";
import api from "@/services/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Trip {
    customId: string;
    status: string;
    serviceType: string;
    flightType: string;
    orderTotal: string;
    createdDate: string;
    numberOfTravelers: number;
    id: number;
}

function getStatusStyle(status: string) {
    switch (status) {
        case "OnHold": return "bg-yellow-100 text-yellow-800";
        case "Pending Approval": return "bg-blue-100 text-blue-800";
        case "Pending Issuance": return "bg-purple-100 text-purple-800";
        case "Issued": return "bg-green-100 text-green-800";
        case "Rejected": return "bg-red-100 text-red-800";
        case "Refunded": return "bg-gray-200 text-gray-800";
        case "Cancelled": return "bg-red-100 text-red-700";
        case "upcoming": return "bg-cyan-100 text-cyan-800";
        case "past": return "bg-gray-100 text-gray-700";
        default: return "bg-muted text-muted-foreground";
    }
}

const tripStatusOptions = [
    { text: "On Hold", value: "OnHold" },
    { text: "Pending Approval", value: "Pending Approval" },
    { text: "Pending Issuance", value: "Pending Issuance" },
    { text: "Issued", value: "Issued" },
    { text: "Rejected", value: "Rejected" },
    { text: "Refunded", value: "Refunded" },
    { text: "Cancelled", value: "Cancelled" },
    { text: "Upcoming (Disabled)", value: "upcoming", disabled: true },
    { text: "Past (Disabled)", value: "past", disabled: true },
    { text: "Other", value: "other" },
];

const cabinClassOptions = [
    { text: "Economy", value: "Y" },
    { text: "Business", value: "C" },
];

function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [bookingId, setBookingId] = useState("");
    const [pnrCode, setPnrCode] = useState("");
    const [status, setStatus] = useState("");
    const [flightCabinClass, setFlightCabinClass] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);

    const isInitialLoad = useRef(true);

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const res = await api.post("/trips/search", {
                bookingId,
                pnrCode,
                status,
                flightCabinClass,
                pageIndex,
                pageSize,
            });
            const result = res.data.data;
            setTrips(result.trips || []);
            setTotalPages(result.totalPages || 1);
            setTotalRecords(result.totalItems || 0);
        } catch (err) {
            console.error("Failed to fetch trips:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    fetchTrips();
}, [pageIndex, pageSize]);

    return (
        <MainLayout>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold text-[#1F2A44]">Trips</h1>

                <div className="bg-white p-4 rounded-lg border space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Booking ID"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
                        />
                        <input
                            type="text"
                            placeholder="PNR Code"
                            value={pnrCode}
                            onChange={(e) => setPnrCode(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
                        />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
                        >
                            <option value="">All Statuses</option>
                            {tripStatusOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                    title={option.disabled ? "Temporarily unavailable" : undefined}
                                >
                                    {option.text}
                                </option>
                            ))}
                        </select>
                        <select
                            value={flightCabinClass}
                            onChange={(e) => setFlightCabinClass(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
                        >
                            <option value="">All Cabin Classes</option>
                            {cabinClassOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.text}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4 text-right">
                        <button
                            onClick={() => {
                                setPageIndex(0);
                                fetchTrips();
                            }}
                            className="px-4 py-2 bg-[#0E4E96] text-white rounded-md text-sm hover:bg-[#0c3d75]"
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-500 mb-2">Total records: {totalRecords}</p>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-600 border-b">
                                    <th className="p-2">Trip ID</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Service Type</th>
                                    <th className="p-2">Flight Type</th>
                                    <th className="p-2">Order Total</th>
                                    <th className="p-2">Created Date</th>
                                    <th className="p-2"># Travelers</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(pageSize)].map((_, idx) => (
                                        <tr key={idx} className="animate-pulse">
                                            <td className="p-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                                            <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                                            <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                                            <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                                            <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                                            <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                                            <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/6"></div></td>
                                            <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/6"></div></td>
                                        </tr>
                                    ))
                                ) : trips.length ? trips.map((trip) => (
                                    <tr key={trip.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{trip.customId}</td>
                                        <td className="p-2">
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusStyle(trip.status)}`}>
                                                {trip.status}
                                            </span>
                                        </td>
                                        <td className="p-2 flex items-center gap-1">
                                            <PlaneTakeoff className="w-4 h-4 text-[#0E4E96]" /> {trip.serviceType}
                                        </td>
                                        <td className="p-2">{trip.flightType}</td>
                                        <td className="p-2">{trip.orderTotal}</td>
                                        <td className="p-2">{trip.createdDate}</td>
                                        <td className="p-2">{trip.numberOfTravelers}</td>
                                        <td className="p-2">
                                            <Link href={`/trips/${trip.id}/view`}>
                                                <Button variant="secondary" size="sm" className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" /> View
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={8} className="p-4 text-center text-gray-500">No results found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    Page {pageIndex + 1} of {totalPages} | Total records: {totalRecords}
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm">
                        <label className="mr-2">Page size:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(parseInt(e.target.value));
                                setPageIndex(0);
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
  <div className="flex items-center gap-2">
    <button
      onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
      disabled={pageIndex === 0}
      className={`px-3 py-1 rounded-full border text-sm transition ${
        pageIndex === 0
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white text-[#0E4E96] border-gray-300 hover:bg-gray-100"
      }`}
    >
      Previous
    </button>

    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={i}
        onClick={() => setPageIndex(i)}
        disabled={i === pageIndex}
        className={`px-3 py-1 rounded-full border text-sm transition ${
          i === pageIndex
            ? "bg-[#0E4E96] text-white border-[#0E4E96] cursor-default"
            : "bg-white text-[#0E4E96] border-gray-300 hover:bg-gray-100"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
      disabled={pageIndex === totalPages - 1}
      className={`px-3 py-1 rounded-full border text-sm transition ${
        pageIndex === totalPages - 1
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white text-[#0E4E96] border-gray-300 hover:bg-gray-100"
      }`}
    >
      Next
    </button>
  </div>
)}

                </div>
            </div>
        </MainLayout>
    );
}

export default withAuth(TripsPage);
