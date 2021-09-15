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
    gl.vertexAttrib3f(  coordenadas, 0.0, 0.0, 0.0 );

    //  Dibuja un punto
    gl.drawArrays(gl.POINTS, 0, 1);
}