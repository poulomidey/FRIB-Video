import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

export function create_nucleus(nucleus, radius, proton, neutron)
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
}

export function create_foil(animation)
{
    const foil = new THREE.Mesh( new THREE.BoxGeometry(5, 300, 300), new THREE.MeshLambertMaterial({color : 0xC3C3C1}));
    animation.add(foil);

    //maybe to make a new one it can call a function?? how do you get it work not on a loop. Maybe have five ones on a loop?
}

function animate_nucleus(nucleus)
{
    nucleus.children.forEach(nucleon => {
        const rho = Math.random() * 1;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * Math.PI;
        const xchange = rho * Math.sin(phi) * Math.cos(theta);
        const ychange = rho * Math.sin(phi) * Math.sin(theta);
        const zchange = rho * Math.cos(phi);
        const time = 25 + Math.random() * 25;
        createjs.Tween.get(nucleon.position, {loop : true})
            .to({x : nucleon.position.x + xchange, y : nucleon.position.y + ychange, z : nucleon.position.z + zchange}, time)
            .to({x : nucleon.position.x - xchange, y : nucleon.position.y - ychange, z : nucleon.position.z - zchange}, time)
    });
}

function replace_nucleus(nucleus, radius, proton, neutron, pick_new_size)
{
    nucleus.clear();
    if(pick_new_size)
    {
        proton = (.5 + Math.random()) * proton;
        neutron = (.5 + Math.random()) * neutron;
    }

    create_nucleus(nucleus, radius, proton, neutron);
}

function choose_pos(nucleus, flash, dimensions)
{    
    nucleus.position.y = -1 * (150 - dimensions.y/2) + Math.random() * 2 * (150 - dimensions.y/2);
    nucleus.position.z = -1 * (150 - dimensions.z/2) + Math.random() * 2 * (150 - dimensions.z/2);

    flash.position.y = nucleus.position.y;
    flash.position.z = nucleus.position.z;
}

export function animations(animation, nucleus, radius, proton, neutron, wait_time)
{
    const boundingBox = new THREE.Box3().setFromObject(nucleus);
    let dimensions = new THREE.Vector3();
    boundingBox.getSize(dimensions);

    nucleus.position.x = -500;

    const flash = new THREE.Mesh( new THREE.CylinderGeometry(dimensions.z/2 * 1.5, dimensions.z/2 * 1.5, 5.5, 32), new THREE.MeshBasicMaterial( { color : 0x7AF5FF}));
    flash.rotation.z = Math.PI/2;
    animation.add(flash);

    const tot_time = 20000;

    nucleus.scale.set(0,0,0);
    createjs.Tween.get(nucleus.scale, {loop : true})
        .wait(wait_time)
        .to({x : 1, y : 1, z : 1}, 0)
        .wait(tot_time)
        .to({x : 0, y : 0, z : 0}, 0);

    createjs.Tween.get(nucleus.position, {loop: true})
        .wait(wait_time)
        .to({x: 500}, tot_time);
    
    createjs.Tween.get(nucleus, {loop :true}) //specific property you're calling here doesn't matter
        .call(choose_pos, [nucleus, flash, dimensions])
        .wait(wait_time)
        .wait(tot_time/2)
        .call(replace_nucleus, [nucleus, radius, proton, neutron, true])
        .call(animate_nucleus, [nucleus])
        .wait(tot_time/2)
        .call(replace_nucleus, [nucleus, radius, proton, neutron, false]); //check that the values of proton and neutron don't change

    const speed = 1000/tot_time;
    const object_time = dimensions.x/speed;

    flash.scale.set(0,0,0);
    createjs.Tween.get(flash.scale, {loop: true})
        .wait(wait_time)
        .wait(tot_time/2 - object_time/2)
        .to({x : 1, y : 1, z : 1}, 0)
        .wait(object_time)
        .to({x : 0, y : 0, z : 0}, 0)
        .wait(tot_time - tot_time/2 - object_time/2); //TO DO: change this so that the flash grows to full size than decreases. Change easing so it's quadratic or something instead of linear?
        //figure out how to randomize starting position when you start over
        //how can you do multiple of them within 10 seconds, maybe at randomized times. Maybe just a loop?
        //loop it like five times and pick a random wait time between 0 and 10 seconds to wait at first.
}