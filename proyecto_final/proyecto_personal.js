var renderer, scene, camera, mini_camera, robot, cameraControls;

function init(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor ( new THREE.Color(0xFFFFFF), 1.0);
    document.body.appendChild( renderer.domElement);

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;

    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
    camera.position.set(25,300,200);

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0,0,0);

    scene.add(camera);
    scene.add(new THREE.AxesHelper(1000));

}

function loadScene(){
    //  Creando el suelo
    var material = new THREE.MeshBasicMaterial( {color: 0x000000, wireframe: true} );
    var geometria = new THREE.PlaneGeometry(1000,1000,10,10);
    var suelo = new THREE.Mesh(geometria, material);
    suelo.position.set(0, 0, 0);
    suelo.rotation.x = Math.PI/2;
    scene.add(suelo);

    
}

function update(){
}

function render(){
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}

init();
loadScene();
render();