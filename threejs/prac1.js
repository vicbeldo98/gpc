//  SHADER DE VERTICES
var VSHADER_SOURCE =
    'attribute vec4 posicion; void main(){ gl_Position = posicion; gl_PointSize = 10.0;}'; 

//  SHADER DE FRAGMENTOS
var FSHADER_SOURCE = 'void main(){ gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0);}';

function main()
{
//  Recupera el area de dibujo
    var canvas = document.getElementById( "canvas" );
    if( !canvas ){
        console.log("Fallo al recuperar el canvas");
        return;
    }

    //  Recupera el lienzo del area de dibujo como un contexto WebGL
    var gl = getWebGLContext( canvas );
    if( !gl ){ 
        console.log("Fallo al recuperar el contexto WebGL");
        return;
    }

    // Carga, compila y monta los shaders
    if( !initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Fallo al iniciar los shaders")
    }
    //  Fija el color de fondo azul oscuro
    gl.clearColor( 0.0, 0.0, 0.3, 1.0 );

    // Borra el canvas con el color de fondo
    gl.clear( gl.COLOR_BUFFER_BIT );

    var coordenadas = gl.getAttribLocation( gl.program, 'posicion');
    canvas.onmousedown = function( evento ){ click( evento, gl, canvas, coordenadas ); };
}

var puntos = [];
function click( evento, gl, canvas, coordenadas ){
    var x = evento.clientX;
    var y = evento.clientY;
    var rect = evento.target.getBoundingClientRect();

    x = ((x -rect.left) - canvas.width/2) * 2/canvas.width;
    y = (canvas.heigth/2 - (y - rect.top)) * 2/ canvas.heigth;

    //Guardar coordenadas
    puntos.push(x);
    puntos.push(y);

    gl.clear( gl.COLOR_BUFFER_BIT );

    for( var i = 0; i< puntos.length; i +=2){
        gl.vertexAttrib3f(coordenadas, puntos[i], puntos[i+1], 0.0);
        gl.drawArrays(gl.POINTS,0, 1);
    }


}