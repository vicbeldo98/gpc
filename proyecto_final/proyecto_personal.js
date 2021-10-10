// CONTROLES BÁSICOS
var renderer, scene, camera, mini_camera, robot, cameraControls;

// ANIMACIÓN DE FLECHAS
var arrowLeft, arrowRight, arrowUp, arrowDown;
var flagsLeft, flagsRight, flagsUp, flagsDown;
var kidxLeft, kidxRight, kidxUp, kidxDown;
var idxLeft, idxRight, idxUp, idxDown;
var timesLeft, timesRight, timesUp, timesDown;
var timeouts;



// PUNTUACIÓN
var puntuacion_inicial = 0;
var puntuacion;

// TEXTO DE PUNTUACIÓN
var text;

// CARGA DE MODELOS
var manager;
var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(1.0,1.0,1.0),
        new THREE.MeshBasicMaterial({color:'yellow'})
    )
};
var RESOURCES_LOADED = false;

// ANIMACIÓN DE MICHELLE
var dancing;
var mixer;

// AUDIO
var audio, audioLoader, volume;

// GUI
var effectController;

// TIEMPO
var antes = Date.now();

// TEXTURAS
var blackTexture = new THREE.MeshPhongMaterial( {color: 'black', shininess:250} );
var redTexture = new THREE.MeshPhongMaterial( {color: 'red', shininess:250} );
var greenTexture = new THREE.MeshPhongMaterial( {color: 'green', shininess:250} );



function init(){
    // Inicializar variables
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor ( new THREE.Color(0x000000), 1.0);
    document.body.appendChild( renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.antialias = true;
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    var aspectRatio = window.innerWidth / window.innerHeight;

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
    keyboard.domElement.addEventListener('keydown', function (event) {
        if(!event.repeat & audio.isPlaying){
            if (keyboard.eventMatches(event, 'left')) {
                if(flagsLeft[kidxLeft] == true){
                    kidxLeft=flagsLeft.findIndex(element => element === false);
                }
                target_arrow = arrowsLeft[kidxLeft];
                if(Math.abs(target_arrow.position.y - arrowLeft.position.y) <= 3){
                    arrowLeft.material = greenTexture;
                    let aux = setTimeout(function(){arrowLeft.material= blackTexture},300);
                    puntuacion +=10;
                    flagsLeft[kidxLeft]=true;
                    kidxLeft+=1;
                    scene.remove(target_arrow);
                }else{
                    arrowLeft.material = redTexture;
                    setTimeout(function(){arrowLeft.material= blackTexture},300);
                    puntuacion -=5;
                }
            }
            if (keyboard.eventMatches(event, 'right')) {
                if(flagsRight[kidxRight] == true){
                    kidxRight=flagsRight.findIndex(element => element === false);

                }
                target_arrow = arrowsRight[kidxRight];
                if(Math.abs(target_arrow.position.y - arrowRight.position.y) <= 3){
                    arrowRight.material = greenTexture;
                    setTimeout(function(){arrowRight.material= blackTexture},300);
                    puntuacion +=10;
                    flagsRight[kidxRight]=true;
                    kidxRight+=1;
                    scene.remove(target_arrow);
                } else{
                    arrowRight.material = redTexture;
                    setTimeout(function(){arrowRight.material= blackTexture},300);
                    puntuacion -=5;
                }
            }
            if (keyboard.eventMatches(event, 'up')) {
                if(flagsUp[kidxUp] == true){
                    kidxUp=flagsUp.findIndex(element => element === false);
                }
                target_arrow = arrowsUp[kidxUp];
                if(Math.abs(target_arrow.position.y - arrowUp.position.y) <= 3){
                    arrowUp.material = greenTexture;
                    setTimeout(function(){arrowUp.material= blackTexture},300);
                    puntuacion +=10;
                    flagsUp[kidxUp]=true;
                    kidxUp+=1;
                    scene.remove(target_arrow);
                } else{
                    arrowUp.material = redTexture;
                    setTimeout(function(){arrowUp.material= blackTexture},300);
                    puntuacion -=5;
                }
            }
            if (keyboard.eventMatches(event, 'down')) {
                if(flagsDown[kidxDown] == true){
                    kidxDown = flagsDown.findIndex(element => element === false);
                }
                target_arrow = arrowsDown[kidxDown];
                if(Math.abs(target_arrow.position.y - arrowDown.position.y) <= 3){
                    arrowDown.material = greenTexture;
                    setTimeout(function(){arrowDown.material= blackTexture},300);
                    puntuacion +=10;
                    flagsDown[kidxDown]=true;
                    kidxDown+=1;
                    scene.remove(target_arrow);
                }else{
                    arrowDown.material = redTexture;
                    setTimeout(function(){arrowDown.material= blackTexture},300);
                    puntuacion -=5;
                }
            }
        }
    });

    // Musica
	audioLoader = new THREE.AudioLoader(manager);
	var listener = new THREE.AudioListener();
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
    renderer.setSize( window.innerWidth, window.innerHeight );
    let aspectRatio = window.innerWidth/window.innerHeight;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
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
    var ahora = Date.now();
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
    var fontLoader = new THREE.FontLoader(manager);
    fontLoader.load("fonts/helvetiker_regular.typeface.json",function(tex){ 
        var  textGeo = new THREE.TextGeometry('Score:' + puntuacion, {
                size: 2,
                height: 0,
                curveSegments: 6,
                font: tex,
        });
        var  textMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
        text = new THREE.Mesh(textGeo , textMaterial);
        text.scale.set(0.5,0.5,0.5);
        text.position.set(-26, 40 , -4);
        scene.add(text);
    });
}

function loadArrowPanel(){
    var panel = new THREE.Object3D();
    
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

        animate.onComplete(function() {
            if(flagsLeft[idxLeft] == false){
                var aux = arrowsLeft[idxLeft];
                scene.remove(aux);
                flagsLeft[idxLeft] = true;
                idxLeft+=1;
                puntuacion-=10;
            }else{
                idxLeft=flagsLeft.findIndex(element => element === false);
            }
        });
    }else if(type =='right'){
        var animate = new TWEEN.Tween( arrowsRight[i].position )
                      .to( { x:[ 15],
	                         y:[ 20],
	                         z:[ -5]}, timesRight[i])
	                  .interpolation( TWEEN.Interpolation.Bezier )
	                  .easing( TWEEN.Easing.Linear.None )
                      .start();
        
        animate.onComplete( function() {
            if(flagsRight[idxRight] == false){
                var aux = arrowsRight[idxRight];
                scene.remove(aux);
                flagsRight[idxRight] = true;
                idxRight+=1;
                puntuacion-=10;
            }else{
                idxRight=flagsRight.findIndex(element => element === false);

            }
        });
    }else if(type=='up'){
        var arrow_target = arrowsUp[i];
        var animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[  -16],
	                         y:[ 23],
	                         z:[  -5]}, timesUp[i])
	                  .interpolation( TWEEN.Interpolation.Bezier )
	                  .easing( TWEEN.Easing.Linear.None )
                      .start();
        
        animate.onComplete( function() {
            if(flagsUp[idxUp] == false){
                var aux = arrowsUp[idxUp];
                scene.remove(aux);
                flagsUp[idxUp] = true;
                idxUp+=1;
                puntuacion-=10;
            }else{
                idxUp=flagsUp.findIndex(element => element === false);
            }
        });
    }else if(type=='down'){
        var arrow_target = arrowsDown[i];
        var animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[ -7],
	                         y:[ 17],
	                         z:[ -5]}, timesDown[i])
	                  .interpolation( TWEEN.Interpolation.Bezier )
	                  .easing( TWEEN.Easing.Linear.None )
                      .start();
        
        animate.onComplete( function() {
            if(flagsDown[idxDown] == false){
                var aux = arrowsDown[idxDown];
                scene.remove(aux);
                flagsDown[idxDown] = true;
                idxDown+=1;
                puntuacion-=10;
            }else{
                idxDown=flagsDown.findIndex(element => element === false);
            }
        });
    }
}


function loadSongArrows(){
    var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    // Flechas definidas por tiempos en la canción
    // Left arrows
    flagsLeft = [];
    arrowsLeft = [];
    timesLeft = [];
    for(var i = 0;i< 100;i++){
        var aux = arrowGeometry(material);
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
    for(var i = 0;i< 100;i++){
        var aux = arrowGeometry(material);
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
    for(var i = 0;i< 100;i++){
        var aux = arrowGeometry(material);
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
    for(var i = 0;i< 100;i++){
        var aux = arrowGeometry(material);
        aux.rotation.z = 90 * Math.PI /180;
        aux.position.set(-7, 70, -5);
        arrowsDown.push(aux);
        flagsDown.push(false);
        let randomTime = ((Math.random()*7000 + 2000));
        timesDown.push(randomTime);
    }

    // Add left arrows
    for(var i = 0;i< 77;i++){
       scene.add(arrowsLeft[i]);
    }

    // Add right arrows
    for(var i = 0;i< 77;i++){
        scene.add(arrowsRight[i]);
    }

    // Add up arrows
    for(var i = 0;i< 77;i++){
        scene.add(arrowsUp[i]);
    }

    // Add down arrows
    for(var i = 0;i< 77;i++){
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
    for(var i = 0; i< arrowsLeft.length; i++){

        var aux = setTimeout(animateArrow.bind(null, 'left', i), accumulated_time);
        timeouts.push(aux);
        accumulated_time += timesLeft[i] + Math.random()*3000;
    }


     //Right arrows
    accumulated_time = 0;
     for(var i = 0; i< arrowsRight.length; i++){
        var aux = setTimeout(animateArrow.bind(null, 'right', i), accumulated_time);
        timeouts.push(aux);
        accumulated_time += timesRight[i] + Math.random()*3000;
    }


     //Up arrows
    accumulated_time = 0;
    for(var i = 0; i< arrowsUp.length; i++){
        var aux = setTimeout(animateArrow.bind(null, 'up', i), accumulated_time);
        timeouts.push(aux);
        accumulated_time += timesUp[i] + Math.random()*3000;
    }

     //Down arrows
    accumulated_time = 0;
    for(var i = 0; i< arrowsDown.length; i++){
        var aux = setTimeout(animateArrow.bind(null, 'down', i), accumulated_time);
        timeouts.push(aux);
        accumulated_time += timesDown[i] + Math.random()*3000;
    }
}

function clearTimeouts(){
    for(var i =0; i< timeouts.length; i++){
        clearTimeout(timeouts[i]);
    }
    timeouts = []
}

function arrowGeometry(material){
    var geom = new THREE.Geometry();
    var vertices = [
        0,0,0,
        2,2,0,
        2,1,0,
        2,-1,0,
        2,-2,0,
        5,1,0,
        5,-1,0,
    ]

    var indexes = [
        0,2,1,
        0,3,2,
        0,4,3,
        2,3,5,
        3,6,5
    ];

    for(var i=0;i<vertices.length; i+=3){
        var vertice = new THREE.Vector3(vertices[i],vertices[i+1], vertices[i+2]);
        geom.vertices.push(vertice);
    }

    for(var i=0;i< indexes.length;i+=3){
        var triangulo = new THREE.Face3(indexes[i], indexes[i+1], indexes[i+2]);
        geom.faces.push(triangulo);
    }

    return new THREE.Mesh( geom, material);
}

function loadSong(){
    if(audio.isPlaying){
        audio.stop();
    }
    var stream = "proyecto_final/songs/darude_sandstorm.ogg"
    audio.context.suspend();
    audio.context.resume();
	audio.crossOrigin = "anonymous";
	audioLoader.load(stream, function(buffer) {
        audio.repeat = false;
        audio.currentTime = 0;
		audio.setBuffer(buffer);
		audio.play();
        audio.source.onended = function() {
            console.log('Darude sandstorm ended');
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
    for(var i=0; i<arrowsLeft.length;i++){
        scene.remove(arrowsLeft[i]);
    }
    for(var i=0; i<arrowsRight.length;i++){
        scene.remove(arrowsRight[i]);
    }
    for(var i=0; i<arrowsUp.length;i++){
        scene.remove(arrowsUp[i]);
    }
    for(var i=0; i<arrowsDown.length;i++){
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

    var gui = new dat.GUI();
    var carpeta = gui.addFolder("Controles");
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
    var material = new THREE.MeshStandardMaterial({color:"white", map:txmachine, emissive:lights_down, metalness:0});
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
        var children = hockey.scene.children;
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
        var children = arcade.scene.children;
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