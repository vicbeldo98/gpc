/**
 * Seminario 3. Ejemplo de multivista
 */

//Variables usuales
var renderer, scene, camera;

// Camaras adicionales planta, alzado, perfil
var planta, alzado, perfil;
var L = 3; // semilado de la caja ortografica

// Controlar camara
var cameraControls;

//Acciones
init();
loadScene();
render();


function setCameras(ar){
    //CONFIGURAR LAS TRES CAMARAS ORTOGRAFICAS
    var camaraOrtografica;

    if (ar > 1){
        // VIEWPORT MÁS ANCHO QUE ALTO
        camaraOrtografica = new THREE.OrthographicCamera(
            -L*ar, L*ar, L , -L, -100, 100
        );
    }else{
        //VIEWPORT MÁS ALTO QUE ANCHO
        camaraOrtografica = new THREE.OrthographicCamera(
            -L, L, L/ar , -L/ar, -100, 100
        );
    }

    alzado = camaraOrtografica.clone();
    alzado.position.set(0,0,L);
    alzado.lookAt(0,0,0);


    planta = camaraOrtografica.clone();
    planta.position.set(0,L,0);
    planta.lookAt(0,0,0);
    //PORQUE EN LAS OTRAS CAMARAS SU VECTOR UP ESTÁ BIEN PERO EN ESTE NO
    //PORQUE COINCIDE CON LA DIRECCIÓN EN LA QUE ESTÁS MIRANDO
    planta.up = (0,0,-1);

    perfil = camaraOrtografica.clone();
    perfil.position.set(L,0,0);
    perfil.lookAt(0,0,0);

    scene.add(alzado);
    scene.add(planta);
    scene.add(perfil);

}

function init(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor ( new THREE.Color(0x0000AA), 1.0);
    document.body.appendChild( renderer.domElement);
    renderer.autoClear = false;

    //ESCENA
    scene = new THREE.Scene();

    //CAMARA
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    //situarla
    camera.position.set(2,2,3);
    //IRRELEVANTE CUANDO HAY CONTROLES DE CÁMARA
    //camera.lookAt( new THREE.Vector3(0,0,0));
    setCameras(aspectRatio);


    cameraControls = new THREE.OrbitControls( camera, renderer.domElement);
    cameraControls.target.set(0,0,0);
    
    //Captura de eventos
    window.addEventListener('resize', updateAspectRatio);
    renderer.domElement.addEventListener('dblclick', rotateCube);
    
}

function rotateCube( event ){
    // Capturar coordenadas de click
    var x = event.clientX;
    var y = event.clientY;

    //  Zona click
    var derecha = false;
    var abajo = false;
    var cam = null;

    if( x > window.innerWidth/2 ) {
        derecha = true;
        x -= window.innerWidth/2;
    }

    if (y > window.innerHeight/2){
        abajo = true;
        y -= window.innerHeight/2;
    }

    if ( derecha ){
        if (abajo) cam = camera;
        else cam = perfil;
    } else{
        if (abajo) cam = planta;
        else cam = alzado;
    }

    // cam es la camara que recibe el click

    // normaliza a cuadrado 2x2
    x = ( x * 4 / window.innerWidth) -1;
    y = -( y* 4/window.innerHeight) +1;

    // Construir el rayo 
    var rayo = new THREE.Raycaster();
    rayo.setFromCamera(new THREE.Vector2(x,y), cam);

    // TRUE INDICA QUE LO HAGA EN PROFUNDIDAD, QUE RECORRA TODA LA ESCENA
    var intersecciones = rayo.intersectObjects( scene.children, true);
    if (intersecciones.length > 0) intersecciones[0].object.rotation.x += Math.PI/8;


}

function updateAspectRatio(){
    // Se dispara cuando se cambia el area de dibujo
    renderer.setSize(window.innerWidth, window.innerHeight);
    var ar = window.innerWidth/ window.innerHeight;
    camera.aspect = ar;
    camera.updateProjectionMatrix();

    if(ar > 1){
        alzado.left = perfil.left = planta.left = -L * ar;
        alzado.right =perfil.right = planta.right = L * ar;
        alzado.bottom =perfil.bottom = planta.bottom = -L;
        alzado.top =perfil.top = planta.top = L;

    }else{
        alzado.left = perfil.left = planta.left = -L ;
        alzado.right =perfil.right = planta.right = L;
        alzado.bottom =perfil.bottom = planta.bottom = -L / ar;
        alzado.top =perfil.top = planta.top = L / ar;
    }

    alzado.updateProjectionMatrix();
    perfil.updateProjectionMatrix();
    planta.updateProjectionMatrix();
}

function loadScene(){
    // 5 cubos iguales :) en tirereta
    var geometria = new THREE.BoxGeometry(0.9,0.9,0.9);
    var material = new THREE.MeshBasicMaterial({
        color: 'red',
        wireframe: true
    });

    for(var i = 0; i<5;i++){
        var cubo = new THREE.Mesh(geometria, material);
        cubo.position.set(-2+i,0,0);
        scene.add(cubo);
    }

    scene.add( new THREE.AxesHelper(100));
}

function update(){

}

function render(){
    requestAnimationFrame(render);
    update();

    renderer.clear();

    // ALZADO
    renderer.setViewport (0,0,window.innerWidth/2, window.innerHeight/2);
    renderer.render(scene, alzado);

    //PLANTA
    renderer.setViewport (window.innerWidth/2,0,window.innerWidth/2, window.innerHeight/2);
    renderer.render(scene, planta);

    //PERFIL
    renderer.setViewport (0,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
    renderer.render(scene, perfil);

    //CAMARA DINAMICA
    renderer.setViewport (window.innerWidth/2,window.innerHeight/2,window.innerWidth/2, window.innerHeight/2);
    renderer.render(scene, camera);

}