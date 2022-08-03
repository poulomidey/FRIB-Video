import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {setup} from "./setup.js";
import {create_nucleus, create_foil, animations} from "./animations.js";

let {scene, camera, renderer, controls} = setup();

const p = 50; //note that all the nuclei are the same size
const n = 50;
const r = 5;

for(let i = 0; i < 3; i++)
{
    const nucleus = new THREE.Group();
    create_nucleus(nucleus, r, p, n);
    scene.add(nucleus);
    
    const animation = new THREE.Group()
    
    let wait_time = 5000 * i;
    create_foil(animation);
    animations(animation, nucleus, r, p, n, wait_time);
    scene.add(animation);
}

function animate() {
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);
    // controls.update(.05); //flycontrols
};

animate();