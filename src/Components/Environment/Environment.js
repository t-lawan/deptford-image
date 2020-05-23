import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { Water } from "../../Utility/Objects/Water";
import waternormals from "../../Assets/waternormals.jpg";
import { Sky } from "../../Utility/Objects/Sky";
import CenterObject from '../../Assets/Models/center.obj'
import CenterObjectMaterial from '../../Assets/Models/center.mtl'
import { MTLLoader } from "../../Utility/Loaders/MTLLoader";
import { OBJLoader } from "../../Utility/Loaders/OBJLoader";
const style = {
  height: 1000 // we can control scene size by setting container dimensions
};
class Environment extends Component {
  centralPoint = new THREE.Vector3(0, 40, 10);
  componentDidMount() {
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
    document.removeEventListener("mousemove", this.onDocumentMouseDown);
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
    this.createRenderer(width, height);
    // mount using React ref
    // Set Scene
    this.createScene();

    //Set Camera
    this.setupCamera(height, width);

    // Create Mouse
    this.createMouse();

    // Set Light
    this.createLight();

    // Water
    this.createWater();

    // Middle Object
    this.createCenterObject();

    // Skybox
    this.sky = new Sky();

    this.uniforms = this.sky.material.uniforms;

    this.uniforms["turbidity"].value = 10;
    this.uniforms["rayleigh"].value = 2;
    this.uniforms["luminance"].value = 1;
    this.uniforms["mieCoefficient"].value = 0.005;
    this.uniforms["mieDirectionalG"].value = 0.8;

    this.parameters = {
      distance: 400,
      inclination: 0.49,
      azimuth: 0.205
    };
    this.cubeCamera = new THREE.CubeCamera(0.1, 1, 512);
    this.cubeCamera.renderTarget.texture.generateMipMaps = true;
    this.cubeCamera.renderTarget.texture.minFilter =
      THREE.LinearMipMapLinearFilter;

    // this.scene.background = this.cubeCamera.renderTarget;

    // this.updateSun();

    //

    this.createSphere();

    //
    this.createRayCaster();
    this.setupControls();

    //

    // this.stats = new Stats();
    // this.mount.appendChild( this.stats.dom );
    document.addEventListener("mousedown", this.onDocumentMouseDown, false);
    window.addEventListener("resize", this.onWindowResize, false);
  };

  setupCamera = (width, height) => {
    this.camera = new THREE.PerspectiveCamera(
      55, // fov = field of view
      width / height, // aspect ratio
      1, // near plane
      20000 // far plane
    );
    this.camera.position.set(128, 61, 457);
    this.camera.rotation.set(-2.64, 1.28, 2.66); // is used here to set some distance from a cube that is located at z = 0
  };

  createRenderer = (width, height) => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(width, height);
    this.mount.appendChild(this.renderer.domElement);
  };
  createScene = () => {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x72869d);
    this.scene.fog = new THREE.FogExp2(0x72869d, 0.002);
  };
  createLight = () => {
    this.light = new THREE.DirectionalLight(0xffffff, 0.8);
    this.scene.add(this.light);
  };

  createRayCaster = () => {
    this.raycaster = new THREE.Raycaster();
    this.raycaster.setFromCamera(this.mouse, this.camera);
  };

  createMouse = () => {
    this.mouse = new THREE.Vector2();
  };

  createWater = () => {
    let waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000);

    this.water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(waternormals, texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      alpha: 1.0,
      sunDirection: this.light.position,
      sunColor: 0xffffff,
      waterColor: 0x72869d,
      distortionScale: 3.7,
      fog: this.scene.fog !== undefined
    });

    this.water.rotation.x = -Math.PI / 2;
    this.scene.add(this.water);
  };
  createCenterObject = () => {
    this.manager = new THREE.LoadingManager(this.loadObject);
    let loader = new MTLLoader(this.manager);

    loader.load(CenterObjectMaterial, (materials) => {
      materials.preload()

      let objLoader = new OBJLoader(this.manager);
      objLoader.setMaterials(materials);
      objLoader.load(CenterObject, (obj) => {
        this.centerObject = obj
        // this.scene.add(obj);
      })
    })
    // let loader = new THREE.ObjectLoader(this.manager);
    // loader.load(CenterObject, object => {
    //   console.log(object);
    //   this.centerObject = object;
    // });
  };

  loadObject = () => {
    if (this.centerObject) {
      // this.centerObject.traverse(function(child) {
      //   if (child.isMesh) {
      //     child.castShadow = true;
      //     child.receiveShadow = true;
      //   }
      // });
      this.centerObject.position.x = this.centralPoint.x;
      this.centerObject.position.y = this.centralPoint.y;
      this.centerObject.position.z = this.centralPoint.z;
      this.scene.add(this.centerObject);
    }
  };

  createSphere = () => {
    let material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      color: 0x7fc5f9,
      emissive: 0x25673d,
      emissiveIntensity: 0.4,
      metalness: 0.5,
      roughness: 1
    });
    let geometry = new THREE.SphereGeometry(10, 30, 30);

    // this.sphere = new THREE.Mesh(geometry, material);
    // this.sphere.position.x = this.centralPoint.x;
    // this.sphere.position.y = this.centralPoint.y;
    // this.sphere.position.z = this.centralPoint.z;
    // this.sphere.name = "Sphere";
    // this.sphere.callback = () => this.objectSelected();
    // this.scene.add(this.sphere);

    // this.sphere_two = new THREE.Mesh(geometry, material);
    // this.sphere_two.position.x = this.centralPoint.x + 10;
    // this.sphere_two.position.y = this.centralPoint.y + 50;
    // this.sphere_two.position.z = this.centralPoint.z + 100;
    // this.sphere_two.callback = () => this.objectSelected();
    // this.scene.add(this.sphere_two);
  };

  objectSelected = () => {
    console.log("HELLO");
  };

  setupControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.controls.enableKeys = true;
    this.controls.enablePan = true;
    this.controls.target.set(0, 10, 0);
    this.controls.minDistance = 100;
    this.controls.maxDistance = 400;
    this.controls.target = this.centralPoint;
    this.controls.update();
  };

  updateSun = () => {
    let theta = Math.PI * (this.parameters.inclination - 0.5);
    let phi = 2 * Math.PI * (this.parameters.azimuth - 0.5);

    this.light.position.x = this.parameters.distance * Math.cos(phi);
    this.light.position.y =
      this.parameters.distance * Math.sin(phi) * Math.sin(theta);
    this.light.position.z =
      this.parameters.distance * Math.sin(phi) * Math.cos(theta);

    this.sky.material.uniforms["sunPosition"].value = this.light.position.copy(
      this.light.position
    );
    this.water.material.uniforms["sunDirection"].value
      .copy(this.light.position)
      .normalize();

    this.cubeCamera.update(this.renderer, this.sky);
  };

  // Here should come custom code.
  // Code below is taken from Three.js BoxGeometry example
  // https://threejs.org/docs/#api/en/geometries/BoxGeometry

  onDocumentMouseDown = event => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log("po", this.camera.position);
    console.log("ro", this.camera.rotation);
    this.intersects = this.raycaster.intersectObjects(this.scene.children);
    if (this.intersects.length > 0) {
      this.intersects.forEach(obj => {
        if (obj.name === "Sphere") {
          obj.selected();
        }
      });
    }
  };
  onWindowResize = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    this.camera.updateProjectionMatrix();
  };

  animate = () => {
    this.requestID = requestAnimationFrame(this.animate);
    this.renderEnvironment();
  };

  renderEnvironment = () => {
    let time = performance.now() * 0.001;

    this.water.material.uniforms["time"].value += 1.0 / 60.0;
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div style={style} ref={ref => (this.mount = ref)} />;
  }
}

export default Environment;
