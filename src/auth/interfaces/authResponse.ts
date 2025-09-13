// Define la interfaz para una respuesta exitosa
export interface AuthSuccessResponse {
  iduser: number;
  main: string[];
  message: string;
  modality: string;
  name: string;
  nit: string;
  program: number;
  tokenjwt: string;
}
