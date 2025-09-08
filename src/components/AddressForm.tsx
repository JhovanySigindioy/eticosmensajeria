// src/components/AddressForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// 1. Definir el esquema de validación con Zod
const formSchema = z.object({
    tipoVia: z.string().min(1, { message: "Selecciona un tipo de vía." }),
    numeroVia: z.string().min(1, { message: "El número de vía es obligatorio." }),
    complementoVia: z.string().min(1, { message: "El complemento de vía es obligatorio." }),
    barrio: z.string().min(1, { message: "El barrio es obligatorio." }),
    detallesAdicionales: z.string().optional(),
    municipio: z.string().min(1, { message: "El municipio es obligatorio." }),
    departamento: z.string().min(1, { message: "El departamento es obligatorio." }),
});

export default function AddressForm() {
    // 2. Inicializar el formulario con React Hook Form y Zod
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipoVia: "",
            numeroVia: "",
            complementoVia: "",
            barrio: "",
            detallesAdicionales: "",
            municipio: "",
            departamento: "",
        },
    });

    // Función para manejar el envío del formulario
    const onSubmit = (values: any) => {
        console.log("📌 Datos del formulario:", values);
        // Aquí puedes enviar los datos a tu API o manejar la lógica de tu aplicación
    };

    return (
        <Form {...form}>
            <label htmlFor="telefono" className="text-sm font-medium">
                Nueva Dirección
            </label>
            <form onSubmit={form.handleSubmit(onSubmit)} className="border p-2 rounded-md shadow-sm -mt-1">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    {/* Tipo de vía */}
                    <FormField
                        control={form.control}
                        name="tipoVia"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Vía*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Calle">Calle</SelectItem>
                                        <SelectItem value="Carrera">Carrera</SelectItem>
                                        <SelectItem value="Avenida">Avenida</SelectItem>
                                        <SelectItem value="Diagonal">Diagonal</SelectItem>
                                        <SelectItem value="Transversal">Transversal</SelectItem>
                                        <SelectItem value="Circular">Circular</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Número vía */}
                    <FormField
                        control={form.control}
                        name="numeroVia"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Ej: 12" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Complemento vía */}
                    <FormField
                        control={form.control}
                        name="complementoVia"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Número</FormLabel>
                                <FormControl>
                                    <div className="flex items-center space-x-2">
                                        <Input placeholder="Ej: 34" {...field} className="w-1/2" />
                                        <span className="text-2xl text-gray-500">-</span>
                                        <Input placeholder="Ej: 56" className="w-1/2" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Barrio y Detalles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="barrio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Barrio</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Chapinero" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="detallesAdicionales"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Detalles Adicionales</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Apto 302, Interior 5" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {/* Municipio y Departamento */}
                    <FormField
                        control={form.control}
                        name="departamento"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Departamento</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Cundinamarca" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="municipio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Municipio</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Bogotá" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                </div>
            </form>
        </Form>
    );
}
