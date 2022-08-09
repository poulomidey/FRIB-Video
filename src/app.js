import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {setup} from "./setup.js";
import {create_nucleus, create_foil, animations, choose_wait_time} from "./animations.js";

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

    // let wait_time = 5000 * i;
    create_foil(animation);
    // const wait_time = 0; //wait time not working bc function doens't change value of parameter (copy not reference). When you fix this, remove wait time from the parameter of animations and put it back inside.
    // choose_wait_time(wait_time, 20000);
    // console.log(wait_time);
    const wait_time = choose_wait_time(20000);
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