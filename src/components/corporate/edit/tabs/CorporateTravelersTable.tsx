import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react";

interface CorporateTravelersTableProps {
  travelers: any[]; // or define a specific type
}

export const CorporateTravelersTable = ({ travelers }: CorporateTravelersTableProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-[#1F2A44] mb-4">Travelers</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {travelers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No travelers found.
                </td>
              </tr>
            ) : (
              travelers.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{t.firstName} {t.lastName}</td>
                  <td className="p-2">{t.email}</td>
                  <td className="p-2">{t.phoneNumber}</td>
                  <td className="p-2">{t.roleName}</td>
                  <td className="p-2">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${t.status === 'A' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {t.status === 'A' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2">{t.createdDate?.split("T")[0]}</td>
                  <td className="p-2">
                    {/* <button className="text-blue-600 hover:underline text-sm">Edit</button> */}
                    <Link href={`/travelers/${t.id}/edit`}>
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
