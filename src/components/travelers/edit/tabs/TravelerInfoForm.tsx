"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

type RoleOption = {
  text: string;
  value: string;
  disabled: boolean;
};

type TravelerInfoProps = {
  data: {
    id: number;
    title?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    dateOfBirth: string,
    gender: string,
    phoneNumber: string;
    roleId: number;
    roles: RoleOption[];
    emailVerified: boolean;
    status: string;
    lastLoginDateUtc: string | null;
    lastActivityDateUtc: string | null;
    createdDate: string;
  };
};

export function TravelerInfoForm({ data }: TravelerInfoProps) {
  const params = useParams();
  const travelerId = params?.id;
  const [firstName, setFirstName] = useState(data.firstName || "");
  const [lastName, setLastName] = useState(data.lastName || "");
  const [email, setEmail] = useState(data.email || "");
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || "");
  const [roleId, setRoleId] = useState(data.roleId.toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        id: data.id,
        firstName,
        lastName,
        email,
        phoneNumber,
        roleId: Number(roleId),
      };

      await api.put(`/traveler/${travelerId}`, payload);

      toast.success("Traveler info saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save traveler info.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setFirstName(data.firstName || "");
    setLastName(data.lastName || "");
    setEmail(data.email || "");
    setPhoneNumber(data.phoneNumber || "");
    setRoleId(data.roleId.toString());
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={roleId} onValueChange={setRoleId}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {data.roles.map((role) => (
              <SelectItem key={role.value} value={role.value} disabled={role.disabled}>
                {role.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Account Info */}
      <div className="mt-6 border-t pt-4 text-sm text-muted-foreground space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Gender:</span>
          <span className="text-gray-800">{data.gender === "M" ? "Male" : data.gender === "M"? "Femail" : "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Birth date:</span>
          <span className="text-gray-800">{data.dateOfBirth}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Email Verified:</span>
          <span className={data.emailVerified ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
            {data.emailVerified ? "Yes" : "No"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Status:</span>
          <span className="text-gray-800">{data.status === "A" ? "Active" : "Inactive"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Last Login:</span>
          <span>{data.lastLoginDateUtc ? new Date(data.lastLoginDateUtc).toLocaleString() : "Never"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Last Activity:</span>
          <span>{data.lastActivityDateUtc ? new Date(data.lastActivityDateUtc).toLocaleString() : "N/A"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Created Date:</span>
          <span>{new Date(data.createdDate).toLocaleString()}</span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
