import React, { Component } from "react";
import { connect } from "react-redux";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { Water } from "../../Utility/Objects/Water";
import waternormals from "../../Assets/waternormals.jpg";
import { Sky } from "../../Utility/Objects/Sky";
import MiddleObject from "../../Assets/Models/middle.obj";
import MiddleObjectMaterial from "../../Assets/Models/middle.mtl";
import MiddleFBX from "../../Assets/Models/middle.fbx";
import { MTLLoader } from "../../Utility/Loaders/MTLLoader";
import { OBJLoader } from "../../Utility/Loaders/OBJLoader";
import Stats from "../../Utility/Stats";
import {
  hasLoaded,
  openModal,
  setExhibitionItems,
  loading
} from "../../Store/action";
import RequestManager from "../../Utility/RequestManager";
import styled from "styled-components";
import { FBXLoader } from "../../Utility/Loaders/FBXLoader";


const EnvironmentWrapper = styled.div`
  height: 100vh
`
const style = {
  height: "100vh" // we can control scene size by setting container dimensions
};
class Environment extends Component {
  centralPoint = new THREE.Vector3(0, 40, 10);
  clickableObjects = [];

  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      firstCall: true
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.modal_open !== this.props.modal_open &&
      !this.props.modal_open
    ) {
      this.setState({
        pause: false
      });
    }
  }

  async componentDidMount() {
    await this.init();
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
  init = async () => {
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

    // Axes
    // this.createAxes();
    // Middle Object
    this.createCenterObjectBoundary()
    await this.createCenterObject();
    // await this.loadFBXObject()
    // Skybox
    this.setupSky();
    this.createSphere();
    this.createRayCaster();
    this.setupOrbitControls();
    this.setupStats();
    document.addEventListener("mousedown", this.onDocumentMouseDown, false);
    window.addEventListener("resize", this.onWindowResize, false);
  };
  setupCamera = (width, height) => {
    this.camera = new THREE.PerspectiveCamera(
      70, // fov = field of view
      width / height, // aspect ratio
      1, // near plane
      5000 // far plane
    );
    this.camera.aspect = width / height;
    this.camera.position.set(128, 61, 457);
    // this.camera.rotation.set(-2.64, 1.28, 2.66); // is used here to set some distance from a cube that is located at z = 0
    this.camera.rotation.set(0, 0, 0); // is used here to set some distance from a cube that is located at z = 0
    this.camera.updateProjectionMatrix();
      
  };

  setupSky = () => {
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
  };

  setupStats = () => {
    this.stats = new Stats();
    this.mount.appendChild(this.stats.dom);
  };

  createRenderer = (width, height) => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setViewport(0, 0, width, height);
    // this.renderer.setPixelRatio(width, height);
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
  createCenterObject = async () => {
    this.manager = new THREE.LoadingManager(this.loadCenterObject);
    let loader = new MTLLoader(this.manager);
    await this.setExhibitionItems();
    loader.load(MiddleObjectMaterial, async materials => {
      materials.preload();

      let objLoader = new OBJLoader(this.manager);
      objLoader.setMaterials(materials);
      objLoader.load(
        MiddleObject,
        obj => {
          this.centerObject = obj;
        },
        this.loadProgressing
      );
    });
  };

  loadFBXObject = async () => {
    this.manager = new THREE.LoadingManager(this.loadCenterObject);
    let loader = new FBXLoader(this.manager);
    await this.setExhibitionItems();

    loader.load(MiddleFBX, (object) => {
      this.centerObject = object;
    }, this.loadProgressing)
  }
  setExhibitionItems = async () => {
    let exhibitionItems = await RequestManager.getExhibitionItems();
    this.props.setExhibitionItems(exhibitionItems);
  };

  loadProgressing = xhr => {
    this.props.loading(xhr.loaded, xhr.total);
  };
  loadCenterObject = () => {
    if (this.centerObject) {
      this.centerObject.traverse(function(child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.centerObject.position.x = this.centralPoint.x;
      this.centerObject.position.y = this.centralPoint.y;
      this.centerObject.position.z = this.centralPoint.z;
      this.centerObject.clickable = true;
      this.centerObject.callback = () => this.objectSelected();
      this.scene.add(this.centerObject);
      this.props.hasLoaded();
    }
  };

  createCenterObjectBoundary = () => {
    let material = new THREE.MeshStandardMaterial();
    material.opacity = 0.0;
    material.transparent = true;
    material.visible = false;

    let geometry = new THREE.BoxGeometry(50, 150, 50);

    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.x = this.centralPoint.x;
    this.cube.position.y = this.centralPoint.y;
    this.cube.position.z = this.centralPoint.z;
    this.cube.callback = () => this.objectSelected();
    this.scene.add(this.cube)
    this.clickableObjects.push(this.cube);
  }

  createSphere = () => {
    let material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.4,
      metalness: 0.5,
      roughness: 1
    });
    let geometry = new THREE.SphereGeometry(10, 30, 30);

    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.position.x = this.centralPoint.x + 100;
    this.sphere.position.y = this.centralPoint.y;
    this.sphere.position.z = this.centralPoint.z;
    this.sphere.name = "Sphere";
    this.sphere.clickable = true;
    this.sphere.callback = () => this.objectSelected();
    this.scene.add(this.sphere);
    this.clickableObjects.push(this.sphere);

    this.sphere_two = new THREE.Mesh(geometry, material);
    this.sphere_two.position.x = this.centralPoint.x - 100;
    this.sphere_two.position.y = this.centralPoint.y + 100;
    this.sphere_two.position.z = this.centralPoint.z;
    this.sphere_two.name = "Sphere2";
    this.sphere_two.clickable = true;
    this.sphere_two.callback = () => this.objectSelected();
    this.scene.add(this.sphere_two);
    this.clickableObjects.push(this.sphere_two);
  };

  objectSelected = () => {
    this.props.openModal(1);
    this.setState({
      pause: true
    });
  };

  createAxes = () => {
    var axesHelper = new THREE.AxesHelper(10);
    this.scene.add(axesHelper);
  };

  setupOrbitControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.controls.enableKeys = true;
    this.controls.enablePan = true;
    this.controls.target.set(0, 10, 0);
    this.controls.minDistance = 100;
    this.controls.maxDistance = 400;
    this.controls.target = this.centralPoint;
    this.controls.keyPanSpeed = 20;
    this.controls.update();
  };

  setupPointerLockControls = () => {
    this.controls = new PointerLockControls(
      this.camera,
      this.renderer.domElement
    );
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
    event.preventDefault();
    this.mouse.x = (event.clientX / this.mount.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.mount.clientHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.clickableObjects, true);
    if (this.intersects.length > 0) {
      if (this.intersects[0].object.callback) {
        this.intersects[0].object.callback();
      }
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
    if(this.stats) {
      this.stats.update();
    }
  };

  renderEnvironment = () => {
    if (!this.state.pause) {
      if(this.state.firstCall) {
        this.onWindowResize();
        this.setState({
          firstCall: false
        })
      }
      let time = performance.now() * 0.001;
      this.water.material.uniforms["time"].value += 1.0 / 60.0;
      this.sphere.rotateX(0.1 * time);
      this.renderer.render(this.scene, this.camera);
    }
  };

  render() {
    return <EnvironmentWrapper ref={ref => (this.mount = ref)} />;
  }
}

const mapStateToProps = state => {
  return {
    modal_open: state.modal_open,
    modal_item: state.modal_item
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hasLoaded: () => dispatch(hasLoaded()),
    openModal: (item) => dispatch(openModal(item)),
    setExhibitionItems: exhibitionItems =>
      dispatch(setExhibitionItems(exhibitionItems)),
    loading: (loaded, total) => dispatch(loading(loaded, total))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Environment);
