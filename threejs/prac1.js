let VSHADER_SOURCE =
    'attribute vec2 position;\n' + // attribute variable
    'attribute vec3 color;                        \n'+
    'varying highp vec3 vColor;                   \n'+
    'void main() {\n' +
    'gl_Position = vec4(position, 0.0, 1.0);\n' +
    'gl_PointSize = 10.0;\n' +
    'vColor = color;\n' +
    '}';

let FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying highp vec3 vColor;\n' +
    'void main(){  \n' +
    'gl_FragColor = vec4 ( vColor, 1.0 ); \n' +
    '}\n';

let bufferCoordenadas = null;
let bufferColors = null;

function main() {

    let canvas = document.getElementById('canvas');

    if (!canvas) {
        console.log("ERROR CANVAS");
        return ;
    }

    let gl = getWebGLContext(canvas);

    if (!gl) {
        console.log("ERROR GL CONTEXT");
        return ;
    }

    if ( !initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE) ) {
        console.log("ERROR INIT SHADERS");
        return ;
    }

    gl.clearColor( 0.0, 0.0, 0.5, 1.0 );

    gl.clear( gl.COLOR_BUFFER_BIT );

    //  Localiza la variable position en el segment shader
    let coordenadas = gl.getAttribLocation( gl.program, 'position' );

    //  Crea buffer para positions
    bufferCoordenadas = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferCoordenadas );
    gl.vertexAttribPointer( coordenadas, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( coordenadas );

    //  Localiza la variable color en el segment shader
    let color = gl.getAttribLocation( gl.program, 'color');

    //  Crea buffer para colores
    bufferColors = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferColors );
    gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( color );

    canvas.onmousedown = function( evento ) { click( evento, gl, canvas ); };

}

let puntos = [];
let puntos_colors = [];

function click( evento, gl, canvas ) {

    let x = evento.clientX;
    let y = evento.clientY;

    let rect = evento.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2) * 2/canvas.width;
    y = (canvas.height/2 - (y - rect.top)) * 2/canvas.height;

    let distance_to_origin = Math.sqrt(x*x + y*y);

    let color_v = 1-(distance_to_origin/Math.sqrt(2));

    for (let i = 0; i < 3; i ++ ) puntos_colors.push(color_v);

    puntos.push(x);
    puntos.push(y);

    render( gl );

}

function render( gl ) {

    let puntos_array = new Float32Array(puntos);
    let colors_array = new Float32Array(puntos_colors);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferCoordenadas );
    gl.bufferData( gl.ARRAY_BUFFER, puntos_array, gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferColors );
    gl.bufferData( gl.ARRAY_BUFFER, colors_array, gl.STATIC_DRAW );

    gl.drawArrays( gl.POINTS, 0, puntos_array.length/2 );
    gl.drawArrays( gl.LINE_STRIP, 0, puntos_array.length/2 );

}