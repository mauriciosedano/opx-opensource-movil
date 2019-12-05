import { Tarea } from './tarea';

export interface Proyecto {
    proyid?: string;
    proynombre?: string;
    proydescripcion?: string;
    proyectista?: string;
    proyfechacreacion?: Date;
    proyfechacierre?: string;
    proyfechainicio?: string;
    proyidexterno?: string;
    proyestado?: number;
    tareas?: Tarea[];
}

export interface ProyectoBackend {
    model: string;
    proyecto: {
        pk: string;
        fields: Proyecto;
    };
    tareas: [{
        pk: string;
        fields: Tarea
    }];
}
