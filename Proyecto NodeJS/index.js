import antlr4 from 'antlr4';
import fs from 'fs';
import LenguajeLexer from './src/parser/LenguajeLexer.js';
import LenguajeParser from './src/parser/LenguajeParser.js';
import CustomVisitor from './CustomVisitor.js';

async function main() {
    console.log("Iniciando el Analizador Sintáctico...");
    
    const fileName = 'input.txt';

    try {
        if (!fs.existsSync(fileName)) {
            throw new Error(`No se encontró el archivo '${fileName}'.`);
        }

        const input = fs.readFileSync(fileName, 'utf8');
        
        if (input.trim().length === 0) {
            console.warn("El archivo input.txt está vacío.");
            return;
        }

        const inputStream = antlr4.CharStreams.fromString(input);
        const lexer = new LenguajeLexer(inputStream);
        const tokenStream = new antlr4.CommonTokenStream(lexer);

        console.log("\n=== TABLA DE LEXEMAS Y TOKENS ===");
        console.log("Lexema".padEnd(20) + " | " + "Token");
        console.log("-".repeat(40));
        
        tokenStream.fill();
        tokenStream.tokens.forEach(t => {
            if (t.type !== -1) {
                // Intentamos obtener el nombre de varias formas para evitar el error de 'undefined'
                const name = lexer.vocabulary?.getSymbolicName(t.type) 
                             || LenguajeLexer.vocabulary?.getSymbolicName(t.type)
                             || lexer.symbolicNames?.[t.type]
                             || "TOKEN_" + t.type;

                console.log(`${t.text.padEnd(20)} | ${name}`);
            }
        });
        //El analisis sintactico
        const parser = new LenguajeParser(tokenStream);
        const tree = parser.programa();

        if (parser.syntaxErrorsCount > 0) {
            console.error(`\n❌ Se encontraron ${parser.syntaxErrorsCount} errores de sintaxis.`);
        } else {
            console.log("\n✅ Análisis léxico y sintáctico exitoso.");
            
            console.log("\n=== ÁRBOL DE DERIVACIÓN ===");
            console.log(tree.toStringTree(parser.ruleNames));

            console.log("\n=== EJECUCIÓN DEL INTÉRPRETE ===");
            const visitor = new CustomVisitor();
            visitor.visit(tree);
            
            console.log("\n>>> [SISTEMA]: Finalizado correctamente.");
        }

    } catch (err) {
        console.error("\n❌ Error crítico:", err.message);
    }
}

main();
