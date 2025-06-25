"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
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

interface TravelerDocumentsFormProps {
  passportId: number;
  initialPassportNumber: string;
  initialIssuingCountry: string;
  initialExpiryDate: string; // format: YYYY-MM-DD
}

interface Country {
  name: string;
  twoLetterIsoCode: string;
  threeLetterIsoCode: string;
  numericIsoCode: number;
  id: number;
}

export function TravelerDocumentsForm({
  passportId,
  initialPassportNumber,
  initialIssuingCountry,
  initialExpiryDate,
}: TravelerDocumentsFormProps) {
  const [passportNumber, setPassportNumber] = useState(initialPassportNumber || "");
  const [issuingCountry, setIssuingCountry] = useState(initialIssuingCountry || "JO");
  const [expiryDate, setExpiryDate] = useState(initialExpiryDate || "");
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchCountries = async () => {
        try {
          const response = await api.get("/directory/countries");
          if (response.data.success) {
            setCountries(response.data.data);
          } else {
            toast.error("Failed to load countries.");
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            toast.error("Unauthorized. Please re-authenticate.");
          } else {
            toast.error("Error loading country list.");
          }
          console.error("Country fetch failed:", error);
        } finally {
          setLoadingCountries(false);
        }
      };

      fetchCountries();
    }, 300); // delay to allow token setup

    return () => clearTimeout(timer);
  }, []);


  const handleSave = async () => {
    if (!passportId) {
      toast.error("Missing passport ID.");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/traveler/document-update/${passportId}`, {
        documentNumber: passportNumber,
        documentExpiryDate: expiryDate,
        issuingCountryCode: issuingCountry,
      });

      toast.success("Passport details updated successfully.");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update passport details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="passportNumber">Passport Number</Label>
        <Input
          id="passportNumber"
          value={passportNumber}
          onChange={(e) => setPassportNumber(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="issuingCountry">Issuing Country</Label>
        <Select
          value={loadingCountries ? "loading" : issuingCountry}
          onValueChange={(val) => {
            if (val !== "loading") setIssuingCountry(val);
          }}
          disabled={loadingCountries && countries.length === 0}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={loadingCountries ? "Loading countries..." : "Select country"}
            />
          </SelectTrigger>

          <SelectContent>
            {loadingCountries ? (
              <SelectItem
                value="loading"
                disabled
                className="flex items-center gap-2 opacity-70"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
              </SelectItem>
            ) : (
              countries.map((country) => (
                <SelectItem key={country.id} value={country.twoLetterIsoCode}>
                  {country.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

      </div>

      <div>
        <Label htmlFor="expiryDate">Passport Expiry Date</Label>
        <Input
          id="expiryDate"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
