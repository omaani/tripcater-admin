import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react";

interface CorporatePriceSettingsTableProps {
  priceSettings: any[]; // or define a specific type
}

export const CorporatePriceSettingsTable = ({ priceSettings }: CorporatePriceSettingsTableProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-[#1F2A44] mb-4">Price markup settings</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-2">Airline</th>
              <th className="p-2">Cabin Class</th>
              <th className="p-2">Price From</th>
              <th className="p-2">Price To</th>
              <th className="p-2">Commission Amount</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {priceSettings.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No price settings found.
                </td>
              </tr>
            ) : (
              priceSettings.map((ap) => (
                <tr key={ap.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{ap.airline}</td>
                  <td className="p-2">{ap.cabinClass == 'Y' ? 'Economy' : 'Business'}</td>
                  <td className="p-2">{ap.priceFrom}</td>
                  <td className="p-2">{ap.priceTo}</td>
                  <td className="p-2">{ap.commissionAmount}</td>
                  <td className="p-2">
                    {/* <button className="text-blue-600 hover:underline text-sm">Edit</button> */}
                    <Link href={`/approval-processes/${ap.id}/edit`}>
                        <Button variant="secondary" size="sm" className="flex items-center gap-1">
                          <Trash className="w-4 h-4" />
                          Delete
                        </Button>
                      </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
