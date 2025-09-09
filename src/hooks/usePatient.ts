// src/hooks/usePatient.ts
import { useMutation } from "@tanstack/react-query";
import type { ApiResponse } from "@/interfaces/apiResponse";
import type { PatientRequest } from "@/interfaces/patient";
import { updateDataPatient } from "@/api/patient.service";

export const usePatient = (token: string) => {
    const updatePatientMutation = useMutation<
        ApiResponse<null>,
        Error,
        Partial<PatientRequest>
    >({
        mutationFn: (dataPatient: Partial<PatientRequest>) =>
            updateDataPatient(dataPatient, token),
    });

    return {
        ...updatePatientMutation,
    };
};
