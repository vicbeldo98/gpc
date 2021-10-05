/**
 * TODO: When resize mantain every aspect
 */

var renderer, scene, camera, mini_camera, robot, cameraControls;
var arrowLeft, arrowRight, arrowUp, arrowDown;
var arrowsLeft, arrowsRight, arrowsUp, arrowsDown;
var flagsLeft, flagsRight, flagsUp, flagsDown;

// AUDIO
var audio, audioLoader, volume;

// GUI
var effectController;


function init(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor ( new THREE.Color(0xFFFFFF), 1.0);
    document.body.appendChild( renderer.domElement);

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(1000));

    var aspectRatio = window.innerWidth / window.innerHeight;

    // Create main camera
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
    camera.position.set(0,0,100);
    camera.lookAt(0,0,0);

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
                idxLeft+=1;
            }
            target_arrow = arrowsLeft[idxLeft];
            if(Math.abs(target_arrow.position.y - arrowLeft.position.y) < 3){
                flagsLeft[idxLeft]=true;
                idxLeft+=1;
                scene.remove(target_arrow);
            }
        }
        if (keyboard.eventMatches(event, 'right')) {
            if(flagsRight[idxRight] == true){
                idxRight+=1;
            }
            target_arrow = arrowsRight[idxRight];
            if(Math.abs(target_arrow.position.y - arrowRight.position.y) < 3){
                flagsRight[idxRight]=true;
                idxRight+=1;
                scene.remove(target_arrow);
            }
        }
        if (keyboard.eventMatches(event, 'up')) {
            if(flagsUp[idxUp] == true){
                idxUp+=1;
            }
            target_arrow = arrowsUp[idxUp];
            if(Math.abs(target_arrow.position.y - arrowUp.position.y) < 3){
                flagsUp[idxUp]=true;
                idxUp+=1;
                scene.remove(target_arrow);
            }
        }
        if (keyboard.eventMatches(event, 'down')) {
            if(flagsDown[idxDown] == true){
                idxDown+=1;
            }
            target_arrow = arrowsDown[idxDown];
            if(Math.abs(target_arrow.position.y - arrowDown.position.y) < 3){
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
}

function loadScene(){    
}

function update(){
    audio.setVolume(effectController.volume);
	TWEEN.update();
    renderer.domElement.focus();
}

function render(){
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}


function loadArrowPanel(){
    var material = new THREE.MeshBasicMaterial( {color: 0x000000, wireframe: true} );
    var panel = new THREE.Object3D();
    
    // Create the four directives
    arrowLeft = arrowGeometry(material);
    arrowRight = arrowGeometry(material);
    arrowUp = arrowGeometry(material);
    arrowDown = arrowGeometry(material);

    // Position them
    arrowLeft.position.set(0,0,0);

    arrowRight.rotation.z = Math.PI;
    arrowRight.position.set(16,0,0);

    arrowUp.rotation.z = - 90 * Math.PI / 180;
    arrowUp.position.set(-16,3,0);

    arrowDown.rotation.z = 90 * Math.PI /180;
    arrowDown.position.set(-8,-3,0);

    // Insert arrows in the scene
    panel.add(arrowLeft);
    panel.add(arrowRight);
    panel.add(arrowUp);
    panel.add(arrowDown);
    scene.add(panel);
}


function loadSongArrows(){
    var material = new THREE.MeshBasicMaterial( {color: 0x000000, wireframe: true} );

    // Arrows defined for times of the song
    // Define left arrows
    flagsLeft = [];
    arrowsLeft = [];
    var timesLeft = [];
    for(var i = 0;i< 77;i++){
        var aux = arrowGeometry(material);
        aux.position.set(0, 100*i, 0);
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
        aux.position.set(16, 100*i, 0);
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
        aux.position.set(-16, 100*i, 0);
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
        aux.position.set(-8, 100*i, 0);
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
	                         y:[   0, -4],
	                         z:[   0,  0]}, timesLeft[i])
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
                idxLeft+=1;
            }
        });
    }


     //Right arrows
     for(var i = 0; i< arrowsRight.length; i++){
        var arrow_target = arrowsRight[i];
        var animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[   16, 16],
	                         y:[   0, -4],
	                         z:[   0,  0]}, timesRight[i])
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
                idxRight+=1;
            }
        });
    }


     //Up arrows
     for(var i = 0; i< arrowsUp.length; i++){
        var arrow_target = arrowsUp[i];
        var animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[   -16,  -16],
	                         y:[   3, -1],
	                         z:[   0,  0]}, timesUp[i])
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
                idxUp+=1;
            }
        });
    }


     //Down arrows
     for(var i = 0; i< arrowsDown.length; i++){
        var arrow_target = arrowsDown[i];
        var animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[   -8,  -8],
	                         y:[  -3, -7],
	                         z:[   0,  0]}, timesDown[i])
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
                idxDown+=1;
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
    var stream ="https://cdn.rawgit.com/ellenprobst/web-audio-api-with-Threejs/57582104/lib/TheWarOnDrugs.m4a"
    // var stream = "proyecto_final/songs/darude_sandstorm.ogg"
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

init();
loadScene();
setupGui();
loadArrowPanel();
render();