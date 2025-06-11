import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react";

interface CorporateApprovalProcessTableProps {
  approvalProcesses: any[]; // or define a specific type
}

export const CorporateApprovalsTable = ({ approvalProcesses }: CorporateApprovalProcessTableProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-[#1F2A44] mb-4">Approval Processes</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Approval Needed</th>
              <th className="p-2">Is Default</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvalProcesses.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No trips found.
                </td>
              </tr>
            ) : (
              approvalProcesses.map((ap) => (
                <tr key={ap.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{ap.name}</td>
                  <td className="p-2">{ap.approvalNeeded == true ? 'Yes' : 'No'}</td>
                  <td className="p-2">{ap.isDefault == true ? 'Yes' : 'No'}</td>
                  <td className="p-2">
                    {/* <button className="text-blue-600 hover:underline text-sm">Edit</button> */}
                    <Link href={`/approval-processes/${ap.id}/edit`}>
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
