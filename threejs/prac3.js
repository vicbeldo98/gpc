var renderer, scene, camera, robot, cameraControls;

function init(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor ( new THREE.Color(0x0000AA), 1.0);
    document.body.appendChild( renderer.domElement);

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;

    // PerspectiveCamera(angulo vision, width y heigth pantalla, punto más cercano, punto más lejano)
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
    camera.position.set(0,0,10);
    camera.lookAt(0,0,0);
    //camera.rotateZ(30*Math.PI/180);

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0,0,0);

    window.addEventListener('resize', updateAspectRatio);

}

function updateAspectRatio(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect =window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
}

function loadScene(){
    robot = new THREE.Object3D();

    var material = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true} );

    //  Creando el suelo
    var geometria = new THREE.PlaneGeometry(1000,1000,10,10);
    var suelo = new THREE.Mesh(geometria, material);
    suelo.position.set(0, 0, 0);
    suelo.rotation.x = Math.PI/2;
    scene.add(suelo);

    // Creando la base del robot
    base = new THREE.Object3D();
    var cilindro = new THREE.CylinderGeometry( 50, 50, 15, 40 );
    var base_obj = new THREE.Mesh( cilindro, material );
    base.add(base_obj);


    //Creando el brazo
    brazo = new THREE.Object3D();
    //parte inferior del brazo
    var cilindro = new THREE.CylinderGeometry( 20, 20, 18, 40 );
    var brazo_inferior = new THREE.Mesh( cilindro, material );
    brazo_inferior.rotation.x = Math.PI/2;
    brazo.add( brazo_inferior );

    //parte intermedia del brazo
    var cubo = new THREE.CubeGeometry( 18, 120, 12);
    var brazo_intermedio = new THREE.Mesh( cubo, material );
    brazo_intermedio.position.set(0,60,0);
    brazo.add( brazo_intermedio );

    //parte superior del brazo
    var esfera = new THREE.SphereGeometry( 20, 15, 15);
    var brazo_superior = new THREE.Mesh( esfera, material );
    brazo_superior.position.set(0,120,0);
    brazo.add( brazo_superior );

    // Creando el antebrazo
    antebrazo = new THREE.Object3D();
    //parte inferior del antebrazo
    var cilindro = new THREE.CylinderGeometry( 22, 22, 6, 40 );
    var antebrazo_inferior = new THREE.Mesh( cilindro, material );
    antebrazo_inferior.position.set(0,120,0);
    antebrazo.add( antebrazo_inferior );

    //partes intermedias del antebrazo
    //nervio 1
    var cubo = new THREE.CubeGeometry(4, 80, 4);
    var nervio1 = new THREE.Mesh( cubo, material);
    nervio1.position.set(8,160,0);
    antebrazo.add( nervio1 );

    //nervio 2
    var cubo = new THREE.CubeGeometry(4, 80, 4);
    var nervio2 = new THREE.Mesh( cubo, material );
    nervio2.position.set(-8,160,0);
    antebrazo.add( nervio2 );

    //nervio 3
    var cubo = new THREE.CubeGeometry(4, 80, 4);
    var nervio3 = new THREE.Mesh( cubo, material );
    nervio3.position.set(0,160,8);
    antebrazo.add( nervio3 );

    //nervio 4
    var cubo = new THREE.CubeGeometry(4, 80, 4);
    var nervio4 = new THREE.Mesh( cubo, material );
    nervio4.position.set(0,160,-8);
    antebrazo.add( nervio4 );

    var mano = new THREE.Object3D();

    //parte superior del antebrazo
    var cilindro = new THREE.CylinderGeometry( 15, 15, 40, 40 );
    var antebrazo_superior = new THREE.Mesh( cilindro, material );
    antebrazo_superior.position.set(0,200,0);
    antebrazo_superior.rotation.x = Math.PI/2;
    antebrazo.add( antebrazo_superior );

    // Añadir pinzas del robot
    var mano = new THREE.Object3D();
    var geom = new THREE.Geometry();
    var vertices = [
        0,0,0,
        4,0,0,
        4,20,0,
        0,20,0,
        4,20,19,
        0,20,19,
        4,0,19,
        0,0,19,
        2,15,38,
        0,15,38,
        2,7,38,
        0,7,38
    ]

    var indices = [
        4,2,3,
        5,4,3,
        3,2,0,
        2,1,0,
        2,4,1,
        4,6,1,
        5,3,7,
        3,0,7,
        0,1,7,
        1,6,7,
        5,4,9,
        4,8,9,
        5,9,7,
        9,11,7,
        4,10,8,
        4,6,10,
        6,7,10,
        7,11,10,
        11,9,8,
        11,8,10
        

    ];

    for(var i=0;i<vertices.length; i+=3){
        var vertice = new THREE.Vector3(vertices[i],vertices[i+1], vertices[i+2]);
        geom.vertices.push(vertice);
    }

    for(var i=0;i< indices.length;i+=3){
        var triangulo = new THREE.Face3(indices[i], indices[i+1], indices[i+2]);
        geom.faces.push(triangulo);
    }

    pinzaIz = new THREE.Mesh( geom, material);
    pinzaIz.position.set(0,190,18);
    pinzaIz.rotation.y = Math.PI/2;
    mano.add(pinzaIz);

    pinzaDe = new THREE.Mesh( geom, material);
    pinzaDe.position.set(0,190,-18);
    pinzaDe.rotation.y = Math.PI/2;
    mano.add(pinzaDe);

    //  Añadir ejes x y  z
    var helper = new THREE.AxesHelper(1000);
    scene.add(helper);

    antebrazo.add(mano);
    brazo.add(antebrazo);
    base.add(brazo);
    robot.add(base);
    scene.add(robot);
}

function update(){
    //Cambios entre frames
    cameraControls.update();
}

function render(){
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}

init();
loadScene();
render();