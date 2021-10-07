/**
 * TODO: When resize mantain every aspect
 * TODO: MAKE SURE WHEN YOU STOP EVERY VARIABLE IS RESETTED BEFORE START AGAIN
 */
var renderer, scene, camera, mini_camera, robot, cameraControls;
var arrowLeft, arrowRight, arrowUp, arrowDown;
var arrowsLeft, arrowsRight, arrowsUp, arrowsDown;
var flagsLeft, flagsRight, flagsUp, flagsDown;

var antes = Date.now();

// ANIMATION
var mixer;

// AUDIO
var audio, audioLoader, volume;

// GUI
var effectController;


function init(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor ( new THREE.Color(0xFFFFFF), 1.0);
    document.body.appendChild( renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.antialias = true;
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(1000));

    var aspectRatio = window.innerWidth / window.innerHeight;

    // Create main camera
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
    camera.position.set(0,20,40);
    camera.lookAt(0,20,0);

    //var cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    //cameraControls.target.set(0,0,0);

    // Controls for capturing keyboard
    keyboard = new THREEx.KeyboardState(renderer.domElement);
    renderer.domElement.setAttribute("tabIndex", "0");
    renderer.domElement.focus();
    var idxLeft = 0;
    var idxRight = 0;
    var idxUp = 0;
    var idxDown = 0;
    keyboard.domElement.addEventListener('keydown', function (event) {
        if (keyboard.eventMatches(event, 'left')) {
            if(flagsLeft[idxLeft] == true){
                idxLeft=flagsLeft.findIndex(element => element === false);
            }
            target_arrow = arrowsLeft[idxLeft];
            if(Math.abs(target_arrow.position.y - arrowLeft.position.y) <= 3){
                flagsLeft[idxLeft]=true;
                idxLeft+=1;
                scene.remove(target_arrow);
            }
        }
        if (keyboard.eventMatches(event, 'right')) {
            if(flagsRight[idxRight] == true){
                idxRight=flagsRight.findIndex(element => element === false);

            }
            target_arrow = arrowsRight[idxRight];
            if(Math.abs(target_arrow.position.y - arrowRight.position.y) <= 3){
                flagsRight[idxRight]=true;
                idxRight+=1;
                scene.remove(target_arrow);
            }
        }
        if (keyboard.eventMatches(event, 'up')) {
            if(flagsUp[idxUp] == true){
                idxUp=flagsUp.findIndex(element => element === false);
            }
            target_arrow = arrowsUp[idxUp];
            if(Math.abs(target_arrow.position.y - arrowUp.position.y) <= 3){
                flagsUp[idxUp]=true;
                idxUp+=1;
                scene.remove(target_arrow);
            }
        }
        if (keyboard.eventMatches(event, 'down')) {
            if(flagsDown[idxDown] == true){
                idxDown = flagsDown.findIndex(element => element === false);
            }
            target_arrow = arrowsDown[idxDown];
            if(Math.abs(target_arrow.position.y - arrowDown.position.y) <= 3){
                flagsDown[idxDown]=true;
                idxDown+=1;
                scene.remove(target_arrow);
            }
        }
    });

    //  Music definition
	audioLoader = new THREE.AudioLoader();
	var listener = new THREE.AudioListener();
	audio = new THREE.Audio(listener);

    //Luces
    let luzAmbiente = new THREE.AmbientLight( 0xffffff, 0.5);
    scene.add(luzAmbiente);

    /*let luzFocal = new THREE.SpotLight( 0xffffff, 0.8 );
    luzFocal.position.set( 0, 15, 20 );
    luzFocal.target.position.set( 0, 0, 0 );

    luzFocal.angle = Math.PI;

    // La penumbra aporta calidad en el paso de luz a sombra (a 0 queda mal)
    luzFocal.penumbra = 0.8;
    luzFocal.castShadow = true;
    scene.add(luzFocal);*/

    scene.add(luzAmbiente);

    /*const light = new THREE.PointLight( 0xff0000, 1, 100 );
    light.position.set( 0, 0, 0 );
    scene.add( light );*/
}

function loadScene(){    
}

function update(){
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
    renderer.render( scene, camera );
}


function loadArrowPanel(){
    var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    var panel = new THREE.Object3D();
    
    // Create the four directives
    arrowLeft = arrowGeometry(material);
    arrowRight = arrowGeometry(material);
    arrowUp = arrowGeometry(material);
    arrowDown = arrowGeometry(material);

    // Position them
    arrowLeft.position.set(0,20,-5);

    arrowRight.rotation.z = Math.PI;
    arrowRight.position.set(16,20,-5);

    arrowUp.rotation.z = - 90 * Math.PI / 180;
    arrowUp.position.set(-16,23,-5);

    arrowDown.rotation.z = 90 * Math.PI /180;
    arrowDown.position.set(-8,17,-5);

    // Insert arrows in the scene
    panel.add(arrowLeft);
    panel.add(arrowRight);
    panel.add(arrowUp);
    panel.add(arrowDown);
    scene.add(panel);
}


function loadSongArrows(){
    var material = new THREE.MeshBasicMaterial( {color: 0x000000} );

    // Arrows defined for times of the song
    // Define left arrows
    flagsLeft = [];
    arrowsLeft = [];
    var timesLeft = [];
    for(var i = 0;i< 77;i++){
        var aux = arrowGeometry(material);
        aux.position.set(0, 100*i, -5);
        arrowsLeft.push(aux);
        flagsLeft.push(false);
        timesLeft.push(4000*i);
    }

    // Define right arrows
    flagsRight = [];
    arrowsRight = [];
    var timesRight = [];
    for(var i = 0;i< 77;i++){
        var aux = arrowGeometry(material);
        aux.rotation.z = Math.PI;
        aux.position.set(16, 100*i, -5);
        arrowsRight.push(aux);
        flagsRight.push(false);
        timesRight.push(7000*i);
    }

    // Define up arrows
    flagsUp = [];
    arrowsUp = [];
    var timesUp = [];
    for(var i = 0;i< 77;i++){
        var aux = arrowGeometry(material);
        aux.rotation.z = - 90 * Math.PI / 180;
        aux.position.set(-16, 100*i, -5);
        arrowsUp.push(aux);
        flagsUp.push(false);
        timesUp.push(13000*i);
    }

    // Define down arrows
    flagsDown = [];
    arrowsDown = [];
    var timesDown = [];
    for(var i = 0;i< 77;i++){
        var aux = arrowGeometry(material);
        aux.rotation.z = 90 * Math.PI /180;
        aux.position.set(-8, 100*i, -5);
        arrowsDown.push(aux);
        flagsDown.push(false);
        timesDown.push(5000*i);
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
    var idxLeft = 0;
    var idxRight = 0;
    var idxUp = 0;
    var idxDown = 0;

    // Animate arrows with Tween

    //Left arrows
    for(var i = 0; i< arrowsLeft.length; i++){
        var arrow_target = arrowsLeft[i];
        var animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[   0,  0],
	                         y:[   20, 20],
	                         z:[   -5,  -5]}, timesLeft[i])
	                  .interpolation( TWEEN.Interpolation.Bezier )
	                  .easing( TWEEN.Easing.Linear.None )
                      .start();
        
        animate.onComplete( function() {
            if(flagsLeft[idxLeft] == false){
                var aux = arrowsLeft[idxLeft];
                scene.remove(aux);
                flagsLeft[idxLeft] = true;
                idxLeft+=1;
            }else{
                idxLeft=flagsLeft.findIndex(element => element === false);

            }
        });
    }


     //Right arrows
     for(var i = 0; i< arrowsRight.length; i++){
        var arrow_target = arrowsRight[i];
        var animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[   16, 16],
	                         y:[   20, 20],
	                         z:[   -5,  -5]}, timesRight[i])
	                  .interpolation( TWEEN.Interpolation.Bezier )
	                  .easing( TWEEN.Easing.Linear.None )
                      .start();
        
        animate.onComplete( function() {
            if(flagsRight[idxRight] == false){
                var aux = arrowsRight[idxRight];
                scene.remove(aux);
                flagsRight[idxRight] = true;
                idxRight+=1;
            }else{
                idxRight=flagsRight.findIndex(element => element === false);

            }
        });
    }


     //Up arrows
     for(var i = 0; i< arrowsUp.length; i++){
        var arrow_target = arrowsUp[i];
        var animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[   -16,  -16],
	                         y:[   23, 23],
	                         z:[   -5,  -5]}, timesUp[i])
	                  .interpolation( TWEEN.Interpolation.Bezier )
	                  .easing( TWEEN.Easing.Linear.None )
                      .start();
        
        animate.onComplete( function() {
            if(flagsUp[idxUp] == false){
                var aux = arrowsUp[idxUp];
                scene.remove(aux);
                flagsUp[idxUp] = true;
                idxUp+=1;
            }else{
                idxUp=flagsUp.findIndex(element => element === false);
            }
        });
    }


     //Down arrows
     for(var i = 0; i< arrowsDown.length; i++){
        var arrow_target = arrowsDown[i];
        var animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[   -8,  -8],
	                         y:[  17, 17],
	                         z:[   -5,  -5]}, timesDown[i])
	                  .interpolation( TWEEN.Interpolation.Bezier )
	                  .easing( TWEEN.Easing.Linear.None )
                      .start();
        
        animate.onComplete( function() {
            if(flagsDown[idxDown] == false){
                var aux = arrowsDown[idxDown];
                scene.remove(aux);
                flagsDown[idxDown] = true;
                idxDown+=1;
            }else{
                idxDown=flagsDown.findIndex(element => element === false);
            }
        });
    }
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
            if(audio.isPlaying){
                restartArrows();
            }
            loadSong();
        },
        volume: 0.5,
        stop: function(){
            if(audio.isPlaying){
                restartArrows();
                audio.stop();
            }
        }
    }

    var gui = new dat.GUI();
    var carpeta = gui.addFolder("Controles Música");
    carpeta.add(effectController, "startSong").name("Play");
    carpeta.add(effectController, "volume",0.0,1.0,0.1).name("Volumen");
    carpeta.add(effectController, "stop").name("Parar");
}

function loadModel(){
    let gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load('proyecto_final/animation/michelle.glb', (michelle) =>{
        michelle.scene.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        //renderer.gammaOutput = true;
        michelle.scene.rotation.y = Math.PI;
        michelle.scene.scale.set(5,5,5);
        michelle.scene.position.y = 1;
        mixer = new THREE.AnimationMixer(michelle.scene);
        const dancing = mixer.clipAction(michelle.animations[0]);
        dancing.play();
        scene.add(michelle.scene);
    });
}


function loadRoom(){
    let path = "images/";
    let txsuelo = new THREE.TextureLoader().load(path + 'chess.jpg');
    txsuelo.magfilter = THREE.LinearFilter;
    txsuelo.minfilter = THREE.LinearFilter;
    txsuelo.repeat.set(4, 4);
    txsuelo.wrapS = txsuelo.wrapT = THREE.RepeatWrapping;
    let materialBrillante = new THREE.MeshPhongMaterial( {color: 'white', specular: 'white', shininess: 30, map: txsuelo});

    let suelo = new THREE.Mesh(new THREE.PlaneGeometry(140, 140, 100, 100), materialBrillante);
    suelo.rotation.x = -Math.PI/2;
    suelo.castShadow = true;
    suelo.receiveShadow = true;

    let txpared = new THREE.TextureLoader().load(path + 'paredfrente.jpg');
    txpared.magfilter = THREE.LinearFilter;
    txpared.minfilter = THREE.LinearFilter;
    txpared.repeat.set(4, 4);
    txpared.wrapS = txpared.wrapT = THREE.RepeatWrapping;
    let materialPared1 = new THREE.MeshLambertMaterial( {color: 'grey',map:txpared});
    let materialPared2 = new THREE.MeshBasicMaterial( {color: 'yellow'});


    let pared_detras = new THREE.Mesh(new THREE.PlaneGeometry(140, 140, 100, 100), materialPared2);
    pared_detras.position.z = -8;
    pared_detras.castShadow = true;
    pared_detras.receiveShadow = true;

    let pared_lado = new THREE.Mesh(new THREE.PlaneGeometry(140, 140, 100, 100), materialPared1);
    pared_lado.rotation.y = -Math.PI/2;
    pared_lado.position.x = 20;
    pared_lado.castShadow = true;
    pared_lado.receiveShadow = true;


    let pared_lado2 = new THREE.Mesh(new THREE.PlaneGeometry(140, 140, 100, 100), materialPared1);
    pared_lado2.rotation.y = Math.PI/2;
    pared_lado2.position.x = -30;
    pared_lado2.castShadow = true;
    pared_lado2.receiveShadow = true;


    let txmachine = new THREE.TextureLoader().load('proyecto_final/models/dance/DDR_Diffuse2.png');
    txmachine.flipY = false;
    txmachine.encoding = THREE.sRGBEncoding;
    let lights_down = new THREE.TextureLoader().load('proyecto_final/models/dance/DDR_Emission.png');
    var material = new THREE.MeshStandardMaterial({color:"white", map:txmachine, emissive:lights_down, metalness:0});
    let gltfLoader = new THREE.GLTFLoader();
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
        hockey.scene.position.z = 15;
        hockey.scene.position.x = -5;
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
        arcade.scene.position.x = 15;
        arcade.scene.position.z = -4;
        scene.add(arcade.scene);
    });

    gltfLoader.load('proyecto_final/models/tragaperras/tragaperras.glb', (tragaP) =>{
        tragaP.scene.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        tragaP.scene.rotation.y = Math.PI/2;
     
        tragaP.scene.scale.set(0.6, 0.6, 0.7);
        tragaP.scene.position.x = 12;
        tragaP.scene.position.z = 8;
        tragaP.scene.position.y = 7.3;
        scene.add(tragaP.scene);
    });

    gltfLoader.load('proyecto_final/models/table/TableArcade.glb', (table) =>{
        table.scene.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
        });

        let materialBase = new THREE.MeshPhongMaterial({color: 0xc60505, shininess:150});
        table.scene.children[2].material = materialBase;
        table.scene.children[8].material = materialBase;

        let materialUp = new THREE.MeshLambertMaterial( { color: 'black'} );
        table.scene.children[3].material = materialUp;

        var children = table.scene.children;
        children.pop();
        table.scene.children = children;
        table.scene.rotation.y = -Math.PI;
        table.scene.scale.set(2.5, 2.0, 2.5);
        table.scene.position.x = 10;
        table.scene.position.z = 18;
        scene.add(table.scene);
    });

    scene.add(suelo);
    scene.add(pared_detras);
    scene.add(pared_lado);
    scene.add(pared_lado2);
}

init();
loadScene();
loadRoom();
loadModel();
setupGui();
loadArrowPanel();
render();