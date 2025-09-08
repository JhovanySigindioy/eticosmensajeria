// src/auth/hooks/useContractQuery.ts
import { useQuery } from "@tanstack/react-query";
import { getContractService } from "@/api/eticos/contract.service";
import type { ContractData } from "../interfaces/contractResponse";

interface ContractQueryParams {
    nit: string;
    userId: number;
    token: string;
}

export const useContractQuery = ({ nit, userId, token }: ContractQueryParams) => {
    const dataContractQuery = useQuery<ContractData, Error>({
        queryKey: ["contract", nit, userId],
        queryFn: () => getContractService(nit, userId, token),
        enabled: !!nit && !!userId && !!token,
        staleTime: 1000 * 60 * 60, // 1 hora
        retry: 1,
    });

    return {
        ...dataContractQuery,
    };
};