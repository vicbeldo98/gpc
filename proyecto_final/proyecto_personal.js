// CONTROLES BÁSICOS
let renderer, scene, camera, mini_camera, robot, cameraControls;

// ANIMACIÓN DE FLECHAS
let arrowLeft, arrowRight, arrowUp, arrowDown;
let flagsLeft, flagsRight, flagsUp, flagsDown;
let kidxLeft, kidxRight, kidxUp, kidxDown;
let idxLeft, idxRight, idxUp, idxDown;
let timesLeft, timesRight, timesUp, timesDown;
let timeouts;



// PUNTUACIÓN
let puntuacion_inicial = 0;
let puntuacion;

// sacado de https://stackoverflow.com/a/51086910 al darme cuenta de que con los timetouts había race conditions en la puntuación
class Mutex {
    constructor() {
        this._lock = null;
    }
    isLocked() {
        return this._lock != null;
    }
    _acquire() {
        var release;
        const lock = this._lock = new Promise(resolve => {
            release = resolve;
        });
        return () => {
            if (this._lock == lock) this._lock = null;
            release();
        };
    }
    acquireSync() {
        if (this.isLocked()) throw new Error("still locked!");
        return this._acquire();
    }
    acquireQueued() {
        const q = Promise.resolve(this._lock).then(() => release);
        const release = this._acquire(); // reserves the lock already, but it doesn't count
        return q; // as acquired until the caller gets access to `release` through `q`
    }
}
const mutex = new Mutex();

// TEXTO DE PUNTUACIÓN
let text;

// CARGA DE MODELOS
let manager;
let loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(1.0,1.0,1.0),
        new THREE.MeshBasicMaterial({color:'yellow'})
    )
};
let RESOURCES_LOADED = false;

// ANIMACIÓN DE MICHELLE
let dancing;
let mixer;

// AUDIO
let audio, audioLoader, volume;

// GUI
let effectController;

// TIEMPO
let antes = Date.now();

// TEXTURAS
let blackTexture = new THREE.MeshPhongMaterial( {color: 'black', shininess:250} );
let redTexture = new THREE.MeshPhongMaterial( {color: 'red', shininess:250} );
let greenTexture = new THREE.MeshPhongMaterial( {color: 'green', shininess:250} );



function init(){
    // Inicializar letiables
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor ( new THREE.Color(0x000000), 1.0);
    document.body.appendChild( renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.antialias = true;
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    let aspectRatio = window.innerWidth / window.innerHeight;

    // Cargar el administrador de carga
    manager = new THREE.LoadingManager();

     manager.onLoad = function() {
        RESOURCES_LOADED = true;
    };

    // Crear escena de carga
    loadingScreen.box.position.set(0,0,5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
    loadingScreen.scene.add(loadingScreen.box);

    // Crear escena principal
    scene = new THREE.Scene();

    // Crear camara principal
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
    camera.position.set(0,20,35);
    camera.lookAt(0,20,0);

    // Inicializar contador del juego
    puntuacion = puntuacion_inicial;
    timeouts = []

    // Gestionar teclado
    keyboard = new THREEx.KeyboardState(renderer.domElement);
    renderer.domElement.setAttribute("tabIndex", "0");
    renderer.domElement.focus();
    kidxLeft = 0;
    kidxRight = 0;
    kidxUp = 0;
    kidxDown = 0;
    keyboard.domElement.addEventListener('keydown', async(event)=> {
        if(!event.repeat){
            if (keyboard.eventMatches(event, 'left')) {
                if(flagsLeft[kidxLeft] == true){
                    kidxLeft=flagsLeft.findIndex(element => element === false);
                }
                target_arrow = arrowsLeft[kidxLeft];
                if(Math.abs(target_arrow.position.y - arrowLeft.position.y) <= 3){
                    arrowLeft.material = greenTexture;
                    let aux = setTimeout(function(){arrowLeft.material= blackTexture},300);
                    const release = await mutex.acquireQueued();
                    puntuacion +=10;
                    release();
                    flagsLeft[kidxLeft]=true;
                    kidxLeft+=1;
                    scene.remove(target_arrow);
                }else{
                    arrowLeft.material = redTexture;
                    setTimeout(function(){arrowLeft.material= blackTexture},300);
                    const release = await mutex.acquireQueued();
                    puntuacion -=5;
                    release();
                }
            }
            else if (keyboard.eventMatches(event, 'right')) {
                if(flagsRight[kidxRight] == true){
                    kidxRight=flagsRight.findIndex(element => element === false);

                }
                target_arrow = arrowsRight[kidxRight];
                if(Math.abs(target_arrow.position.y - arrowRight.position.y) <= 3){
                    arrowRight.material = greenTexture;
                    setTimeout(function(){arrowRight.material= blackTexture},300);
                    const release = await mutex.acquireQueued();
                    puntuacion +=10;
                    release();
                    flagsRight[kidxRight]=true;
                    kidxRight+=1;
                    scene.remove(target_arrow);
                } else{
                    arrowRight.material = redTexture;
                    setTimeout(function(){arrowRight.material= blackTexture},300);
                    const release = await mutex.acquireQueued();
                    puntuacion -=5;
                    release();
                }
            }
            else if (keyboard.eventMatches(event, 'up')) {
                if(flagsUp[kidxUp] == true){
                    kidxUp=flagsUp.findIndex(element => element === false);
                }
                target_arrow = arrowsUp[kidxUp];
                if(Math.abs(target_arrow.position.y - arrowUp.position.y) <= 3){
                    arrowUp.material = greenTexture;
                    setTimeout(function(){arrowUp.material= blackTexture},300);
                    const release = await mutex.acquireQueued();
                    puntuacion +=10;
                    release();
                    flagsUp[kidxUp]=true;
                    kidxUp+=1;
                    scene.remove(target_arrow);
                } else{
                    arrowUp.material = redTexture;
                    setTimeout(function(){arrowUp.material= blackTexture},300);
                    const release = await mutex.acquireQueued();
                    puntuacion -=5;
                    release();
                }
            }
            else if (keyboard.eventMatches(event, 'down')) {
                if(flagsDown[kidxDown] == true){
                    kidxDown = flagsDown.findIndex(element => element === false);
                }
                target_arrow = arrowsDown[kidxDown];
                if(Math.abs(target_arrow.position.y - arrowDown.position.y) <= 3){
                    arrowDown.material = greenTexture;
                    setTimeout(function(){arrowDown.material= blackTexture},300);
                    const release = await mutex.acquireQueued();
                    puntuacion +=10;
                    release();
                    flagsDown[kidxDown]=true;
                    kidxDown+=1;
                    scene.remove(target_arrow);
                }else{
                    arrowDown.material = redTexture;
                    setTimeout(function(){arrowDown.material= blackTexture},300);
                    const release = await mutex.acquireQueued();
                    puntuacion -=5;
                    release();
                }
            }
        }
    });

    // Musica
	audioLoader = new THREE.AudioLoader(manager);
	let listener = new THREE.AudioListener();
	audio = new THREE.Audio(listener);

    // Luces
    let luzAmbiente = new THREE.AmbientLight( 0xffffff, 0.4);
    scene.add(luzAmbiente);

    let luzFocal = new THREE.SpotLight(0xffffff, 5.0 );
    luzFocal.position.set( 0, 16, -5 );
    luzFocal.target.position.set( 0, 0, 0 );

    luzFocal.angle = Math.PI/2;

    luzFocal.penumbra = 0.8;
    luzFocal.castShadow = true;

    scene.add(luzFocal);

    const light = new THREE.PointLight( 0xfff000, 1, 100 );
    light.position.set( 0, 10, -2 );
    light.castShadow = true;
    scene.add( light );

    window.addEventListener('resize', updateAspectRatio );

    // Cargar puntuación
    loadPunctuation();

    // Cargar la habitación
    loadRoom();

    // Cargar flechas
    loadArrowPanel();

    // Cargar controles audio
    setupGui();
}

function updateAspectRatio() {
    let aspectRatio = window.innerWidth/window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );
    if(RESOURCES_LOADED == false){
        loadingScreen.camera.aspect = aspectRatio;
        loadingScreen.camera.updateProjectionMatrix();
    } else{
        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();
    }
}

function update(){
    // Actualizar puntuación
    if(puntuacion_inicial != puntuacion){
        scene.remove(text);
        loadPunctuation();
        puntuacion_inicial = puntuacion;
    }
    audio.setVolume(effectController.volume);
	TWEEN.update();
    renderer.domElement.focus();
    let ahora = Date.now();
    delta = (ahora - antes)/ 1000;
    antes = ahora;
    if(mixer!=null){
        mixer.update(delta);
    }
}

function render(){
    requestAnimationFrame( render );
    update();

    // Distinguir escena de carga y principal
    if(RESOURCES_LOADED == false){
        loadingScreen.box.rotation.z +=0.01;
        renderer.render( loadingScreen.scene, loadingScreen.camera );
    } else{
        renderer.render( scene, camera );
        
    }
}

function loadPunctuation(){
    let fontLoader = new THREE.FontLoader(manager);
    fontLoader.load("fonts/helvetiker_regular.typeface.json",function(tex){ 
        let  textGeo = new THREE.TextGeometry('Score:' + puntuacion, {
                size: 2,
                height: 0,
                curveSegments: 6,
                font: tex,
        });
        let  textMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
        text = new THREE.Mesh(textGeo , textMaterial);
        text.scale.set(0.5,0.5,0.5);
        text.position.set(-26, 40 , -4);
        scene.add(text);
    });
}

function loadArrowPanel(){
    let panel = new THREE.Object3D();
    
    // Crear cuatro directivas
    arrowLeft = arrowGeometry(blackTexture);
    arrowRight = arrowGeometry(blackTexture);
    arrowUp = arrowGeometry(blackTexture);
    arrowDown = arrowGeometry(blackTexture);

    // Posicionarlas
    arrowLeft.position.set(0,20,-5);

    arrowRight.rotation.z = Math.PI;
    arrowRight.position.set(15,20,-5);

    arrowUp.rotation.z = - 90 * Math.PI / 180;
    arrowUp.position.set(-16,23,-5);

    arrowDown.rotation.z = 90 * Math.PI /180;
    arrowDown.position.set(-7,17,-5);

    // Insertarlas
    panel.add(arrowLeft);
    panel.add(arrowRight);
    panel.add(arrowUp);
    panel.add(arrowDown);
    scene.add(panel);
}

function animateArrow(type, i){
    if(type == 'left'){
        let animate = new TWEEN.Tween(arrowsLeft[i].position )
                .to( { x:[0],
                        y:[20],
                        z:[-5]}, timesLeft[i])
                .interpolation( TWEEN.Interpolation.Bezier )
                .easing( TWEEN.Easing.Linear.None )
                .start();

        animate.onComplete(async()=>{
            if(flagsLeft[idxLeft] == false){
                let aux = arrowsLeft[idxLeft];
                scene.remove(aux);
                flagsLeft[idxLeft] = true;
                idxLeft+=1;
                const release = await mutex.acquireQueued();
                puntuacion-=10;
                release();
            }else{
                idxLeft=flagsLeft.findIndex(element => element === false);
            }
        });
    }else if(type =='right'){
        let animate = new TWEEN.Tween( arrowsRight[i].position )
                      .to( { x:[ 15],
	                         y:[ 20],
	                         z:[ -5]}, timesRight[i])
	                  .interpolation( TWEEN.Interpolation.Bezier )
	                  .easing( TWEEN.Easing.Linear.None )
                      .start();
        
        animate.onComplete(async()=>{
            if(flagsRight[idxRight] == false){
                let aux = arrowsRight[idxRight];
                scene.remove(aux);
                flagsRight[idxRight] = true;
                idxRight+=1;
                const release = await mutex.acquireQueued();
                puntuacion-=10;
                release();
            }else{
                idxRight=flagsRight.findIndex(element => element === false);

            }
        });
    }else if(type=='up'){
        let arrow_target = arrowsUp[i];
        let animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[  -16],
	                         y:[ 23],
	                         z:[  -5]}, timesUp[i])
	                  .interpolation( TWEEN.Interpolation.Bezier )
	                  .easing( TWEEN.Easing.Linear.None )
                      .start();
        
        animate.onComplete(async()=>{
            if(flagsUp[idxUp] == false){
                let aux = arrowsUp[idxUp];
                scene.remove(aux);
                flagsUp[idxUp] = true;
                idxUp+=1;
                const release = await mutex.acquireQueued();
                puntuacion-=10;
                release();
            }else{
                idxUp=flagsUp.findIndex(element => element === false);
            }
        });
    }else if(type=='down'){
        let arrow_target = arrowsDown[i];
        let animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[ -7],
	                         y:[ 17],
	                         z:[ -5]}, timesDown[i])
	                  .interpolation( TWEEN.Interpolation.Bezier )
	                  .easing( TWEEN.Easing.Linear.None )
                      .start();
        
        animate.onComplete(async()=>{
            if(flagsDown[idxDown] == false){
                let aux = arrowsDown[idxDown];
                scene.remove(aux);
                flagsDown[idxDown] = true;
                idxDown+=1;
                const release = await mutex.acquireQueued();
                puntuacion-=10;
                release();
            }else{
                idxDown=flagsDown.findIndex(element => element === false);
            }
        });
    }
}


function loadSongArrows(){
    let material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    // Flechas definidas por tiempos en la canción
    // Left arrows
    flagsLeft = [];
    arrowsLeft = [];
    timesLeft = [];
    for(let i = 0;i< 100;i++){
        let aux = arrowGeometry(material);
        aux.position.set(0, 70, -5);
        arrowsLeft.push(aux);
        flagsLeft.push(false);
        let randomTime = ((Math.random()*7000) + 3000);
        timesLeft.push( randomTime );
    }

    // Right arrows
    flagsRight = [];
    arrowsRight = [];
    timesRight = [];
    for(let i = 0;i< 100;i++){
        let aux = arrowGeometry(material);
        aux.rotation.z = Math.PI;
        aux.position.set(15, 70, -5);
        arrowsRight.push(aux);
        flagsRight.push(false);
        let randomTime = ((Math.random()*7000) + 2000);
        timesRight.push(randomTime );
    }

    // Up arrows
    flagsUp = [];
    arrowsUp = [];
    timesUp = [];
    for(let i = 0;i< 100;i++){
        let aux = arrowGeometry(material);
        aux.rotation.z = - 90 * Math.PI / 180;
        aux.position.set(-16, 70, -5);
        arrowsUp.push(aux);
        flagsUp.push(false);
        let randomTime = ((Math.random()*7000) + 3000);
        timesUp.push(randomTime );
    }

    // Down arrows
    flagsDown = [];
    arrowsDown = [];
    timesDown = [];
    for(let i = 0;i< 100;i++){
        let aux = arrowGeometry(material);
        aux.rotation.z = 90 * Math.PI /180;
        aux.position.set(-7, 70, -5);
        arrowsDown.push(aux);
        flagsDown.push(false);
        let randomTime = ((Math.random()*7000 + 2000));
        timesDown.push(randomTime);
    }

    // Add left arrows
    for(let i = 0;i< 77;i++){
       scene.add(arrowsLeft[i]);
    }

    // Add right arrows
    for(let i = 0;i< 77;i++){
        scene.add(arrowsRight[i]);
    }

    // Add up arrows
    for(let i = 0;i< 77;i++){
        scene.add(arrowsUp[i]);
    }

    // Add down arrows
    for(let i = 0;i< 77;i++){
        scene.add(arrowsDown[i]);
    }


    // Indexes
    idxLeft = 0;
    idxRight = 0;
    idxUp = 0;
    idxDown = 0;

    // Animar flechas con Tween
    //Left arrows
    let accumulated_time = 0;
    timeouts = [];
    for(let i = 0; i< arrowsLeft.length; i++){

        let aux = setTimeout(animateArrow.bind(null, 'left', i), accumulated_time);
        timeouts.push(aux);
        accumulated_time += timesLeft[i] + Math.random()*3000;
    }


     //Right arrows
    accumulated_time = 0;
     for(let i = 0; i< arrowsRight.length; i++){
        let aux = setTimeout(animateArrow.bind(null, 'right', i), accumulated_time);
        timeouts.push(aux);
        accumulated_time += timesRight[i] + Math.random()*3000;
    }


     //Up arrows
    accumulated_time = 0;
    for(let i = 0; i< arrowsUp.length; i++){
        let aux = setTimeout(animateArrow.bind(null, 'up', i), accumulated_time);
        timeouts.push(aux);
        accumulated_time += timesUp[i] + Math.random()*3000;
    }

     //Down arrows
    accumulated_time = 0;
    for(let i = 0; i< arrowsDown.length; i++){
        let aux = setTimeout(animateArrow.bind(null, 'down', i), accumulated_time);
        timeouts.push(aux);
        accumulated_time += timesDown[i] + Math.random()*3000;
    }
}

function clearTimeouts(){
    for(let i =0; i< timeouts.length; i++){
        clearTimeout(timeouts[i]);
    }
    timeouts = []
}

function arrowGeometry(material){
    let geom = new THREE.Geometry();
    let vertices = [
        0,0,0,
        2,2,0,
        2,1,0,
        2,-1,0,
        2,-2,0,
        5,1,0,
        5,-1,0,
    ]

    let indexes = [
        0,2,1,
        0,3,2,
        0,4,3,
        2,3,5,
        3,6,5
    ];

    for(let i=0;i<vertices.length; i+=3){
        let vertice = new THREE.Vector3(vertices[i],vertices[i+1], vertices[i+2]);
        geom.vertices.push(vertice);
    }

    for(let i=0;i< indexes.length;i+=3){
        let triangulo = new THREE.Face3(indexes[i], indexes[i+1], indexes[i+2]);
        geom.faces.push(triangulo);
    }

    return new THREE.Mesh( geom, material);
}

function loadSong(){
    if(audio.isPlaying){
        audio.stop();
    }
    let stream = "proyecto_final/songs/vexento _we_are_one.mp3"
    audio.context.suspend();
    audio.context.resume();
	audio.crossOrigin = "anonymous";
	audioLoader.load(stream, function(buffer) {
        audio.repeat = false;
        audio.currentTime = 0;
		audio.setBuffer(buffer);
		audio.play();
        audio.source.onended = function() {
            console.log('Song ended');
            clearTimeouts();
            if(dancing!=null){
                dancing.paused=true;
            }
            kidxLeft = 0;
            kidxRight = 0;
            kidxUp = 0;
            kidxDown = 0;
            idxLeft = 0;
            idxRight = 0;
            idxUp = 0;
            idxDown = 0;
        };
	});
    loadSongArrows();
}


function restartArrows(){
    TWEEN.removeAll();
    for(let i=0; i<arrowsLeft.length;i++){
        scene.remove(arrowsLeft[i]);
    }
    for(let i=0; i<arrowsRight.length;i++){
        scene.remove(arrowsRight[i]);
    }
    for(let i=0; i<arrowsUp.length;i++){
        scene.remove(arrowsUp[i]);
    }
    for(let i=0; i<arrowsDown.length;i++){
        scene.remove(arrowsDown[i]);
    }
}


function setupGui(){
    effectController = {
        startSong: function(){
            clearTimeouts();
            puntuacion = 0;
            if(dancing!=null){
                dancing.paused = false;
            }
            puntuacion = 0;
            kidxLeft = 0;
            kidxRight = 0;
            kidxUp = 0;
            kidxDown = 0;
            idxLeft = 0;
            idxRight = 0;
            idxUp = 0;
            idxDown = 0;
            if(audio.isPlaying){
                restartArrows();
            }
            loadSong();
        },
        volume: 0.5,
        stop: function(){
            clearTimeouts();
            if(dancing!=null){
                dancing.paused=true;
            }
            puntuacion = 0;
            kidxLeft = 0;
            kidxRight = 0;
            kidxUp = 0;
            kidxDown = 0;
            idxLeft = 0;
            idxRight = 0;
            idxUp = 0;
            idxDown = 0;
            if(audio.isPlaying){
                restartArrows();
                audio.stop();
            }
        }
    }

    let gui = new dat.GUI();
    let carpeta = gui.addFolder("Controles");
    carpeta.add(effectController, "startSong").name("Empezar");
    carpeta.add(effectController, "volume",0.0,1.0,0.1).name("Volumen");
    carpeta.add(effectController, "stop").name("Parar");
}


function loadRoom(){
    let path = "images/";
    let txsuelo = new THREE.TextureLoader(manager).load(path + 'chess.jpg');
    txsuelo.magfilter = THREE.LinearFilter;
    txsuelo.minfilter = THREE.LinearFilter;
    txsuelo.repeat.set(4, 4);
    txsuelo.wrapS = txsuelo.wrapT = THREE.RepeatWrapping;
    let bicolor = new THREE.MeshLambertMaterial( {color: 'grey', map: txsuelo});

    let suelo = new THREE.Mesh(new THREE.PlaneGeometry(140, 140, 100, 100), bicolor);
    suelo.rotation.x = -Math.PI/2;
    suelo.castShadow = true;
    suelo.receiveShadow = true;

    let txpared = new THREE.TextureLoader(manager).load(path + 'wall4.jpg');
    txpared.magfilter = THREE.LinearFilter;
    txpared.minfilter = THREE.LinearFilter;
    txpared.repeat.set(2, 2);
    txpared.wrapS = txpared.wrapT = THREE.RepeatWrapping;
    let materialPared1 = new THREE.MeshLambertMaterial( {color: 'orange', map:txpared});
    let materialPared2 = new THREE.MeshLambertMaterial( {color: 0x6a9eda});


    let pared_detras = new THREE.Mesh(new THREE.PlaneGeometry(140, 140, 100, 100), materialPared2);
    pared_detras.position.z = -8;
    pared_detras.castShadow = true;
    pared_detras.receiveShadow = true;

    let pared_lado = new THREE.Mesh(new THREE.PlaneGeometry(120, 120, 100, 100), materialPared2);
    pared_lado.rotation.y = -Math.PI/2;
    pared_lado.position.x = 30;
    pared_lado.castShadow = true;
    pared_lado.receiveShadow = true;


    let pared_lado2 = new THREE.Mesh(new THREE.PlaneGeometry(120, 120, 100, 100), materialPared2);
    pared_lado2.rotation.y = Math.PI/2;
    pared_lado2.position.x = -30;
    pared_lado2.castShadow = true;
    pared_lado2.receiveShadow = true;


    let gltfLoader = new THREE.GLTFLoader(manager);
    gltfLoader.load('proyecto_final/animation/hiphop1.glb', (michelle) =>{
        michelle.scene.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        michelle.scene.rotation.y = Math.PI;
        michelle.scene.scale.set(5,5,5);
        michelle.scene.position.y = 1;
        michelle.scene.position.x = 0.5;
        mixer = new THREE.AnimationMixer(michelle.scene);
        dancing = mixer.clipAction(michelle.animations[0]);
        dancing.play();
        dancing.paused = true;
        scene.add(michelle.scene);
    });

    let txmachine = new THREE.TextureLoader(manager).load('proyecto_final/models/dance/DDR_Diffuse2.png');
    txmachine.flipY = false;
    txmachine.encoding = THREE.sRGBEncoding;
    let lights_down = new THREE.TextureLoader(manager).load('proyecto_final/models/dance/DDR_Emission.png');
    let material = new THREE.MeshStandardMaterial({color:"white", map:txmachine, emissive:lights_down, metalness:0});
    gltfLoader.load('proyecto_final/models/dance/machine.gbl', (danceM) =>{
        danceM.scene.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        danceM.scene.children[0].material = material;        
        danceM.scene.scale.set(200.0,200.0,200.0);
        danceM.scene.position.x = -35;
        danceM.scene.position.z = -1;
        scene.add(danceM.scene);
    });

    gltfLoader.load('proyecto_final/models/air-hockey-arcade/AirHockey.glb', (hockey) =>{
        hockey.scene.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        let children = hockey.scene.children;
        children.shift();
        hockey.scene.children = children;
        hockey.scene.scale.set(3.0, 3.0, 3.0);
        hockey.scene.position.z = 5;
        hockey.scene.position.x = 15;
        scene.add(hockey.scene);
    });

    gltfLoader.load('proyecto_final/models/arcade.glb', (arcade) =>{
        arcade.scene.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        let children = arcade.scene.children;
        children.shift();
        arcade.scene.children = children;
        arcade.scene.rotation.y = -Math.PI;
        arcade.scene.scale.set(1.0, 0.7, 1.0);
        arcade.scene.position.y = 7;
        arcade.scene.position.x = 23;
        arcade.scene.position.z = -4;
        scene.add(arcade.scene);
    });

    gltfLoader.load('proyecto_final/models/tragaperras/tragaperras.glb', (tragaP) =>{
        tragaP.scene.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        tragaP.scene.rotation.y = Math.PI;
     
        tragaP.scene.scale.set(0.6, 0.6, 0.7);
        tragaP.scene.position.x = -20;
        tragaP.scene.position.y = 7.3;
        scene.add(tragaP.scene);
    });

    scene.add(suelo);
    scene.add(pared_detras);
    scene.add(pared_lado);
    scene.add(pared_lado2);
}

init();
render();