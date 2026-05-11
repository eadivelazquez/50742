import LenguajeVisitor from './src/parser/LenguajeVisitor.js';

// Clase que recorre el árbol sintáctico y ejecuta las acciones.
// Hereda de LenguajeVisitor para poder sobreescribir los métodos de las etiquetas (#).

export default class CustomVisitor extends LenguajeVisitor {

    // Se ejecuta cuando el árbol llega a la etiqueta #salidaImprimir
    visitSalidaImprimir(ctx) {
        // Obtenemos el texto del token CADENA
        const cadenaConComillas = ctx.CADENA().getText();
        
        // Le quitamos las comillas 
        const texto = cadenaConComillas.substring(1, cadenaConComillas.length - 1);
        
        console.log(`>>> [CONSOLA]: ${texto}`);
        return this.visitChildren(ctx);
    }

    // Se ejecuta cuando el árbol llega a la etiqueta #instSalir
    visitInstSalir(ctx) {
        console.log(">>> [SISTEMA]: Se detectó instrucción de salida. Finalizando ejecución...");
        return null; // Detenemos el recorrido en esta rama
    }

    // Se ejecuta en la regla de repetición #repLoop
    visitRepLoop(ctx) {
        // En un intérprete real, aquí iría la lógica del bucle 'while'
        // Por ahora, simplemente procesamos las sentencias internas una vez
        return this.visitChildren(ctx);
    }

    // Método obligatorio para que el Visitor sepa cómo seguir bajando por el árbol
    visitChildren(ctx) {
        if (!ctx) return null;
        if (ctx.children) {
            return ctx.children.map(child => {
                if (child.accept) {
                    return child.accept(this);
                }
                return null;
            });
        }
        return null;
    }
}