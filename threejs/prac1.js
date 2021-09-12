/*
Práctica 1. Clickar puntos con Webgl
*/

// SHADER DE VERTICES
var VSHADER_SOURCE =
    'attribute vec3 posicion;                 \n' +
    'void main(){                             \n' +
    '  gl_Position = vec4(posicion,1.0);      \n' +
    '  gl_PointSize = 10.0;                   \n' +
    '}                                        \n'
 
// SHADER DE FRAGMENTOS
var FSHADER_SOURCE =
'uniform highp vec3 color;                \n' +
'void main(){                             \n' +
'  gl_FragColor = vec4(color,1.0);        \n' +
'}                                        \n'

// Globales
var clicks = [];
var colorFragmento;

function main()
{
    // Recupera el canvas
    var canvas = document.getElementById("canvas");
    if( !canvas ){
        console.log("Fallo en el canvas");
        return;
    }

    // Asigna el contexto grafico
    var gl = getWebGLContext( canvas );
    if( !gl ){
        console.log("Fallo el contexto grafico");
        return;
    }

    // Carga, compila y monta los shaders
    if ( !initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE) ){
        console.log("Fallo la carga de los shaders");
        return;
    } 

    // Color de fondo
    gl.clearColor( 0.0, 0.0, 0.2, 1.0 );

    // Localiza el atributo 'posicion' en shader
    var coordenadas = gl.getAttribLocation( gl.program, 'posicion');

    // Crear el buffer, seleccionarlo y activar la conexion
    var bufferVertices = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferVertices );
    gl.vertexAttribPointer( coordenadas, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( coordenadas );

    // Localiza la variable 'color' en el shader
    colorFragmento = gl.getUniformLocation( gl.program, 'color' );

    // Registrar la callback de click de raton
    canvas.onmousedown = function( evento ){
        click( evento, gl, canvas );
    }

    // Dibujar
    render( gl );
    
}

function click( evento, gl, canvas )
{
    // Leer la coordenada del click. Sistema de referencia del documento
    var x = evento.clientX;
    var y = evento.clientY;

    // Situación del canvas en el documento
    var rect = evento.target.getBoundingClientRect();

    // Sistema de referencia del documento:
    //   Origen: TopLeft del area cliente
    //   Ejes: X+ derecha, Y+ abajo
    //   Dimensiones: ancho x alto (px) del documento
    //
    // Sistema de referencia de Webgl (por defecto)
    //   Origen: Centro
    //   Ejes: X+ derecha, Y+ arriba
    //   Dimensiones: 2x2 en R2 ajustado al canvas

    // Transformar s.r. documento a s.r. Webgl
    x = ((x - rect.left) - canvas.width/2) * 2/canvas.width;
    y = (canvas.height/2 - (y - rect.top)) * 2/canvas.height;

    // Guardar el punto (x,y,z) y dibujar la lista
    clicks.push(x); clicks.push(y); clicks.push(0.0);
    render(gl);
}

function render( gl )
{
    // Borrar el canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Todos los puntos del mismo color
    gl.uniform3f( colorFragmento, 1, 1, 0);

    // Rellenar el VBO y mandar al shader
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( clicks ), gl.STATIC_DRAW );
    gl.drawArrays( gl.POINTS, 0, clicks.length/3 );
}