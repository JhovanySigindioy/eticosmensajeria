// src/utils/formatAddress.ts
import type { Address } from "@/interfaces/address";

export function formatAddress(address: Address): string {
    const direccionPrincipal = [address.tipoVia, address.numeroVia, address.complementoVia]
        .filter(Boolean)
        .join(" ")
        .trim();

    const barrio = address.barrio ? `Barrio ${address.barrio}` : null;
    const detalles = address.detallesAdicionales?.trim() || null;
    const ciudadYDepto = [address.municipio, address.departamento].filter(Boolean).join(", ");

    return [direccionPrincipal, barrio, detalles, ciudadYDepto]
        .filter(Boolean)
        .join(", ");
}
