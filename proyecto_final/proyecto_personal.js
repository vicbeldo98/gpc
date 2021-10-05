/**
 * TODO: When resize mantain every aspect
 */

var renderer, scene, camera, mini_camera, robot, cameraControls;
var arrowLeft, arrowRight, arrowUp, arrowDown;
var high_point = 100;
var low_point= -10;
var arrowsLeft, arrowsRight, arrowsUp, arrowsDown;
var flagsLeft, flagsRight, flagsUp, flagsDown;
var audio, audioLoader;


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
             // OBTENER DE ALGUNA MANERA SI HAY ALGUNA FLECHA
        }
        if (keyboard.eventMatches(event, 'up')) {
             // OBTENER DE ALGUNA MANERA SI HAY ALGUNA FLECHA
        }
        if (keyboard.eventMatches(event, 'down')) {
             // OBTENER DE ALGUNA MANERA SI HAY ALGUNA FLECHA
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
	TWEEN.update();
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
    arrowLeft.position.set(-9,0,0);

    arrowRight.rotation.z = Math.PI;
    arrowRight.position.set(9,0,0);

    arrowUp.rotation.z = - 90 * Math.PI / 180;
    arrowUp.position.set(0,9,0);

    arrowDown.rotation.z = 90 * Math.PI /180;
    arrowDown.position.set(0,-9,0);

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
    var arrowFake = arrowGeometry(material);
    arrowFake.position.set(-9, high_point, 0);
    var arrowFake2 = arrowGeometry(material);
    arrowFake2.position.set(-9, high_point, 0);
    scene.add(arrowFake);
    scene.add(arrowFake2);
    flagsLeft = [false, false]
    var idxLeft = 0;
    arrowsLeft = [arrowFake, arrowFake2]

    for(var i = 0; i< arrowsLeft.length; i++){
        var arrow_target = arrowsLeft[i];
        var animate = new TWEEN.Tween( arrow_target.position )
                      .to( { x:[   -9,  -9],
	                         y:[   0,    low_point],
	                         z:[   0,  0]}, 5000*(i+1))
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
    console.log(audio);
    //var stream ="https://cdn.rawgit.com/ellenprobst/web-audio-api-with-Threejs/57582104/lib/TheWarOnDrugs.m4a"
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
    //loadSongArrows();
}

function setupGui(){
    effectController = {
        startSong: function(){
            //TODO: REINICIAR TODO
            //TWEEN.removeAll();
            loadSong();
        },
    }

    var gui = new dat.GUI();
    var carpeta = gui.addFolder("Control");
    carpeta.add(effectController, "startSong").name("Reproducir");
}

init();
loadScene();
setupGui();
loadArrowPanel();
render();