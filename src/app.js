import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {setup} from "./setup.js";

let {scene, camera, renderer, controls} = setup();

function create_nucleus(nucleus, radius, proton, neutron)
{
    const volume = (proton + neutron) * (4.0/3) * (radius**3) * 2.5; //arbritrary factor of 2.5 allows for space bw the nucleons. Can change number.
    //However, this method makes it so if there are more nucleons, the spacing bw particles is condensed.
    const n_radius = Math.cbrt(.75 * (1/Math.PI) * volume);
    // nucleus.add(new THREE.Mesh( new THREE.SphereGeometry(n_radius, 32, 16)));

    let nucleon;
    for(let i = 0; i < proton + neutron; i++)
    {
        if(i < proton)
        {
            nucleon = new THREE.Mesh( new THREE.SphereGeometry(radius, 32, 16), new THREE.MeshLambertMaterial({color : 0x00FF80}));
        }
        else
        {
            nucleon = new THREE.Mesh( new THREE.SphereGeometry(radius, 32, 16), new THREE.MeshLambertMaterial({color : 0xFFEF00}));
        }
        const rho = Math.random() * n_radius;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * Math.PI;
        nucleon.position.set(rho * Math.sin(phi) * Math.cos(theta), rho * Math.sin(phi) * Math.sin(theta), rho * Math.cos(phi));
        nucleus.add(nucleon);
    }
};

function create_foil(animation)
{
    const foil = new THREE.Mesh( new THREE.BoxGeometry(5, 300, 300), new THREE.MeshLambertMaterial({color : 0xC3C3C1}));
    animation.add(foil);

    //maybe to make a new one it can call a function?? how do you get it work not on a loop. Maybe have five ones on a loop?
};

function animations(animation, nucleus)
{
    const boundingBox = new THREE.Box3().setFromObject(nucleus);
    let dimensions = new THREE.Vector3();
    boundingBox.getSize(dimensions);

    const flash = new THREE.Mesh( new THREE.CylinderGeometry(dimensions.z/2 * 1.5, dimensions.z/2 * 1.5, 5.5, 32), new THREE.MeshBasicMaterial( { color : 0x7AF5FF}));
    flash.rotation.z = Math.PI/2;
    animation.add(flash);

    const tot_time = 20000;
    createjs.Tween.get(nucleus.position, {loop: true}).to({x: 500}, tot_time);

    const speed = 1000/tot_time;
    const object_time = dimensions.x/speed;

    flash.scale.set(0,0,0);
    createjs.Tween.get(flash.scale, {loop: true})
        .wait(tot_time/2 - object_time/2)
        .to({x : 1, y : 1, z : 1}, 0)
        .wait(object_time)
        .to({x : 0, y : 0, z : 0}, 0)
        .wait(tot_time - tot_time/2 - object_time/2); //TO DO: change this so that the flash grows to full size than decreases. Change easing so it's quadratic or something instead of linear?
};

const nucleus = new THREE.Group();
create_nucleus(nucleus, 5, 50, 50);
nucleus.position.set(-500, 0, 0);
scene.add(nucleus);

const animation = new THREE.Group()
create_foil(animation);
animations(animation, nucleus);
scene.add(animation);


function animate() {
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);
    // controls.update(.05); //flycontrols
};

animate();