import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

function random_spherical_pos(r)
{
    const rho = Math.random() * r;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;
    const x = rho * Math.sin(phi) * Math.cos(theta);
    const y = rho * Math.sin(phi) * Math.sin(theta);
    const z = rho * Math.cos(phi);
    return new THREE.Vector3(x,y,z);
    // return {x, y, z};
}

export function create_nucleus(nucleus, radius, proton, neutron)
{
    nucleus.userData.proton = proton;
    nucleus.userData.neutron = neutron;
    const volume = (proton + neutron) * (4.0/3) * (radius**3) * 2.5; //arbritrary factor of 2.5 allows for space bw the nucleons. Can change number.
    //However, this method makes it so if there are more nucleons, the spacing bw particles is condensed.
    const n_radius = Math.cbrt(.75 * (1/Math.PI) * volume);
    nucleus.userData.n_radius = n_radius;
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
        // const rho = Math.random() * n_radius;
        // const theta = Math.random() * 2 * Math.PI;
        // const phi = Math.random() * Math.PI;
        // nucleon.position.set(rho * Math.sin(phi) * Math.cos(theta), rho * Math.sin(phi) * Math.sin(theta), rho * Math.cos(phi));
        // const {x,y,z} = random_spherical_pos(n_radius);
        const pos = random_spherical_pos(n_radius);
        // nucleon.position.set(x,y,z);
        nucleon.position.set(pos.x, pos.y, pos.z);

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
        // const {xchange, ychange, zchange} = random_spherical_pos(1); //it's not working for some reason when I put in this line?? I have no idea why.
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
        proton = Math.floor((.5 + Math.random()) * proton);
        neutron = Math.floor((.5 + Math.random()) * neutron);
        nucleus.userData.proton = proton;
        nucleus.userData.neutron = neutron;
    }
    create_nucleus(nucleus, radius, proton, neutron);
}

function choose_pos(nucleus, nucleus2, flash, tot_time)
{    
    // nucleus.position.y = -1 * (150 - (dimensions.y/2) * 1.5) + Math.random() * 2 * (150 - (dimensions.y/2) * 1.5);
    // nucleus.position.z = -1 * (150 - (dimensions.z/2) * 1.5) + Math.random() * 2 * (150 - (dimensions.z/2) * 1.5);

    nucleus.position.y = -1 * (150 - nucleus.userData.n_radius * 1.5) + Math.random() * 2 * (150 - nucleus.userData.n_radius * 1.5);
    nucleus.position.z = -1 * (150 - nucleus.userData.n_radius * 1.5) + Math.random() * 2 * (150 - nucleus.userData.n_radius * 1.5);

    nucleus2.position.y = nucleus.position.y;
    nucleus2.position.z = nucleus.position.z;
    // nucleus2.position.x = (1000/tot_time) * (.75 * tot_time); //1000 is the total distance the nuclei travel. .75 * tot_time is the time the nucleus travels before it breaks off

    flash.position.y = nucleus.position.y;
    flash.position.z = nucleus.position.z;
}

export function choose_wait_time(tot_time)
{
    let wait_time = Math.random() * tot_time;
    return wait_time;
    // console.log(wait_time);
}

function break_nucleus(nucleus, nucleus2, radius) //could you just use the replace nucleus function instead of this new function
{
    // if( Math.random() < .5)
    // {
        const p = Math.floor(.75 * nucleus.userData.proton);
        const n = Math.floor(.75 * nucleus.userData.neutron);
        nucleus.userData.proton = p;
        nucleus.userData.neutron = n;
        replace_nucleus(nucleus, radius, p, n, false);
        animate_nucleus(nucleus);

        // const v = random_spherical_pos(1);
        // create_nucleus(nucleus2, radius, nucleus.userData.proton - p, nucleus.userData.neutron - n);
        // // nucleus2.position.set(nucleus.position.x, nucleus.position.y, nucleus.position.z);
        // nucleus2.position.set(0,0,0);
        // createjs.Tween.get(nucleus2.scale, {loop : true})
        //     .wait(wait_time + .75 * tot_time)
        //     .to({x : 1, y : 1, z : 1}, 0)
        //     .wait(.25 * tot_time)
        //     .to({x : 0, y : 0, z : 0}, 0);
    // }
}


export function animations(animation, nucleus, nucleus2, radius, proton, neutron, wait_time)
{
    // const boundingBox = new THREE.Box3().setFromObject(nucleus);
    // let dimensions = new THREE.Vector3();
    // boundingBox.getSize(dimensions);
    nucleus.position.x = -500;
    // const flash = new THREE.Mesh( new THREE.CylinderGeometry(dimensions.z/2 * 1.5, dimensions.z/2 * 1.5, 5.5, 32), new THREE.MeshBasicMaterial( { color : 0x7AF5FF}));
    const flash = new THREE.Mesh( new THREE.CylinderGeometry(nucleus.userData.n_radius * 1.5, nucleus.userData.n_radius * 1.5, 5.5, 32), new THREE.MeshBasicMaterial( { color : 0x7AF5FF}));
    flash.rotation.z = Math.PI/2;
    animation.add(flash);

    const tot_time = 20000;

    create_nucleus(nucleus2, radius, nucleus.userData.proton/3, nucleus.userData.neutron/3);

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
        .call(choose_pos, [nucleus, nucleus2, flash, tot_time])
        .wait(wait_time)
        .wait(tot_time/2)
        .call(replace_nucleus, [nucleus, radius, proton, neutron, true])
        .call(animate_nucleus, [nucleus])
        .wait(tot_time/4)
        .call(break_nucleus, [nucleus, nucleus2, radius, wait_time, tot_time])
        .wait(tot_time/4)
        .call(replace_nucleus, [nucleus, radius, proton, neutron, false]); //check that the values of proton and neutron don't change

    const speed = 1000/tot_time;
    // const object_time = dimensions.x/speed;
    const object_time = (2 * nucleus.userData.n_radius)/speed;
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

    // nucleus2.position.set(nucleus.position.x, nucleus.position.y, nucleus.position.z);
    // nucleus2.position.set(nucleus.position.x, nucleus.position.y, nucleus.position.z);

    // nucleus2.scale.set(0,0,0);
    createjs.Tween.get(nucleus2.scale, {loop : true})
        .wait(wait_time + .75 * tot_time)
        .to({x : 1, y : 1, z : 1}, 0)
        .wait(.25 * tot_time)
        .to({x : 0, y : 0, z : 0}, 0);
        // nucleus2.position.y = nucleus.position.y;
        // nucleus2.position.z = nucleus.position.z;
        // nucleus2.position.x = (1000/tot_time) * (.75 * tot_time); //1000 is the total distance the nuclei travel. .75 * tot_time is the time the nucleus travels before it breaks off
    
    const rho = Math.random() * 1;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI/4;
    const x = rho * Math.cos(phi);
    const y = rho * Math.sin(phi) * Math.cos(theta);
    const z = rho * Math.sin(phi) * Math.sin(theta);
    const coeff = (1000/tot_time) * (.25 * tot_time);
    
    createjs.Tween.get(nucleus2.position, {loop : true})
        .wait(wait_time + .75 * tot_time)
        // .call(set_n2_pos, [nucleus, nucleus2])
        // .to({x : (1000/tot_time) * (.25 * tot_time), y : nucleus.position.y, z : nucleus.position.z}, 0) //starting pos for the broken piece has wrong y and z vals. Vals of the y and z before the nucleus is moved to a new one.
        .to({x : (1000/tot_time) * (.25 * tot_time)}, 0)
        .call(animate_nucleus, [nucleus2])
        .to({x : nucleus2.position.x + coeff * x, y : nucleus2.position.y + coeff * y, z : nucleus2.position.z + coeff * z}, .25 * tot_time);
        
}