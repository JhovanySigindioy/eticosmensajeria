import type { Address } from "@/interfaces/address";

export function formatAddress(address: Address): string {
  const via = [
    address.tipoVia,
    address.numeroPrincipal,
    address.numeroSecundario ? `# ${address.numeroSecundario}` : "",
    address.numeroFinal ? `- ${address.numeroFinal}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Concatenar con el resto
  return [
    via,
    address.barrio,
    address.detallesAdicionales,
    address.municipio,
    address.departamento,
  ]
    .filter(Boolean)
    .join(", ");
}
