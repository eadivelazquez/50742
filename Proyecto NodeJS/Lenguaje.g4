grammar Lenguaje;

// --- REGLAS SINTÁCTICAS (Lo que está en minúsculas en tu PDF) ---

// <programa> ::= { <instrucción> }+
programa    : instruccion+ EOF ;

// <instrucción> ::= <repeticion>
instruccion : repeticion #instRepeticion ;

// <repeticion> ::= 'repetir' '{' { <sentencia> } '}' 'hasta' <condición> ';'
// Nota: {} en EBNF significa 0 o más, por eso usamos *
repeticion  : 'repetir' '{' sentencia* '}' 'hasta' condicion ';' #repLoop ;

// <sentencia> ::= { <salida> }+ | <terminar>
sentencia   : salida+   #sentenciaSalida
            | terminar  #sentenciaTerminar ;

// <salida> ::= 'imprimir' '(' <cadena> ')' ';'
salida      : 'imprimir' '(' CADENA ')' ';' #salidaImprimir ;

// <terminar> ::= 'salir' ';'
terminar    : 'salir' ';' #instSalir ;

// <condición> ::= 'verdadero' | 'falso'
condicion   : 'verdadero' #condTrue
            | 'falso'     #condFalse ;


// --- REGLAS LÉXICAS (Los "ladrillos" que forman las palabras) ---

// <cadena> ::= '"' { <carácter> } '"'
CADENA      : '"' CARACTER* '"' ;

// <carácter> ::= <letra> | <dígito> | <símbolo>
fragment CARACTER : LETRA | DIGITO | SIMBOLO ;

// <letra> ::= 'a' | 'b' | ... | 'Z'
fragment LETRA    : [a-zA-Z] ;

// <dígito> ::= '0' | '1' | ... | '9'
fragment DIGITO   : [0-9] ;

// <símbolo> ::= '.' | ',' | '!' | '?' | ':' | ';'
// Agregamos el espacio también para que las frases tengan sentido
fragment SIMBOLO  : [.,!?:; ] ;

// Ignorar espacios y saltos de línea (obligatorio en ANTLR)
WS : [ \t\r\n]+ -> skip ;