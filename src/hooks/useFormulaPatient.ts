// src/hooks/useFormulaPatient.ts
import { getDataFormulaPatient } from "@/api/eticos/formula.service";
import { useQuery } from "@tanstack/react-query";

export const useFormulaPatient = (
  valor: string,
  bodega: string,
  token: string
) => {
  const dataFormulaPatientQuery = useQuery({
    queryKey: ["ServiceFormulaPatient", valor, bodega, token],
    queryFn: () => getDataFormulaPatient(valor, bodega, token),
    enabled: !!valor && !!bodega && !!token,
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });

  return {
    ...dataFormulaPatientQuery,
  };
};
