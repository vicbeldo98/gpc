var renderer, scene, camera;

let cameraContols;

let esferaCubo;

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor ( new THREE.Color(0x0000AA), 1.0);
    document.body.appendChild( renderer.domElement);

    // Indicarle al renderer que queremos sombras
    renderer.shadowMap.enabled = true;
    // Antialiasing
    renderer.antialias = true;

    scene = new THREE.Scene();

    // PerspectiveCamera(angulo vision, width y heigth pantalla, punto más cercano, punto más lejano)
    camera = new THREE.PerspectiveCamera(100, (window.innerWidth / window.innerHeight), 0.1, 10000);
    cameraContols = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set( 0.5, 3, 9 );
    camera.lookAt( 0, 2, 0 );
    cameraContols.target.set( 0, 2, 0 );

    //Luces
    let luzAmbiente = new THREE.AmbientLight( 0xffffff, 0.1 );

    let luzPuntual = new THREE.PointLight( 0xffffff, 0.5 );
    luzPuntual.position.set( -10, 10, -10 );

    let luzDireccional = new THREE.DirectionalLight( 0xffffff, 0.5 );
    luzDireccional.position.set( -10, 5, 10 );

    let luzFocal = new THREE.SpotLight( 0xffffff, 0.5 );
    luzFocal.position.set( 10, 10, 3 );
    luzFocal.target.position.set( 0, 0, 0 );

    luzFocal.angle = Math.PI/10;

    // La penumbra aporta calidad en el paso de luz a sombra (a 0 queda mal)
    luzFocal.penumbra = 0.3;
    luzFocal.castShadow = true;

    scene.add(luzAmbiente);
    scene.add(luzPuntual);
    scene.add(luzDireccional);
    scene.add(luzFocal);

    window.addEventListener('resize', updateAspectRatio );

}

function loadScene(){

    let path = "images/";
    let txsuelo = new THREE.TextureLoader().load( path + 'wet_ground_512x512.jpg' );

    // Cómo debe comportarse el suelo -> Aliasing y difuminado
    txsuelo.magfilter = THREE.LinearFilter;
    txsuelo.minfilter = THREE.LinearFilter;

    // Cuantas veces se repite en x e y
    txsuelo.repeat.set( 2, 2 );

    // En secuencia o despejada (cuando acaba una empieza la otra)
    txsuelo.wrapS = txsuelo.wrapT = THREE.MirroredRepeatWrapping;

    let txcubo = new THREE.TextureLoader().load( path + 'wood512.jpg' );

    let txesfera = new THREE.TextureLoader().load( path + 'Earth.jpg' );

    let paredes = [ path+'posx.jpg', path+'negx.jpg',
                    path+'posy.jpg', path+'negy.jpg',
                    path+'posz.jpg', path+'negz.jpg' ];

    let txmapaentorno = new THREE.CubeTextureLoader().load(paredes);

    // materiales
    let materialBasico = new THREE.MeshLambertMaterial( { color: 'white', map: txsuelo } );

    let materialMate = new THREE.MeshLambertMaterial( { color: 'red', map: txcubo } );

    let materialBrillante = new THREE.MeshPhongMaterial( {color: 'white', specular: 'white',
                                                            shininess: 50, envMap: txmapaentorno } );

    /*let materialBrillante = new THREE.MeshPhongMaterial( {color: 'white', specular: 'white',
                                                            shininess: 50, map: txesfera } );*/


    let cubo = new THREE.Mesh( new THREE.BoxGeometry(2, 2, 2), materialMate );

    // Producir sombras
    cubo.castShadow = true;
    cubo.receiveShadow = true;

    let esfera = new THREE.Mesh( new THREE.SphereGeometry(1, 20, 20), materialBrillante );

    esfera.castShadow = true;
    esfera.receiveShadow = true;

    // Se produce aliasing porque hay muy pocos vértices que generen el suelo
    let suelo = new THREE.Mesh( new THREE.PlaneGeometry(10, 10, 100, 100), materialBasico );
    suelo.rotation.x = -Math.PI/2;

    // Reproducir las sombras
    suelo.receiveShadow = true;

    scene.add(suelo);

    esferaCubo = new THREE.Object3D();

    var loader = new THREE.ObjectLoader();
    loader.load('models/soldado/soldado.json',
    function (obj)
    {
        // Material para todo el robot
        obj.castShadow = true;
        obj.receiveShadow = true;
        obj.position.y = 1;
        obj.position.x = -0.5;
        esferaCubo.add(obj);
        let txObj = new THREE.TextureLoader().load('models/soldado/soldado.png');
        obj.material.map = txObj;
    });

    esferaCubo.position.y = 1;
    cubo.position.x = -1;
    esfera.position.x = 1;

    esferaCubo.add(cubo);
    esferaCubo.add(esfera);

    scene.add(esferaCubo);
    scene.add(new THREE.AxesHelper(1));

}
var antes = Date.now();
var angulo = Math.PI/6;
function update(){
    var ahora = Date.now();
    angulo += Math.PI/10 * (ahora - antes)/1000;
    antes = ahora;
    esferaCubo.rotation.y = angulo;
}


function updateAspectRatio() {

    renderer.setSize( window.innerWidth, window.innerHeight );
    let aspectRatio = window.innerWidth/window.innerHeight;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

}

function render(){
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}

function loadRotationalUmbrella(){
    //Material de alambres rojos
    var material = new THREE.MeshBasicMaterial({color:"red", wireframe:true});

    //Objeto de tela con modelmatrix explicita
    var ms = new THREE.Matrix4();
    var mt = new THREE.Matrix4();
    var tela = new THREE.Mesh( new THREE.CylinderGeometry(0.0, 1.0,1.0), material);
    tela.matrixAutoUpdate = false;

    mt.makeTranslation(0,1.5,0);
    ms.makeScale(2,0.5,2);
    tela.matrix = mt.multiply(ms);


    //Objeto bastón con modelmatrix implícita
    var baston = new THREE.Mesh( new THREE.CylinderGeometry(1,1,1), material);
    baston.position.y = 0.5;
    baston.scale.set(0.05,3,0.05);

    //Objeto mango con modelmatrix implícita
    var mango = new THREE.Mesh(new THREE.CubeGeometry(1,1,1), material);
    mango.scale.set(0.2,0.4,0.2);
    mango.position.set(0,-1,0);

    //Objeto contenedor paraguas con modelmatrix implicita
    paraguas = new THREE.Object3D();
    paraguas.add(tela);
    paraguas.add(baston);
    paraguas.add(mango);
    paraguas.position.set(1.6, 0, 0);
    paraguas.rotation.x = angulo;

    scene.add(paraguas);
}

init();
loadScene();
render();