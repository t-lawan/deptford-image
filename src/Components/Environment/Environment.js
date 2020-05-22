import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { Water } from "../../Utility/Water/Water";
import waternormals from '../../Assets/waternormals.jpg'
import { Sky } from "../../Utility/Objects/Sky";
const style = {
    height: 1000 // we can control scene size by setting container dimensions
};
class Environment extends Component {
    
    componentDidMount() {
        this.init();
        this.animate();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
        window.cancelAnimationFrame(this.requestID);
        this.controls.dispose();
    }

    // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
    // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
    init = () => {
        // get container dimensions and use them for scene sizing
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        // Set Renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( width, height );
        this.renderer.setPixelRatio(width, height)
        this.mount.appendChild( this.renderer.domElement ); // mount using React ref

        // Set Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xefd1b5)
        this.scene.fog = new THREE.FogExp2(0xefd1b5, 0.005)

        //Set Camera
        this.camera = new THREE.PerspectiveCamera(
            55, // fov = field of view
            width / height, // aspect ratio
            1, // near plane
            20000 // far plane
        );
        this.camera.position.set(50, 50, 188); // is used here to set some distance from a cube that is located at z = 0
        

        // Set Light

        this.light = new THREE.DirectionalLight(0xffffff, 0.8);
        this.scene.add(this.light)
        // Water

        let waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000);

        this.water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load(waternormals, (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                alpha: 1.0,
                sunDirection: this.light.position,
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: this.scene.fog !== undefined
            }
        );

        this.water.rotation.x = -Math.PI/2;
        this.scene.add(this.water);

        // Skybox

        this.sky = new Sky();

        this.uniforms = this.sky.material.uniforms;

        this.uniforms[ 'turbidity' ].value = 10;
        this.uniforms[ 'rayleigh' ].value = 2;
        this.uniforms[ 'luminance' ].value = 1;
        this.uniforms[ 'mieCoefficient' ].value = 0.005;
        this.uniforms[ 'mieDirectionalG' ].value = 0.8;

        this.parameters = {
            distance: 400,
            inclination: 0.49,
            azimuth: 0.205
        };
        this.cubeCamera = new THREE.CubeCamera(0.1, 1, 512);
        this.cubeCamera.renderTarget.texture.generateMipMaps = true;
        this.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;

        // this.scene.background = this.cubeCamera.renderTarget;

        // this.updateSun();

        // 
        var geometry = new THREE.IcosahedronBufferGeometry( 20, 1 );
        var count = geometry.attributes.position.count;

        var colors = [];
        var color = new THREE.Color();

        for ( var i = 0; i < count; i += 3 ) {

            color.setHex( Math.random() * 0xffffff );

            colors.push( color.r, color.g, color.b );
            colors.push( color.r, color.g, color.b );
            colors.push( color.r, color.g, color.b );

        }

        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        var material = new THREE.MeshStandardMaterial( {
            vertexColors: true,
            roughness: 0.0,
            flatShading: true,
            envMap: this.cubeCamera.renderTarget.texture,
            side: THREE.DoubleSide
        } );

        this.sphere = new THREE.Mesh( geometry, material );
        this.scene.add( this.sphere );

        //

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.maxPolarAngle = Math.PI * 0.495;
        this.controls.target.set( 0, 10, 0 );
        this.controls.minDistance = 40.0;
        this.controls.maxDistance = 200.0;
        this.controls.update();

        //

        // this.stats = new Stats();
        // this.mount.appendChild( this.stats.dom );

        window.addEventListener( 'resize', this.onWindowResize, false );
    };

    updateSun = () => {

        let theta = Math.PI * ( this.parameters.inclination - 0.5 );
        let phi = 2 * Math.PI * ( this.parameters.azimuth - 0.5 );

        this.light.position.x = this.parameters.distance * Math.cos( phi );
        this.light.position.y = this.parameters.distance * Math.sin( phi ) * Math.sin( theta );
        this.light.position.z = this.parameters.distance * Math.sin( phi ) * Math.cos( theta );

        this.sky.material.uniforms[ 'sunPosition' ].value = this.light.position.copy( this.light.position );
        this.water.material.uniforms[ 'sunDirection' ].value.copy( this.light.position ).normalize();

        this.cubeCamera.update( this.renderer, this.sky );
    }

    // Here should come custom code.
    // Code below is taken from Three.js BoxGeometry example
    // https://threejs.org/docs/#api/en/geometries/BoxGeometry


    onWindowResize = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.renderer.setSize( width, height );
        this.camera.aspect = width / height;

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        this.camera.updateProjectionMatrix();
    };

    animate = () => {
        this.requestID = requestAnimationFrame(this.animate);
        this.renderEnvironment();
    }

    renderEnvironment = () => {
        let time = performance.now() * 0.001;
        // this.sphere.position.y = Math.sin(time) * 20 + 5;
        this.sphere.rotation.x = time * 0.5;
        this.sphere.rotation.z = time * 0.51;

        this.water.material.uniforms['time'].value += 1.0/60.0;
        this.renderer.render(this.scene, this.camera)
    }

    render() {
        return <div style={style} ref={ref => (this.mount = ref)} />;
    }
}

export default Environment;