"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TravelerInfoForm } from "./tabs/TravelerInfoForm";
import { TravelerDocumentsForm } from "./tabs/TravelerDocumentsForm";
import { TravelerPasswordForm } from "./tabs/TravelerPasswordForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { User, FileBadge, KeyRound } from "lucide-react";
import Link from "next/link";
import api from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";

export function TravelerEditLayout() {
  const params = useParams();
  const router = useRouter();
  const travelerId = params?.id;
  const [traveler, setTraveler] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);

  useEffect(() => {
    if (!travelerId) return;

    const fetchTraveler = async () => {
      try {
        const res = await api.get(`/traveler/${travelerId}`);
        setTraveler(res.data?.data);
      } catch (error) {
        console.error("Failed to load traveler:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTraveler();
  }, [travelerId]);

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await api.delete(`/traveler/${travelerId}`);
      toast.success("Traveler deleted successfully.");
      router.push("/travelers");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete traveler.");
    } finally {
      setActionLoading(false);
      setOpenDelete(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setActionLoading(true);
      await api.patch(`/traveler/${travelerId}`, { status: "I" });
      toast.success("Traveler deactivated.");
      router.push("/travelers");
    } catch (err) {
      console.error(err);
      toast.error("Failed to deactivate traveler.");
    } finally {
      setActionLoading(false);
      setOpenDeactivate(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-semibold">
            Edit Traveler Info{" "}
            <span className="font-bold text-gray-700">
              – {traveler ? `${traveler.firstName} ${traveler.lastName}` : "Loading..."}
            </span>
          </h1>
          <Link href="/travelers" className="text-sm text-muted-foreground hover:underline">
            ← Back to List
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border px-6 py-6">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="info" className="flex items-center gap-2">
                  <User size={16} />
                  Info
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileBadge size={16} />
                  Travel Documents
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center gap-2">
                  <KeyRound size={16} />
                  Change Password
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <TravelerInfoForm data={traveler} />
              </TabsContent>
              <TabsContent value="documents">
                <TravelerDocumentsForm
                  passportId={traveler.passportId}
                  initialPassportNumber={traveler.passportNumber}
                  initialIssuingCountry={traveler.passportIssuingCountry}
                  initialExpiryDate={traveler.passportExpiryDate?.split("T")[0] || ""}
                />
              </TabsContent>
              <TabsContent value="password">
                <TravelerPasswordForm />
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Action Buttons */}
        {!loading && (
          <div className="flex justify-end gap-2">
            <Dialog open={openDeactivate} onOpenChange={setOpenDeactivate}>
              <DialogTrigger asChild>
                <Button variant="outline">Deactivate</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Deactivate Traveler</DialogTitle>
                <p>Are you sure you want to deactivate this traveler?</p>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenDeactivate(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeactivate} disabled={actionLoading}>
                    {actionLoading ? "Processing..." : "Confirm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Delete Traveler</DialogTitle>
                <p>This action is permanent and cannot be undone. Are you sure?</p>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenDelete(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
                    {actionLoading ? "Processing..." : "Confirm Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
