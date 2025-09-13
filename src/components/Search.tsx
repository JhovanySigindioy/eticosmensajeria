// src/components/PatientSearch.tsx
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface GenericSearchProps {
    label: string;
    placeholder: string;
    onSearch: (value: string) => void;
    onReset: () => void;
    isLoading: boolean;
    errorMessage: string | null;
    initialSearchValue?: string;
}

export function GenericSearch({
    label,
    placeholder,
    onSearch,
    onReset,
    isLoading,
    errorMessage,
    initialSearchValue = "",
}: GenericSearchProps) {
    const [searchValue, setSearchValue] = useState(initialSearchValue);

    const handleInternalSearch = () => {
        if (searchValue.trim()) {
            onSearch(searchValue);
        }
    };

    const handleInternalReset = () => {
        setSearchValue("");
        onReset();
    };

    return (
        <div className="space-y-1">
            <Label htmlFor="search" className="font-semibold text-[#0A1C41]">
                {label}
            </Label>
            <div className="flex gap-2">
                <Input
                    id="search"
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value.trim())}
                    className="focus:border-[#0082FF] focus:ring-[#0082FF]"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleInternalSearch();
                        }
                    }}
                />
                <Button
                    type="button"
                    onClick={handleInternalSearch}
                    size="icon"
                    className="bg-[#0082FF] hover:bg-[#005cbf]"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleInternalReset}
                    size="icon"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
            {errorMessage && (
                <p className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-md p-2 mt-2">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}