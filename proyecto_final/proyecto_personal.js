/**
 * TODO: When resize mantain every aspect
 */

var renderer, scene, camera, mini_camera, robot, cameraControls;
var arrowLeft, arrowRight, arrowUp, arrowDown;
var high_point = 100;
var low_point= -100;

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
    keyboard.domElement.addEventListener('keydown', function (event) {
        if (keyboard.eventMatches(event, 'left')) {
            var x = -9;
	        var y = 0;
            let rayo = new THREE.Raycaster();
            rayo.setFromCamera(new THREE.Vector2(x,y), camera );

            // El true indica si se hace en profundidad, es decir, que no solo lo
            // haga con el primer nivel, sino de manera recursiva
            let intersecciones = rayo.intersectObjects( scene.children, true );
            if(intersecciones.length>1){
                console.log('****************');
                console.log(intersecciones);
            }
            /*if(arrowLeft.isSameNode(topElt)) console.log('no overlapping');
            else console.log('overlapping');*/
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
    arrowFake = arrowGeometry(material);
    arrowFake.position.set(-9, high_point, 0);
    scene.add(arrowFake);
    arrows = {
        'right': [arrowFake],
    }

    for(var i = 0; i< arrows['right'].length; i++){
        new TWEEN.Tween( arrows['right'][i].position )
                 .to( { x:[   -9,  -9],
	                    y:[   0,    low_point],
	                    z:[   0,  0]}, 10000)
	             .interpolation( TWEEN.Interpolation.Bezier )
	             .easing( TWEEN.Easing.Linear.None )
                 .start();
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

init();
loadScene();
loadArrowPanel();
loadSongArrows();
render();