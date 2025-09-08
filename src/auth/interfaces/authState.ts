import type { AuthSuccessResponse } from "./authResponse";
import type { ContractData } from "./contractResponse";

export interface AuthState {
  user: AuthSuccessResponse | null;
  token: string | null;
  contractData: ContractData | null;
  login: (data: AuthSuccessResponse, contract: ContractData) => void;
  logout: () => void;
}