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

function choose_pos(nucleus_group, flash)
{    
    nucleus_group.position.y = -1 * (150 - nucleus_group.children[0].userData.n_radius * 1.5) + Math.random() * 2 * (150 - nucleus_group.children[0].userData.n_radius * 1.5);
    nucleus_group.position.z = -1 * (150 - nucleus_group.children[0].userData.n_radius * 1.5) + Math.random() * 2 * (150 - nucleus_group.children[0].userData.n_radius * 1.5);

    flash.position.y = nucleus_group.position.y;
    flash.position.z = nucleus_group.position.z;
}

export function choose_wait_time(tot_time)
{
    let wait_time = Math.random() * tot_time;
    return wait_time;
}

function break_nucleus(nucleus, nucleus2, radius) //could you just use the replace nucleus function instead of this new function
{

    const p = Math.floor(.75 * nucleus.userData.proton);
    const n = Math.floor(.75 * nucleus.userData.neutron);
    nucleus.userData.proton = p;
    nucleus.userData.neutron = n;
    replace_nucleus(nucleus, radius, p, n, false);
    animate_nucleus(nucleus);

    create_nucleus(nucleus2, radius, nucleus.userData.proton/3, nucleus.userData.neutron/3);
}


export function animations(animation, nucleus, nucleus2, radius, proton, neutron, wait_time)
{
    const nucleus_group = new THREE.Group();
    nucleus_group.add(nucleus);
    nucleus_group.add(nucleus2);
    console.log(nucleus_group);

    const tot_dist = 2000;
    nucleus_group.position.x = -tot_dist/2;
    // const flash = new THREE.Mesh( new THREE.CylinderGeometry(dimensions.z/2 * 1.5, dimensions.z/2 * 1.5, 5.5, 32), new THREE.MeshBasicMaterial( { color : 0x7AF5FF}));
    const flash = new THREE.Mesh( new THREE.CylinderGeometry(nucleus.userData.n_radius * 1.5, nucleus.userData.n_radius * 1.5, 5.5, 32), new THREE.MeshBasicMaterial( { color : 0x7AF5FF}));
    flash.rotation.z = Math.PI/2;
    animation.add(flash);

    const tot_time = 20000;

    nucleus_group.scale.set(0,0,0);

    createjs.Tween.get(nucleus_group.scale, {loop : true})
        .wait(wait_time)
        .to({x : 1, y : 1, z : 1}, 0)
        .wait(tot_time)
        .to({x : 0, y : 0, z : 0}, 0);

    createjs.Tween.get(nucleus_group.position, {loop: true})
        .wait(wait_time)
        .to({x: tot_dist/2}, tot_time);

    createjs.Tween.get(nucleus, {loop :true}) //specific property you're calling here doesn't matter
        .call(choose_pos, [nucleus_group, flash])
        .wait(wait_time)
        .wait(tot_time/2)
        .call(replace_nucleus, [nucleus, radius, proton, neutron, true])
        .call(animate_nucleus, [nucleus])
        .wait(tot_time/4)
        .call(break_nucleus, [nucleus, nucleus2, radius, wait_time, tot_time])
        .wait(tot_time/4)
        .call(replace_nucleus, [nucleus, radius, proton, neutron, false]); //check that the values of proton and neutron don't change

    const speed = 1000/tot_time;

    const object_time = (2 * nucleus.userData.n_radius)/speed;
    flash.scale.set(0,0,0);
    createjs.Tween.get(flash.scale, {loop: true})
        .wait(wait_time)
        .wait(tot_time/2 - object_time/2)
        .to({x : 1, y : 1, z : 1}, 0)
        .wait(object_time)
        .to({x : 0, y : 0, z : 0}, 0)
        .wait(tot_time - tot_time/2 - object_time/2); //TO DO: change this so that the flash grows to full size than decreases. Change easing so it's quadratic or something instead of linear?

    const v = random_spherical_pos(1);
    const coeff = (1000/tot_time) * (.25 * tot_time);
    
    createjs.Tween.get(nucleus2.position, {loop : true})
        .wait(wait_time + .75 * tot_time)
        .call(animate_nucleus, [nucleus2])
        .to({x : nucleus2.position.x + coeff * v.x, y : nucleus2.position.y + coeff * v.y, z : nucleus2.position.z + coeff * v.z}, .25 * tot_time);
    
    animation.add(nucleus_group);
}

// change to tween.js library
// make randomly selecting the start time better
// randomly select the time it breaks apart within a range