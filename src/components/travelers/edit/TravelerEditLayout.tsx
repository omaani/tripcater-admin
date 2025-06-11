"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TravelerInfoForm } from "./tabs/TravelerInfoForm";
import { TravelerDocumentsForm } from "./tabs/TravelerDocumentsForm";
import { TravelerPasswordForm } from "./tabs/TravelerPasswordForm";
import { Button } from "@/components/ui/button";
import { User, FileBadge, KeyRound } from "lucide-react";
import Link from "next/link";

export function TravelerEditLayout() {
  return (
    <div className="min-h-screen bg-muted px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-semibold">
            Edit Traveler Info <span className="font-bold text-gray-700">– John Doe</span>
          </h1>
          <Link href="/travelers" className="text-sm text-muted-foreground hover:underline">
            ← Back to List
          </Link>
        </div>

        {/* Tabs and Content */}
        <div className="bg-white rounded-xl border px-6 py-6">
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
              <TravelerInfoForm />
            </TabsContent>
            <TabsContent value="documents">
              <TravelerDocumentsForm />
            </TabsContent>
            <TabsContent value="password">
              <TravelerPasswordForm />
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline">Deactivate</Button>
          <Button variant="destructive">Delete</Button>
          <Button>Save</Button>
        </div>
      </div>
    </div>
  );
}
