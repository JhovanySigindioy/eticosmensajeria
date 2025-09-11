import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Address } from "@/interfaces/address";

interface Props {
  value: Address;
  onChange: (address: Address) => void;
}

export default function AddressForm({ value, onChange }: Props) {
  const updateField = (field: keyof Address, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="border p-2 rounded-md shadow-sm mt-1 space-y-3">
      <label className="font-medium">Nueva Dirección</label>

      {/* Línea principal de la vía */}
      <div className="grid grid-cols-7 gap-2 items-end">
        {/* Tipo vía */}
        <div className="col-span-2">
          <label className="text-xs font-medium">Tipo de Vía*</label>
          <Select
            value={value.tipoVia}
            onValueChange={(val) => updateField("tipoVia", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Calle">Calle</SelectItem>
              <SelectItem value="Carrera">Carrera</SelectItem>
              <SelectItem value="Avenida">Avenida</SelectItem>
              <SelectItem value="Diagonal">Diagonal</SelectItem>
              <SelectItem value="Transversal">Transversal</SelectItem>
              <SelectItem value="Circular">Circular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Número principal */}
        <div>
          <label className="text-xs font-medium">Número*</label>
          <Input
            placeholder="Ej: 32A"
            value={value.numeroPrincipal}
            onChange={(e) => updateField("numeroPrincipal", e.target.value)}
          />
        </div>

        {/* Separador # */}
        <div className="flex items-center justify-center text-lg font-bold text-gray-600">
          #
        </div>

        {/* Número secundario */}
        <div>
          <label className="text-xs font-medium">Número*</label>
          <Input
            placeholder="Ej: 10"
            value={value.numeroSecundario}
            onChange={(e) => updateField("numeroSecundario", e.target.value)}
          />
        </div>

        {/* Separador - */}
        <div className="flex items-center justify-center text-lg font-bold text-gray-600">
          -
        </div>

        {/* Número final */}
        <div>
          <label className="text-xs font-medium">Número*</label>
          <Input
            placeholder="Ej: 25"
            value={value.numeroFinal}
            onChange={(e) => updateField("numeroFinal", e.target.value)}
          />
        </div>
      </div>

      {/* Barrio y detalles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div>
          <label className="text-xs font-medium">Barrio*</label>
          <Input
            placeholder="Ej: Chapinero"
            value={value.barrio}
            onChange={(e) => updateField("barrio", e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium">Detalles</label>
          <Input
            placeholder="Ej: Apto 302, Interior 5"
            value={value.detallesAdicionales ?? ""}
            onChange={(e) => updateField("detallesAdicionales", e.target.value)}
          />
        </div>
      </div>

      {/* Municipio y departamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Departamento*</label>
          <Input
            placeholder="Ej: Cundinamarca"
            value={value.departamento}
            onChange={(e) => updateField("departamento", e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium">Municipio*</label>
          <Input
            placeholder="Ej: Bogotá"
            value={value.municipio}
            onChange={(e) => updateField("municipio", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
