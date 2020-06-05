import React, { Component } from "react";
import { connect } from "react-redux";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { Water } from "../../Utility/Objects/Water";
import waternormals from "../../Assets/waternormals.jpg";
import { Sky } from "../../Utility/Objects/Sky";
import MiddleFBX from "../../Assets/Models/middle.fbx";
import { MTLLoader } from "../../Utility/Loaders/MTLLoader";
import { OBJLoader } from "../../Utility/Loaders/OBJLoader";
import Stats from "../../Utility/Stats";
import {
  hasLoaded,
  openModal,
  setExhibitionItems,
  loading,
  hideInstructions
} from "../../Store/action";
import RequestManager from "../../Utility/RequestManager";
import styled from "styled-components";
import { FBXLoader } from "../../Utility/Loaders/FBXLoader";
import Sound from "../../Assets/Birds.m4a";
import TypeFace from '../../Assets/Fonts/karla.json'
const EnvironmentWrapper = styled.div`
  height: 100vh;
`;
const style = {
  height: "100vh" // we can control scene size by setting container dimensions
};
class Environment extends Component {
  centralPoint = new THREE.Vector3(0, 500, 10);
  clickableObjects = [];
  isHovering = false;
  hasInteracted = false;
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
    document.removeEventListener("mousedown", this.onDocumentMouseDown);
    document.removeEventListener("mousemove", this.onDocumentMouseMove);

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
    this.setupRenderer(width, height);
    // mount using React ref
    // Set Scene
    this.createScene();

    //Set Camera
    this.setupCamera(height, width);
    this.createAudioListener();
    // Create Mouse
    this.createMouse();

    // Set Light
    this.createLight();

    // Water
    // this.createWater();

    // Axes
    // this.createAxes();
    // Middle Object
    this.createLoadingManager();
    this.createCenterObjectBoundary();
    await this.startLoadingProcess();
    // Skybox
    this.setupSky();
    this.createSphere();
    this.createRayCaster();
    this.assignExhibitionItemsToClickableObjects();
    this.setupOrbitControls();
    this.setupStats();
    document.addEventListener("touchstart", this.onDocumentTouchStart, false);
    document.addEventListener("mousedown", this.onDocumentMouseDown, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
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
    
    // this.scene.background = this.cubeCamera.renderTarget;

    this.updateSun();

  };

  setupStats = () => {
    this.stats = new Stats();
    this.mount.appendChild(this.stats.dom);
  };

  setupRenderer = (width, height) => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setViewport(0, 0, width, height);
    // this.renderer.setPixelRatio(width, height);
    this.mount.appendChild(this.renderer.domElement);
  };
  createScene = () => {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x72869d);
    this.scene.fog = new THREE.FogExp2(0x72869d, 0.003);
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

  createLoadingManager = () => {
    this.manager = new THREE.LoadingManager(
      this.hasLoaded,
      this.loadProgressing
    );
  };

  addLight = (x, y, z) => {
    var pointLight = new THREE.PointLight('red', 500, 100, 2);
    pointLight.position.set(x, y + 20, z);
    pointLight.intensity = 0;
    this.scene.add(pointLight);
    return pointLight;
  };


  loadOBJFile = async (materialUri, OBJUri) => {
    let loader = new MTLLoader(this.manager);
    await this.setExhibitionItems();
    loader.load(materialUri, async materials => {
      materials.preload();

      let objLoader = new OBJLoader(this.manager);
      objLoader.setMaterials(materials);
      objLoader.load(OBJUri, obj => {
        this.centerObject = obj;
      });
    });
  };

  startLoadingProcess = async () => {
    await this.loadFBXFile();
    this.loadAudio();
    this.loadFont()
  };

  hasLoaded = () => {
    this.addFBXFile();
    this.addSound();
    this.props.hasLoaded();
  };

  loadFBXFile = async () => {
    let loader = new FBXLoader(this.manager);
    await this.setExhibitionItems();
    loader.load(
      MiddleFBX,
      object => {
        this.centerObject = object;
      },
      this.loadProgressing
    );
  };

  loadFont = () => {
    var loader = new THREE.FontLoader(this.manager);
    this.font = loader.parse(TypeFace)

  };


  loadAudio = () => {
    this.audioLoader = new THREE.AudioLoader(this.manager);
    this.audioLoader.load(Sound, buffer => {
      this.sound.setBuffer(buffer);
    });
  };

  loadProgressing = (url, itemsLoaded, itemsTotal) => {
    this.props.loading(itemsLoaded, itemsTotal);
  };

  addFont = (textInfo, position) => {
      if(this.font && textInfo) {
        var geometry = new THREE.TextBufferGeometry(textInfo, {
          font: this.font,
          size: 3,
          height: 1,
        });
  
        let material = new THREE.MeshBasicMaterial({
          color: new THREE.Color("white")
        });
        let text = new THREE.Mesh(geometry, material);
        text.position.x = position.x;
        text.position.y = position.y + 50;
        text.position.z = position.z;
        this.scene.add(text);
        return text
      }
  }
  addFBXFile = () => {
    if (this.centerObject) {
      this.centerObject.traverse(function(child) {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });
      this.centerObject.position.x = this.centralPoint.x;
      this.centerObject.position.y = this.centralPoint.y;
      this.centerObject.position.z = this.centralPoint.z;
      this.centerObject.clickable = true;
      // this.centerObject.callback = (id) => this.objectSelected(id);
      this.scene.add(this.centerObject);
    }
  };

  addSound = () => {
    this.sound.setLoop(false);
    this.sound.setVolume(1);
    this.sound.duration = 1;
  };

  setExhibitionItems = async () => {
    let exhibitionItems = await RequestManager.getExhibitionItems();
    this.props.setExhibitionItems(exhibitionItems);
  };

  createAudioListener = () => {
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);
    this.sound = new THREE.Audio(this.listener);
  };

  createCenterObjectBoundary = () => {
    let material = new THREE.MeshStandardMaterial();
    material.opacity = 0.5;
    material.transparent = true;
    material.visible = false;
    // boundingBox = new THREE.Box3().setFromObject(this.centerObject)
    // size = boundingBox.getSize();
    let geometry = new THREE.BoxGeometry(50, 50, 50);

    this.centerObjectBoundary = new THREE.Mesh(geometry, material);


    this.centerObjectBoundary.position.x = this.centralPoint.x;
    this.centerObjectBoundary.position.y = this.centralPoint.y;
    this.centerObjectBoundary.position.z = this.centralPoint.z + 19;
    this.centerObjectBoundary.callback = id => this.objectSelected(id);
    this.centerObjectBoundary.light = this.addLight(
      this.centerObjectBoundary.position.x,
      this.centerObjectBoundary.position.y,
      this.centerObjectBoundary.position.z
    );
    this.centerObjectBoundary.order = 2;
    this.scene.add(this.centerObjectBoundary);
    this.clickableObjects.push(this.centerObjectBoundary);
  };
  
  createSphere = () => {
    let material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 1
    });

    let material_two = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 1
    });;
    let geometry = new THREE.SphereGeometry(10, 30, 30);

    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.position.x = this.centralPoint.x + 100;
    this.sphere.position.y = this.centralPoint.y;
    this.sphere.position.z = this.centralPoint.z;
    this.sphere.name = "Sphere";
    this.sphere.clickable = true;
    this.sphere.order = 1;
    this.sphere.light = this.addLight(
      this.sphere.position.x,
      this.sphere.position.y,
      this.sphere.position.z
    );
    this.sphere.callback = id => this.objectSelected(id);
    this.scene.add(this.sphere);
    this.clickableObjects.push(this.sphere);

    this.sphere_two = new THREE.Mesh(geometry, material_two);
    this.sphere_two.position.x = this.centralPoint.x - 100;
    this.sphere_two.position.y = this.centralPoint.y + 100;
    this.sphere_two.position.z = this.centralPoint.z;
    this.sphere_two.name = "Sphere2";
    this.sphere_two.clickable = true;
    this.sphere_two.order = 3;
    this.sphere_two.light = this.addLight(
      this.sphere_two.position.x,
      this.sphere_two.position.y,
      this.sphere_two.position.z
    );
    this.sphere_two.callback = id => this.objectSelected(id);
    this.scene.add(this.sphere_two);
    this.clickableObjects.push(this.sphere_two);

  };

  objectSelected = id => {
    this.sound.play();
    this.props.openModal(id);
    this.setState({
      pause: true
    });
  };

  createAxes = () => {
    var axesHelper = new THREE.AxesHelper(10);
    this.scene.add(axesHelper);
  };

  assignExhibitionItemsToClickableObjects = () => {
    let sentenceLength = 4;
    let distance = 10

    this.clickableObjects = this.clickableObjects.sort((a, b) => {
      return a.order - b.order;
    });

    this.props.exhibition_items.forEach((item, index) => {
      if (index + 1 <= this.clickableObjects.length) {
        //  Split description into array of words
        let desc = item.short_description.split(' ');
        let arr = [];
        // Iterate
        for(let i = 0; i < desc.length; i = i + sentenceLength) {
          arr.push(`${desc[i]} ${desc[i+1]} ${desc[i+2]} ${desc[i+3]}`)
        }

        let position = this.clickableObjects[index].position;
        position.y = position.y + (distance * arr.length)
        let text = []; 
        arr.forEach((sentence) => {
          text.push(this.addFont(sentence, position))
          position.y = position.y - distance;
        })

        this.clickableObjects[index].exhibition_id = item.id;
        this.clickableObjects[index].text = text
      }
    });
  };

  setupOrbitControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.controls.enableKeys = true;
    this.controls.enablePan = true;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 400;
    this.controls.target = this.centralPoint;
    this.controls.keyPanSpeed = 20;
    this.controls.panSpeed = 3;
    this.controls.maxPolarAngle = 2 * Math.PI;
    this.controls.maxAzimuthAngle = Infinity;
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
    if (this.water) {
      this.water.material.uniforms["sunDirection"].value
        .copy(this.light.position)
        .normalize();
    }
    this.cubeCamera.update(this.renderer, this.sky);
  };

  hideInstructions = () => {
    if(this.props.show_instructions) {
      setTimeout(() => {
        this.props.hideInstructions()
      }, 1500)
    }
  }

  // Here should come custom code.
  // Code below is taken from Three.js BoxGeometry example
  // https://threejs.org/docs/#api/en/geometries/BoxGeometry

  onDocumentMouseDown = event => {
    // event.preventDefault();
    this.hideInstructions();
    this.mouse.x = (event.clientX / this.mount.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.mount.clientHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.clickableObjects);
    if (this.intersects.length > 0) {
      let mesh = this.intersects[0];
      if (mesh.object.callback && mesh.object.exhibition_id) {
        mesh.object.callback(mesh.object.exhibition_id);
      }
    }
  };



  onDocumentMouseMove = event => {
    event.preventDefault();
    this.hideInstructions();
    this.mouse.x = (event.clientX / this.mount.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.mount.clientHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.clickableObjects);
    if(this.intersects.length > 0) {
      if(!this.isHovering) {
        this.isHovering = true;
        this.intersects[0].object.light.intensity = 1000;
      }
    } else {
      if(this.isHovering) {
        this.isHovering = false;
        this.turnOffAllLights()
      }
    } 
  };

  turnOffAllLights = () => {
    this.clickableObjects.forEach((obj) => {
      obj.light.intensity = 0;
    })
  }

  onDocumentTouchStart = event => {
    // event.preventDefault();
    this.hideInstructions();
    this.mouse.x =
      (event.targetTouches[0].clientX / this.mount.clientWidth) * 2 - 1;
    this.mouse.y =
      -(event.targetTouches[0].clientY / this.mount.clientHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.clickableObjects);
    if (this.intersects.length > 0) {
      let mesh = this.intersects[0];
      if (mesh.object.callback && mesh.object.exhibition_id) {
        mesh.object.callback(mesh.object.exhibition_id);
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
    this.controls.update();
    this.renderEnvironment();
    if (this.stats) {
      this.stats.update();
    }
  };

  renderEnvironment = () => {
    if (!this.state.pause) {
      if (this.state.firstCall) {
        this.onWindowResize();
        this.setState({
          firstCall: false
        });
      }
      let time = performance.now() * 0.001;
      if (this.water) {
        this.water.material.uniforms["time"].value += 1.0 / 60.0;
      }
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
    modal_item: state.modal_item,
    exhibition_items: state.exhibition_items,
    show_instructions: state.show_instructions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hasLoaded: () => dispatch(hasLoaded()),
    openModal: item => dispatch(openModal(item)),
    setExhibitionItems: exhibitionItems =>
      dispatch(setExhibitionItems(exhibitionItems)),
    loading: (loaded, total) => dispatch(loading(loaded, total)),
    hideInstructions:  () => dispatch(hideInstructions())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Environment);
