var renderer, scene, camera, mini_camera, robot, cameraControls;

function init(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor ( new THREE.Color(0xFFFFFF), 1.0);
    document.body.appendChild( renderer.domElement);

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;

    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
    camera.position.set(0,0,100);
    camera.lookAt(0,0,0);

    scene.add(new THREE.AxesHelper(1000));

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
    arrowFake.position.set(-9,30,0);
    scene.add(arrowFake);
    arrows = {
        'right': [arrowFake],
    }

    for(var i = 0; i< arrows['right'].length; i++){
        new TWEEN.Tween( arrows['right'][i].position )
                 .to( { x:[   -9,  -9],
	                    y:[   25,    0],
	                    z:[   0,  0]}, 1000)
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