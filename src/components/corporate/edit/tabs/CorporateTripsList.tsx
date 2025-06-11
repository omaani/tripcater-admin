import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react";

interface CorporateTripsTableProps {
  trips: any[]; // or define a specific type
}

 const statusStyles: Record<string, string> = {
    Rejected: "bg-red-100 text-red-700",
    "Pending Issuance": "bg-yellow-100 text-yellow-700",
    Canceled: "bg-gray-100 text-gray-700",
    OnHold: "bg-blue-100 text-blue-700",
    Issued: "bg-green-100 text-green-700"
  }

export const CorporateTripsTable = ({ trips }: CorporateTripsTableProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-[#1F2A44] mb-4">Trips / Bookings</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-2">Trip Id</th>
              <th className="p-2">Status</th>
              <th className="p-2">Order Total</th>
              <th className="p-2">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No trips found.
                </td>
              </tr>
            ) : (
              trips.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{t.customId}</td>
                   <td className="p-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${statusStyles[t.status] || 'bg-gray-100 text-gray-500'}`}>
                        {t.status || 'N/A'}
                    </span>
                  </td>
                  <td className="p-2">{t.orderTotal}</td>
                  <td className="p-2">{t.createdDate?.split("T")[0]}</td>
                  <td className="p-2">
                    {/* <button className="text-blue-600 hover:underline text-sm">Edit</button> */}
                    <Link href={`/trips/${t.id}/edit`}>
                        <Button variant="secondary" size="sm" className="flex items-center gap-1">
                          <Pencil className="w-4 h-4" />
                          Edit
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
