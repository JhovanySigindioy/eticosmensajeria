// src/hooks/useFormulaPatient.ts
import { getDataFormulaPatient } from "@/api/eticos/formula.service";
import { useQuery } from "@tanstack/react-query";

export const useFormulaPatient = (
  registeredTypeNumber: string,
  dispensaryCode: string,
  token: string
) => {
  const dataFormulaPatientQuery = useQuery({
    queryKey: ["ServiceFormulaPatient", registeredTypeNumber, dispensaryCode, token],
    queryFn: () => getDataFormulaPatient(registeredTypeNumber, dispensaryCode, token),
    enabled: false,
    retry: false,
    staleTime: 1000 * 60 * 60,
  });

  return {
    ...dataFormulaPatientQuery,
  };
};
