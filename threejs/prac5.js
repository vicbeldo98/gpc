var renderer, scene, camera, mini_camera, robot, cameraControls;

var base, brazo, antebrazo, mano;

var pinzaIz;
var pinzaDe;

var L=120;

// GUI
var effectController;

function init(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor ( new THREE.Color(0x0000AA), 1.0);
    document.body.appendChild( renderer.domElement);
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.antialias = true;

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;

    setMiniCamera();

    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
    camera.position.set(50,300,150);

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0,100,0);
    cameraControls.enableKeys = false;
    window.addEventListener('resize', updateAspectRatio);

    // Controles para conseguir movimiento del robot sobre el plano del suelo con las flechas del teclado.
    keyboard = new THREEx.KeyboardState(renderer.domElement);
    renderer.domElement.setAttribute("tabIndex", "0");
    renderer.domElement.focus();
    keyboard.domElement.addEventListener('keydown', function (event) {
        if (keyboard.eventMatches(event, 'left') || keyboard.eventMatches(event, 'a') ) {
            robot.position.x -= 10;
        }
        if (keyboard.eventMatches(event, 'right') || keyboard.eventMatches(event, 'd') ) {
            robot.position.x += 10;
        }
        if (keyboard.eventMatches(event, 'up') || keyboard.eventMatches(event, 'w') ) {
            robot.position.z -= 10;
        }
        if (keyboard.eventMatches(event, 'down') || keyboard.eventMatches(event, 's') ) {
            robot.position.z += 10;
        }
    });

    //Luces
    let luzAmbiente = new THREE.AmbientLight( 0xffffff, 0.4);

    let luzPuntual = new THREE.PointLight( 0xffffff, 0.3);
    luzPuntual.position.set( 0, 300, -10 );

    let luzFocal = new THREE.SpotLight( 0xffffff, 4);
    luzFocal.position.set( 150, 400, 0);
    luzFocal.target.position.set( 8, 100, 0 );
    luzFocal.angle = Math.PI/10;
    luzFocal.castShadow = true;
    luzFocal.penumbra = 0.8;

    scene.add(luzAmbiente);
    scene.add(luzPuntual);
    scene.add(luzFocal);
}

function setMiniCamera(){
    var camaraOrtografica;

    // VIEWPORT MÁS ANCHO QUE ALTO
    camaraOrtografica = new THREE.OrthographicCamera(
        -L, L, L, -L, 0,300
    );
    planta = camaraOrtografica.clone();
    planta.position.set(0,250,0);
    planta.lookAt(0,0,0);
    planta.up = (0,0,-1);

    scene.add(planta);
}

function updateAspectRatio(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect =window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    planta.left = -L ;
    planta.right = L;
    planta.bottom = -L ;
    planta.top = L;

    planta.updateProjectionMatrix();
}

function loadScene(){
    var path = "images/";
    var paredes = [path + "posx.jpg", path + "negx.jpg", path + "posy.jpg", path + "negy.jpg", path + "posz.jpg", path + "negz.jpg"];
    var mapaEntorno = new THREE.CubeTextureLoader().load(paredes);

    var shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = mapaEntorno;

    var wallsMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

    var habitacion = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 10000), wallsMaterial);
    scene.add(habitacion);

    //Crear la habitación con el material de las pareder
    var room= new THREE.Mesh( new THREE.CubeGeometry(15, 15, 15), wallsMaterial);

    robot = new THREE.Object3D();
    let txsuelo = new THREE.TextureLoader().load( path + 'pisometalico_1024.jpg' );
    txsuelo.magfilter = THREE.LinearFilter;
    txsuelo.minfilter = THREE.LinearFilter;
    txsuelo.repeat.set( 2, 2 );
    txsuelo.wrapS = txsuelo.wrapT = THREE.MirroredRepeatWrapping;

    let materialSuelo = new THREE.MeshLambertMaterial( { color: 'white', map: txsuelo } );

    //  Creando el suelo
    var geometria = new THREE.PlaneGeometry(1000,1000,10,10);
    var suelo = new THREE.Mesh(geometria, materialSuelo);
    suelo.position.set(0, 0, 0);
    suelo.rotation.x = -Math.PI/2;

    // Creando la base del robot
    let metal = new THREE.TextureLoader().load( path + 'metal_128.jpg' );
    let txRobotMaterial = new THREE.MeshLambertMaterial( { color: 'white', map: metal } );
    base = new THREE.Object3D();
    var cilindro = new THREE.CylinderGeometry( 50, 50, 15, 40 );
    var base_obj = new THREE.Mesh( cilindro, txRobotMaterial);

    //Creando el brazo
    brazo = new THREE.Object3D();
    //parte inferior del brazo
    var cilindro = new THREE.CylinderGeometry( 20, 20, 18, 40 );
    eje = new THREE.Mesh( cilindro, txRobotMaterial );
    eje.rotation.x = Math.PI/2;

    //parte intermedia del brazo
    var cubo = new THREE.CubeGeometry( 18, 120, 12);
    var esparrago = new THREE.Mesh( cubo, txRobotMaterial );
    esparrago.position.set(0,60,0);

    //parte superior del brazo
    let paredes2 = [ path+'posx.jpg', path+'negx.jpg',
                    path+'posy.jpg', path+'negy.jpg',
                    path+'posz.jpg', path+'negz.jpg' ];
    let txmapaentorno = new THREE.CubeTextureLoader().load(paredes2);
    let materialBrillante = new THREE.MeshPhongMaterial( {color: 'white', specular: 'white', shininess: 50, envMap: txmapaentorno } );

    var esfera = new THREE.SphereGeometry( 20, 15, 15);
    rotula = new THREE.Mesh( esfera, materialBrillante );
    rotula.position.set(0,120,0);

    // Creando el antebrazo
    let txOro = new THREE.MeshPhongMaterial( {color: 0xf1ab05, specular:'white', shininess: 50});
    antebrazo = new THREE.Object3D();
    antebrazo.position.y = 120;
    //parte inferior del antebrazo
    var cilindro = new THREE.CylinderGeometry( 22, 22, 6, 40 );
    var disco = new THREE.Mesh( cilindro, txOro );
    disco.position.set(0,0,0);

    //partes intermedias del antebrazo
    //nervio 1
    var cubo = new THREE.CubeGeometry(4, 80, 4);
    var nervio1 = new THREE.Mesh( cubo, txOro);
    nervio1.position.set(8,40,0);

    //nervio 2
    var cubo = new THREE.CubeGeometry(4, 80, 4);
    var nervio2 = new THREE.Mesh( cubo, txOro );
    nervio2.position.set(-8,40,0);

    //nervio 3
    var cubo = new THREE.CubeGeometry(4, 80, 4);
    var nervio3 = new THREE.Mesh( cubo, txOro );
    nervio3.position.set(0,40,8);

    //nervio 4
    var cubo = new THREE.CubeGeometry(4, 80, 4);
    var nervio4 = new THREE.Mesh( cubo, txOro );
    nervio4.position.set(0,40,-8);

    mano = new THREE.Object3D();
    mano.position.set(0,80,0);

    //parte superior del antebrazo
    var cilindro = new THREE.CylinderGeometry( 15, 15, 40, 40 );
    var palma = new THREE.Mesh( cilindro, txOro );
    palma.position.set(0,0,0);
    palma.rotation.x = Math.PI/2;

    // Añadir pinzas del robot
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

    var material = new THREE.MeshLambertMaterial({color: 0x474b4e, side:THREE.DoubleSide});

    geom.computeVertexNormals();
    pinzaIz = new THREE.Mesh( geom, material);
    pinzaIz.position.set(0,-10,19);
    pinzaIz.rotation.y = Math.PI/2;
    pinzaDe = new THREE.Mesh( geom, material);
    pinzaDe.position.set(0,-10,-10);
    pinzaDe.rotation.y = Math.PI/2;


    // Configurar sombras
    suelo.receiveShadow = true;
    base_obj.castShadow = true;
    base_obj.receiveShadow = true;
    esparrago.castShadow = true;
    esparrago.receiveShadow = true;
    rotula.castShadow = true;
    rotula.receiveShadow = true;
    eje.castShadow = true;
    eje.receiveShadow = true;
    disco.castShadow = true;
    disco.receiveShadow = true;
    nervio1.castShadow = true;
    nervio1.receiveShadow = true;
    nervio2.castShadow = true;
    nervio2.receiveShadow = true;
    nervio3.castShadow = true;
    nervio3.receiveShadow = true;
    nervio4.castShadow = true;
    nervio4.receiveShadow = true;
    palma.castShadow = true;
    palma.receiveShadow = true;
    pinzaIz.castShadow = true;
    pinzaIz.receiveShadow = true;
    pinzaDe.castShadow = true;
    pinzaDe.receiveShadow = true;

    // Añadir objetos al grafo de escena
    scene.add(suelo);
    scene.add(robot);
    robot.add(base);
    base.add(base_obj);
    base.add(brazo);
    brazo.add(esparrago);
    brazo.add(rotula);
    brazo.add(antebrazo);
    brazo.add(eje);
    antebrazo.add(disco);
    antebrazo.add(nervio1);
    antebrazo.add(nervio2);
    antebrazo.add(nervio3);
    antebrazo.add(nervio4);
    antebrazo.add(mano);
    mano.add(pinzaIz);
    mano.add(pinzaDe);
    mano.add(palma);
}

function setupGui(){
    effectController = {
        giroBase: 0.0,
        giroBrazo: 0.0,
        giroAntebrazoY: 0.0,
        giroAntebrazoZ: 0.0,
        giroPinza: 0.0,
        separacionPinza: 15.0,
        colorMaterial: "rgb(255,255,255)"
    }

    var gui = new dat.GUI();
    var carpeta = gui.addFolder("Control Robot");
    carpeta.add(effectController, "giroBase", -180, 180, 1).name("Giro Base");
    carpeta.add(effectController, "giroBrazo", -45, 45, 1).name("Giro Brazo");
    carpeta.add(effectController, "giroAntebrazoY", -180, 180, 1).name("Giro Antebrazo Y");
    carpeta.add(effectController, "giroAntebrazoZ", -90, 90, 1).name("Giro Antebrazo Z");
    carpeta.add(effectController, "giroPinza", -40, 220, 1).name("Giro Pinza");
    carpeta.add(effectController, "separacionPinza", 0, 15, 1).name("Separación Pinza");
    var sensorColor = carpeta.addColor(effectController, "colorMaterial").name("Color dibujo");

    sensorColor.onChange(
        function(color){
            robot.traverse(function(hijo){
                if(hijo instanceof THREE.Mesh)
                    hijo.material.color = new THREE.Color(color);    
            })
        }
    );

}

function update(){
    // Giro de la base sobre su eje vertical (Y)
    base.rotation.y = effectController.giroBase * Math.PI / 180;

    // Giro del brazo sobre el eje Z de la pieza ‘eje’)
    brazo.rotation.z = effectController.giroBrazo * Math.PI / 180;

    // Giro del antebrazo sobre el eje Y de la pieza ‘rotula’)
    antebrazo.rotation.y = effectController.giroAntebrazoY * Math.PI / 180;

    // Giro del antebrazo sobre el eje Z de la pieza ‘rotula’)
    antebrazo.rotation.z = effectController.giroAntebrazoZ * Math.PI / 180;

    // Rotación de la pinza sobre el eje Z de la mano)
    mano.rotation.z = effectController.giroPinza * Math.PI / 180;

    // Apertura/Cierre de la pinza sobre el eje Z de la mano)
    pinzaIz.position.z = effectController.separacionPinza + 4.5;
    pinzaDe.position.z = -effectController.separacionPinza ;

    cameraControls.update();

    //PREGUNTAR A ROBERTO VIVÓ POR QUÉ SI NO PONGO ESTA LÍNEA PIERDO EL FOCUS DEL TECLADO
    renderer.domElement.focus();

}

function render(){
    requestAnimationFrame(render);
    update();

    renderer.clear();
    //CAMARA GENERAL
    renderer.setViewport (0,0,window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

    var aspectRatio = window.innerWidth / window.innerHeight;

    if(aspectRatio > 1){
        renderer.setViewport (0,0,window.innerHeight/4, window.innerHeight/4);
    }else{
        renderer.setViewport (0,0,window.innerWidth/4, window.innerWidth/4);
    }
    renderer.render(scene, planta);
}

init();
setupGui();
loadScene();
render();