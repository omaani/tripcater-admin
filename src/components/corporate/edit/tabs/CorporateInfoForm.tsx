import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import api from "@/services/api";

interface CorporateInfoFormProps {
    basicInfo: any;
}

export const CorporateInfoForm = ({ basicInfo }: CorporateInfoFormProps) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<{
        name: string;
        creditLimit: string;
        availableBalance: string;
        createdDate: string;
        status: boolean;
    }>({
        name: "",
        creditLimit: "",
        availableBalance: "",
        createdDate: "",
        status: true,
    });


    useEffect(() => {
        if (basicInfo) {
            setForm({
                name: basicInfo.name || "",
                creditLimit: basicInfo.creditLimit?.toString() || "",
                availableBalance: basicInfo.availableBalance?.toString() || "",
                createdDate: basicInfo.createdDate?.split("T")[0] || "",
                status: basicInfo.status === "A", // true if status is "A"
            });
        }
    }, [basicInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            ...(name === "creditLimit" ? { availableBalance: value } : {}),
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!form.name || !form.creditLimit) {
                toast.error("Please fill all required fields.");
                return;
            }

            await api.put(`/corporate/edit/${basicInfo.id}`, {
                name: form.name,
                creditLimit: parseFloat(form.creditLimit),
                availableBalance: parseFloat(form.availableBalance),
                status: form.status ? "A" : "I",
            });

            toast.success("Corporate info updated successfully");
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-4 text-[15px]">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input name="name" value={form.name} onChange={handleChange} className="mt-1" />
            </div>
            <div>
                <Label htmlFor="creditLimit">Credit Limit</Label>
                <Input name="creditLimit" value={form.creditLimit} onChange={handleChange} className="mt-1" />
            </div>
            <div>
                <Label htmlFor="availableBalance">Available Balance</Label>
                <Input name="availableBalance" value={form.availableBalance} readOnly disabled className="mt-1 bg-gray-100" />
            </div>
            <div>
                <Label htmlFor="createdDate">Created Date</Label>
                <Input name="createdDate" value={form.createdDate} readOnly disabled className="mt-1 bg-gray-100" />
            </div>
            <div className="flex items-center gap-2">
                <input
                    id="status"
                    type="checkbox"
                    name="status"
                    checked={form.status}
                    onChange={handleChange}
                    className="w-4 h-4 border-gray-300"
                />
                <Label htmlFor="status" className="cursor-pointer">Active</Label>
            </div>
            <div className="pt-2">
                <Button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-[#0E4E96] text-white rounded-md hover:bg-[#0c3d75] text-sm"
                    disabled={loading}
                >
                    Save Changes
                </Button>
            </div>
        </form>
    );
};
