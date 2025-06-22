// ViewTripPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Info,
  PlaneTakeoff,
  ListOrdered,
  Users,
  RefreshCcw,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ViewTripPage() {
  const params = useParams();
  const tripId = params?.id;

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchTripDetails = async () => {
    try {
      const res = await api.get(`/trip/${tripId}`);
      if (res.data.success) {
        setTrip(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch trip details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await api.post(`/trip/${tripId}/status`, { status: newStatus });
      if (res.data.success) {
        await fetchTripDetails();
        toast.success("Trip status updated successfully");
      }
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update trip status");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (tripId) fetchTripDetails();
  }, [tripId]);

  if (loading) return <MainLayout><div className="p-6">Loading...</div></MainLayout>;
  if (!trip) return <MainLayout><div className="p-6">Trip not found.</div></MainLayout>;

  const booking = trip.bookingItems?.[0];
  const itin = booking?.flightItinGroup?.itinerary?.originDestinationOptions?.originDestinationOption || [];
  const brandedFares = booking?.flightItinGroup?.fareInfo || [];
  const currency = booking?.currency || "JOD";

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1F2A44]">Trip #{trip.customId}</h1>
          <Link href="/trips" className="text-sm text-blue-600 hover:underline">← Back to List</Link>
        </div>

        <div className="bg-white p-4 border rounded-lg">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview"><Info className="mr-1 w-4 h-4" />Overview</TabsTrigger>
              <TabsTrigger value="booking"><ListOrdered className="mr-1 w-4 h-4" />Booking Items</TabsTrigger>
              <TabsTrigger value="flight"><PlaneTakeoff className="mr-1 w-4 h-4" />Flight Details</TabsTrigger>
              <TabsTrigger value="travelers"><Users className="mr-1 w-4 h-4" />Travelers</TabsTrigger>
              <TabsTrigger value="status"><RefreshCcw className="mr-1 w-4 h-4" />Update Status</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-2">
                <p><strong>Status:</strong> <Badge>{trip.status}</Badge></p>
                <p><strong>Service Type:</strong> {trip.serviceType}</p>
                <p><strong>Flight Type:</strong> {trip.flightType}</p>
                <p><strong>Cabin Class:</strong> {booking?.flightCabinClass}</p>
                <p><strong>Number of Travelers:</strong> {booking?.numberOfTravelers}</p>
                <p><strong>Sabre PNR Code:</strong> {booking?.sabrE_PNRCode}</p>
                <p><strong>Status Date:</strong> {trip.statusDate}</p>
                <p><strong>Created By IP:</strong> {trip.userIp}</p>
              </div>
            </TabsContent>

            <TabsContent value="booking">
              <div className="space-y-2">
                <p><strong>From:</strong> {booking?.flightFrom}</p>
                <p><strong>To:</strong> {booking?.flightTo}</p>
                <p><strong>Departure:</strong> {booking?.flightDepartureDate}</p>
                <p><strong>Return:</strong> {booking?.flightReturnDate}</p>
                <hr />
                <p><strong>Base Fare / Passenger:</strong> {booking?.passengerBaseFareAmount} {currency}</p>
                <p><strong>Total Tax / Passenger:</strong> {booking?.passengerTotalTaxAmount} {currency}</p>
                <p><strong>Total Amount / Passenger:</strong> {booking?.passengerTotalAmount} {currency}</p>
                <p><strong>Markup:</strong> {booking?.markupValue} {currency}</p>
                <p><strong>Total Price:</strong> {booking?.totalPrice} {currency}</p>
              </div>
            </TabsContent>

            <TabsContent value="flight">
              <div className="space-y-6">
                {itin.map((option: any, idx: number) => (
                  <div key={idx} className="border p-4 rounded-md">
                    <p className="font-semibold">Total Flight Time: {option.totalFlightTimeText}</p>
                    <p className="text-sm text-gray-500">Departure & Return for Segment {idx + 1}</p>
                    {option.flightSegments.map((seg: any, i: number) => (
                      <div key={i} className="border-t pt-2 mt-2">
                        <p><strong>{seg.carrier.marketingAirline.name}</strong> ({seg.flightCode}{seg.flightNumber})</p>
                        <p>From: {seg.origin.city} ({seg.origin.locationCode}) at {seg.origin.time}</p>
                        <p>To: {seg.destination.city} ({seg.destination.locationCode}) at {seg.destination.time}</p>
                        <p>Duration: {seg.duration}</p>
                      </div>
                    ))}
                  </div>
                ))}

                {brandedFares.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Branded Fare Info</h3>
                    <div className="grid gap-4">
                      {brandedFares.map((fare: any, i: number) => (
                        <div key={i} className="border p-3 rounded-md">
                          <p><strong>Fare Basis:</strong> {fare.fareBasisCode}</p>
                          <p><strong>Fare Amount:</strong> {fare.fareAmount} {fare.fareCurrency}</p>
                          <p><strong>Total Fare:</strong> {fare.totalFareAmount}</p>
                          <p><strong>Booking Code:</strong> {fare.segment?.bookingCode}</p>
                          <p><strong>Seats Available:</strong> {fare.segment?.seatsAvailable}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="travelers">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Travelers</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2 font-medium">Name</th>
                        <th className="px-4 py-2 font-medium">Email</th>
                        <th className="px-4 py-2 font-medium">Passport Number</th>
                        <th className="px-4 py-2 font-medium">Issuing Country</th>
                        <th className="px-4 py-2 font-medium">Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking?.travelers?.map((traveler: any, idx: number) => {
                        const isExpired = traveler.passportExpiryDate && new Date(traveler.passportExpiryDate) < new Date();
                        return (
                          <tr key={idx} className="border-t">
                            <td className="px-4 py-2">{traveler.firstName} {traveler.lastName}</td>
                            <td className="px-4 py-2">{traveler.email}</td>
                            <td className="px-4 py-2">{traveler.passportNumber}</td>
                            <td className="px-4 py-2">{traveler.passportIssuingCountry}</td>
                            <td className="px-4 py-2">
                              {traveler.passportExpiryDate} {isExpired && <span className="text-red-500 font-semibold ml-1">(Expired)</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="status">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Update Status</h2>
                <div className="flex flex-wrap gap-2">
                  {booking?.tripStatuses?.map((s: any) => (
                    <Button
                      key={s.value}
                      onClick={() => handleStatusUpdate(s.value)}
                      disabled={updating || trip.status === s.value || s.disabled}
                    >
                      {s.text}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
