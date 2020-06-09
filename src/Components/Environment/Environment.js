import React, { Component } from "react";
import { connect } from "react-redux";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "../../Utility/Objects/Water";
import waternormals from "../../Assets/waternormals.jpg";
import { Sky } from "../../Utility/Objects/Sky";
import ExplosionFBX from "../../Assets/Models/Explosion.fbx";
import { MTLLoader } from "../../Utility/Loaders/MTLLoader";
import { OBJLoader } from "../../Utility/Loaders/OBJLoader";
import Stats from "../../Utility/Stats";
import {
  hasLoaded,
  openModal,
  setExhibitionItems,
  loading,
  hideInstructions,
  setPages
} from "../../Store/action";
import RequestManager from "../../Utility/RequestManager";
import styled from "styled-components";
import { FBXLoader } from "../../Utility/Loaders/FBXLoader";
import Sound from "../../Assets/Birds.m4a";
import TypeFace from '../../Assets/Fonts/karla.json'
const EnvironmentWrapper = styled.div`
  height: 100vh;
`;

export const ModelTypes = {
  PAGE: 'PAGE',
  EXHIBIITION_ITEM: 'EXHIBIITION_ITEM'
}

const PageConfig = {
  'ABOUT': 'FbxScene_udgkcewhw_LOD0',
  'CONTAGION': 'FbxScene_ucmjdfkhw_LOD0'
}


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
    this.removeEventListeners()


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
    await this.startLoadingProcess();
    // Skybox
    this.setupSky();
    this.createRayCaster();
    this.setupOrbitControls();
    this.setupStats();
    this.addEventListeners()
  };

  addEventListeners = () => {
    document.addEventListener("touchstart", this.onDocumentTouchStart, false);
    document.addEventListener("mouseup", this.onDocumentMouseDown, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    window.addEventListener("resize", this.onWindowResize, false);
  }

  removeEventListeners = () => {
    window.removeEventListener("resize", this.onWindowResize);
    document.removeEventListener("mouseup", this.onDocumentMouseDown);
    document.removeEventListener("mousemove", this.onDocumentMouseMove);
    document.removeEventListener("touchstart", this.onDocumentTouchStart, false);
  }
  setupCamera = (width, height) => {
    this.camera = new THREE.PerspectiveCamera(
      70, // fov = field of view
      width / height, // aspect ratio
      1, // near plane
      5000 // far plane
    );
    this.camera.aspect = width / height;
    this.camera.position.set(-414, 514, 1544);
    // this.camera.lookAt(this.centralPoint)
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

    // this.updateSun();

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
    this.scene.fog = new THREE.FogExp2(0x72869d, 0.001);
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

  setMouse = (event) => {
    this.mouse.x = (event.clientX / this.mount.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.mount.clientHeight) * 2 + 1;
  }
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



  loadOBJFile = async (materialUri, OBJUri) => {
    let loader = new MTLLoader(this.manager);

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
    await this.setExhibitionItems();
    await this.setPages();
    await this.loadFBXFile();
    this.loadAudio();
    this.loadFont()
  };

  hasLoaded = () => {
    this.addFBXFile();
    this.assignExhibitionItemsToClickableObjects();
    this.addSound();
    this.props.hasLoaded();
  };

  loadFBXFile = async () => {
    let loader = new FBXLoader(this.manager);
    // await this.setExhibitionItems();
    loader.load(
      ExplosionFBX,
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

  addFont = (textInfo, position, colour = "black") => {
      if(this.font && textInfo) {
        var geometry = new THREE.TextBufferGeometry(textInfo, {
          font: this.font,
          size: 4,
          height: 1,
          curveSegments: 20,

        });
  
        let material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(colour)
        });
        let text = new THREE.Mesh(geometry, material);
        text.position.x = position.x + 50;
        text.position.y = position.y + 20;
        text.position.z = position.z;
        this.scene.add(text);
        return text
      }
  }
  addFBXFile = () => {
    if (this.centerObject) {
      let meshes = [...this.centerObject.children];
      meshes.forEach((mesh) => {
        mesh.position.add(this.centralPoint)
        mesh.updateMatrix()
        mesh.geometry.computeBoundingSphere()
        mesh.geometry.computeBoundingBox()

        // Get World position of mesh
        let spherePosition = mesh.geometry.boundingSphere.center;
        let position = new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z).add(spherePosition)
        mesh.worldPosition = position;

        // Get Top position fo mesh by getting difference between min and max
        let diff = mesh.geometry.boundingBox.max;
        diff = diff.sub(mesh.geometry.boundingBox.min)
        // this.createObjectBoundary(diff.x, diff.y, mesh.worldPosition)

        let topPosition = position;
        topPosition.y = topPosition.y + (diff.y / 2)
        mesh.topPosition = topPosition;

        mesh.castShadow = true;

        mesh.callback = (id, type) => this.objectSelected(id, type);
        
        this.clickableObjects.push(mesh);
        // this.createObjectBoundary(mesh.geometry.boundingSphere.radius, boundary)
        this.scene.add(mesh);

      });
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
  setPages = async () => {
    let pages = await RequestManager.getPages();
    this.props.setPages(pages);
  };

  createAudioListener = () => {
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);
    this.sound = new THREE.Audio(this.listener);
  };

  createObjectBoundary = (width, height, position) => {
    let material = new THREE.MeshStandardMaterial();
    material.opacity = 0.2;
    material.transparent = true;
    material.visible = true;

    let geometry = new THREE.BoxGeometry(width, height);

    let boundary = new THREE.Mesh(geometry, material);

    boundary.position.x = position.x;
    boundary.position.y = position.y;
    boundary.position.z = position.z;

    this.scene.add(boundary);
  };
  

  objectSelected = (id, modelType) => {
    this.sound.play();
    this.props.openModal(id, modelType);
    this.setState({
      pause: true
    });
  };

  createAxes = () => {
    var axesHelper = new THREE.AxesHelper(10);
    this.scene.add(axesHelper);
  };

  createLine = (position, colour) => {
    var material = new THREE.LineBasicMaterial({
      color: colour,
      linewidth: 2,
    });
    
    var points = [];
    points.push( new THREE.Vector3(position.x, position.y, position.z) );
    points.push( new THREE.Vector3(position.x + 50, position.y + 50, position.z) );
    points.push( new THREE.Vector3(position.x + 100, position.y + 50, position.z) );
    
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    var line = new THREE.Line( geometry, material );
    this.scene.add( line );
  }

  assignExhibitionItemsToClickableObjects = () => {
    let distance = 10

    // ASSIGN EXHIBITION ITEMS
    this.props.exhibition_items.forEach((item, index) => {
      if (index + 1 <= this.clickableObjects.length) {
        //  Split description into array of words
        let arr = [];

        // desc.forEach((it, i) => {
        //   if(i !== 0 && i % sentenceLength === 0) {
        //     arr.push(sentence);
        //     sentence = ''
        //   }

        //   sentence =  sentence.concat(` ${it}`);

        //   if(i + 1 === desc.length) {
        //     arr.push(sentence);
        //   }
        // })

        arr.push(item.title, item.participant)
        let position = this.clickableObjects[index].topPosition;
        position.y = position.y + (distance * arr.length)
        let text = []; 
        arr.forEach((sentence) => {
          text.push(this.addFont(sentence, position, "black"))
          position.y = position.y - distance;
        })
        this.createLine(this.clickableObjects[index].topPosition, 'black')

        this.clickableObjects[index].model_id = item.id;
        this.clickableObjects[index].model_type = ModelTypes.EXHIBIITION_ITEM;
        this.clickableObjects[index].text = text
      }
    });

    
    // ASSIGN PAGES
    let aboutIndex = this.clickableObjects.findIndex((value) => {
      return value.name === PageConfig.ABOUT
    })

    if(aboutIndex) {
      let page = this.props.pages.find((value) => {
        return 'ABOUT' === value.title.toUpperCase()
      })

      let text = [];
      let position = this.clickableObjects[aboutIndex].topPosition;
      position.y =  position.y + (distance * 2)
      text.push(this.addFont(page.title, position, 'green'));
      this.createLine(this.clickableObjects[aboutIndex].topPosition, 'green')

      this.clickableObjects[aboutIndex].model_type = ModelTypes.PAGE
      this.clickableObjects[aboutIndex].model_id= page.id

    }

    let contagionIndex = this.clickableObjects.findIndex((value) => {
      return value.name === PageConfig.CONTAGION
    })

    if(contagionIndex) {
      let page = this.props.pages.find((value) => {
        return 'CONTAGION' === value.title.toUpperCase()
      })

      let text = [];
      text.push(this.addFont(page.title, this.clickableObjects[contagionIndex].topPosition, 'green'));
      this.createLine(this.clickableObjects[contagionIndex].topPosition, 'green')

      this.clickableObjects[contagionIndex].model_type = ModelTypes.PAGE
      this.clickableObjects[contagionIndex].model_id= page.id
    }
    // Remove Clickable that has no model type or Id
    this.clickableObjects = this.clickableObjects.filter((obj) => {
      return obj.model_type;
    })

  };

  setupOrbitControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.controls.enableKeys = true;
    this.controls.enablePan = true;
    this.controls.minDistance = 0;
    this.controls.maxDistance = 2000;
    this.controls.target = this.centralPoint;
    this.controls.keyPanSpeed = 20;
    this.controls.panSpeed = 3;
    this.controls.maxPolarAngle = 2 * Math.PI;
    this.controls.maxAzimuthAngle = Infinity;
    this.controls.update();
  };

  hideInstructions = () => {
    if(this.props.show_instructions) {
      setTimeout(() => {
        this.props.hideInstructions()
      }, 1000)
    }
  }

  // Here should come custom code.
  // Code below is taken from Three.js BoxGeometry example
  // https://threejs.org/docs/#api/en/geometries/BoxGeometry

  onDocumentMouseDown = event => {
    this.hideInstructions();
    this.setMouse(event)
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.clickableObjects);
    
    if (this.intersects.length > 0) {
      let mesh = this.intersects[0];
      if (mesh.object.callback && mesh.object.model_id) {
        mesh.object.callback(mesh.object.model_id, mesh.object.model_type);
      }
    }
  };



  onDocumentMouseMove = event => {
    event.preventDefault();
    this.hideInstructions();
    this.setMouse(event)
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.clickableObjects);
    if(this.intersects.length > 0) {
      if(!this.isHovering) {
        this.isHovering = true;
        let obj = this.intersects[0].object
        this.addColourToMesh(obj);
      }
    } else {
      if(this.isHovering) {
        this.isHovering = false;
        this.removeColourFromAllMesh()
      }
    } 
  };
  
  addColourToMesh = (obj) => {
    obj.material.color.r = 0;
    obj.material.color.g = 0;
    obj.material.color.b = 0;
    obj.material.emissive.r = 0.4; 
    obj.material.emissive.g = 1; 
    obj.material.emissive.b = 0; 
  }

  removeColourFromAllMesh = () => {
    this.clickableObjects.forEach((obj) => {
      obj.material.color.r = 0;
      obj.material.color.g = 0;
      obj.material.color.b = 0;
      obj.material.emissive.r = 0; 
      obj.material.emissive.g = 0; 
      obj.material.emissive.b = 0; 
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
      if (mesh.object.callback && mesh.object.model_id) {
        mesh.object.callback(mesh.object.model_id, mesh.object.model_type);
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
    this.controls.update()
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
    pages: state.pages,
    show_instructions: state.show_instructions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hasLoaded: () => dispatch(hasLoaded()),
    openModal: (item, type) => dispatch(openModal(item, type)),
    setExhibitionItems: exhibitionItems =>
      dispatch(setExhibitionItems(exhibitionItems)),
    setPages: pages => 
      dispatch(setPages(pages)),
    loading: (loaded, total) => dispatch(loading(loaded, total)),
    hideInstructions:  () => dispatch(hideInstructions())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Environment);
