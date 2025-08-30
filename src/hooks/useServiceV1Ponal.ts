import { getDataPatient } from '@/api/services/eticos/getDataPatient';
import { useQuery } from '@tanstack/react-query';

export const useServiceV1Ponal = (numRadicado: string, servicio: string = "dispensacion") => {
  const dataPatientQuery = useQuery({
    queryKey: ['ServiceV1Ponal', numRadicado, servicio],
    queryFn: () =>
      getDataPatient({
        Datos: { numRadicado },
        Servicio: servicio,
      }),
    enabled: !!numRadicado, // ✅ evita ejecutar si no hay radicado
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  return {
    dataPatientQuery,
  };
};
