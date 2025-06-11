"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TravelerDocumentsForm() {
  const [passportNumber, setPassportNumber] = useState("P12345678");
  const [issuingCountry, setIssuingCountry] = useState("JO");
  const [expiryDate, setExpiryDate] = useState("2026-12-31");

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="passportNumber">Passport Number</Label>
        <Input id="passportNumber" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="issuingCountry">Issuing Country</Label>
        <Select value={issuingCountry} onValueChange={setIssuingCountry}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="JO">Jordan</SelectItem>
            <SelectItem value="SA">Saudi Arabia</SelectItem>
            <SelectItem value="US">United States</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="expiryDate">Passport Expiry Date</Label>
        <Input id="expiryDate" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
      </div>
    </div>
  );
}
