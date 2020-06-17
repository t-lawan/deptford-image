import React, { Component } from "react";
import { connect } from "react-redux";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "../../Utility/Objects/Water";
import waternormals from "../../Assets/waternormals.jpg";
import { Sky } from "../../Utility/Objects/Sky";
import ExplosionSceneFBX from "../../Assets/Models/Small_Explosion.fbx";
// import ExplosionFBX from "../../Assets/Models/Test.fbx";
import { MTLLoader } from "../../Utility/Loaders/MTLLoader";
import { OBJLoader } from "../../Utility/Loaders/OBJLoader";
import Stats from "../../Utility/Stats";
import {
  hasLoaded,
  openModal,
  setExhibitionItems,
  loading,
  setPages,
  setMediaAssets,
  hideInstructions,
  showInstructions
} from "../../Store/action";
import RequestManager from "../../Utility/RequestManager";
import styled from "styled-components";
import { FBXLoader } from "../../Utility/Loaders/FBXLoader";
import Sound from "../../Assets/Touch.mp3";
import PositionalSound from "../../Assets/Contagion.mp3";
import TypeFace from "../../Assets/Fonts/Grotesk_Light_Extended.json";
import { FlyControls } from "../../Utility/FlyControl";
import Device from "../../Utility/Device";
import {
  ObjectExhibitionMap,
  ModelTypes
} from "../../Utility/ObjectExhibitionMap";
import { Colour } from "../Global/global.styles";
const EnvironmentWrapper = styled.div`
  height: 100vh;
  overflow-y: hidden;
  position: fixed;
  width: 100%;
`;

const DisplayContainer = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
`

const DisplayText = styled.p`
  color: 'black';
  display: ${props => props.show ? 'block': 'none'};
  cursor: pointer;
  :hover {
    font-style: italic;
  }
`

class Environment extends Component {
  centralPoint = new THREE.Vector3(0, 500, 10);
  cameraPosition = new THREE.Vector3(-414, 514, 1544);
  clickableObjects = [];
  isHovering = false;
  hasInteracted = false;
  isMobile = false;
  textArray = [];
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      firstCall: true
    };
    // device detection
    if (Device.isMobile()) {
      this.isMobile = true;
    }
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
    this.removeEventListeners();
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
    this.createScene(width, height);

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
    if (this.isMobile) {
      this.setupOrbitControls();
    } else {
      this.setupFlyControls();
    }

    // this.setupStats();
    this.addEventListeners();
  };

  addEventListeners = () => {
    document.addEventListener("touchstart", this.onDocumentTouchStart, false);
    document.addEventListener("keydown", this.onKeyDown, false)
    document.addEventListener("dblclick", this.onDocumentDoubleClick, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    window.addEventListener("resize", this.onWindowResize, false);
  };

  removeEventListeners = () => {
    window.removeEventListener("resize", this.onWindowResize);
    document.removeEventListener("dblclick", this.onDocumentDoubleClick);
    document.removeEventListener("keydown", this.onKeyDown)
    document.removeEventListener("mousemove", this.onDocumentMouseMove);
    document.removeEventListener(
      "touchstart",
      this.onDocumentTouchStart,
      false
    );
  };
  setupCamera = (width, height) => {
    this.camera = new THREE.PerspectiveCamera(
      70, // fov = field of view
      width / height, // aspect ratio
      1, // near plane
      5000 // far plane
    );
    this.camera.aspect = width / height;
    this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
    this.camera.lookAt(this.centralPoint);
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
  createScene = (width, height) => {
    this.scene = new THREE.Scene();
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext("2d");
    var grd = ctx.createLinearGradient(0, 0, 0, height/16);
    grd.addColorStop(0,'white');
    grd.addColorStop(1, Colour.grey);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height); 
    let texture = new THREE.CanvasTexture(canvas)
    this.scene.background = texture;
    this.scene.fog = new THREE.FogExp2(new THREE.Color("white"), 0.001);
  };
  createLight = () => {
    let distance = 5000;
    this.light = new THREE.DirectionalLight(0xffffff, 5);
    this.light.position.add(this.centralPoint);

    let point_one = new THREE.PointLight(0xffffff, 2, 1000);
    let point_two = new THREE.PointLight(0xffffff, 1, 1000);


    point_one.position.add(this.centralPoint);
    point_one.position.setZ(point_one.position.z - distance);
    point_one.position.setX(point_one.position.x - distance);
    point_two.position.add(this.centralPoint);
    point_two.position.z  = point_two.position.z + distance;
    point_two.position.x  = point_two.position.x + distance;

    let targetObject = new THREE.Object3D();
    targetObject.position.set(
      this.centralPoint.x,
      this.centralPoint.y,
      this.centralPoint.z
    );
    this.scene.add(targetObject);
    this.light.target = targetObject;
    this.scene.add(this.light);

    this.scene.add(point_one);
    this.scene.add(point_two);
  };
  createRayCaster = () => {
    this.raycaster = new THREE.Raycaster();
  };
  createMouse = () => {
    this.mouse = new THREE.Vector2();
  };

  setMouse = event => {
    this.mouse.x = (event.clientX / this.mount.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.mount.clientHeight) * 2 + 1;
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
    await this.setAssets();
    await this.loadFBXFile();
    this.loadAudio();
    this.loadLocalSound();
    this.loadFont();
  };

  hasLoaded = () => {
    this.addFBXFile();
    this.assignExhibitionItemsToClickableObjects();
    this.addSound();
    this.addLocalSound();
    this.props.hasLoaded();
  };

  loadFBXFile = async () => {
    let loader = new FBXLoader(this.manager);
    
    // await loader.load(
    //   "https://dl.dropboxusercontent.com/s/gzb2gz1m9cg0h49/Test.fbx",
    //   object => {
    //     this.centerObject = object;
    //   },
    //   this.loadProgressing
    // );
    loader.load(
      ExplosionSceneFBX,
      object => {
        this.centerObject = object;
      },
      this.loadProgressing
    );
  };

  loadFont = () => {
    var loader = new THREE.FontLoader(this.manager);
    this.font = loader.parse(TypeFace);
  };

  loadAudio = () => {
    this.globalAudioLoader = new THREE.AudioLoader(this.manager);

    this.globalAudioLoader.load(Sound, buffer => {
      this.globalSound.setBuffer(buffer);
    });
  };

  loadLocalSound = () => {
    this.audioLoader = new THREE.AudioLoader(this.manager);

    this.audioLoader.load(PositionalSound, buffer => {
      this.sound.setBuffer(buffer);
    });
  };

  loadProgressing = (url, itemsLoaded, itemsTotal) => {
    this.props.loading(itemsLoaded, itemsTotal);
  };

  addFont = (textInfo, position, colour) => {
    if (this.font && textInfo) {
      var geometry = new THREE.TextBufferGeometry(textInfo, {
        font: this.font,
        size: 6,
        height: 1,
        curveSegments: 30,
      });

      let material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(colour),
        emissive: new THREE.Color(colour),
        emissiveIntensity: 1,
        reflectivity: 0,
        shininess: 0,
        specular: new THREE.Color('black')
      });
      let text = new THREE.Mesh(geometry, material);
      text.position.x = position.x + 50;
      text.position.y = position.y + 10;
      text.position.z = position.z;
      this.scene.add(text);
      this.textArray.push(text)
      return text;
    }
  };

  rotateAllText = () => {
    this.textArray.forEach((text) => {
      return text.geometry.lookAt(this.camera.position)
    })
  }
  addFBXFile = () => {
    if (this.centerObject) {
      let groups = [...this.centerObject.children];
      // console.log('MESHES', meshes)
      // let text = meshes.map((me) => {
      //   return me.name
      // })
      let meshes = [];
      groups.forEach(group => {
        meshes.push(...group.children);
      });

      meshes.forEach(mesh => {
        mesh.position.add(this.centralPoint);
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.updateMatrix();
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeBoundingBox();

        if (mesh.material) {
          // mesh.material.map.name = TestImage

          mesh.material.specular.r = 0;
          mesh.material.specular.g = 0;
          mesh.material.specular.b = 0;
          mesh.material.shininess = 2;
          // mesh.material.emissive.r = 0.5
          // mesh.material.emissive.g = 0.5
          // mesh.material.emissive.b = 0.5

          mesh.material.morphNormals = true;
          mesh.material.morphTargets = true;
          // console.log('MESHES', mesh.material)
        }

        // Get World position of mesh
        let spherePosition = mesh.geometry.boundingSphere.center;
        let position = new THREE.Vector3(
          mesh.position.x,
          mesh.position.y,
          mesh.position.z
        ).add(spherePosition);
        mesh.worldPosition = position;

        // Get Top position fo mesh by getting difference between min and max
        let diff = mesh.geometry.boundingBox.max;
        diff = diff.sub(mesh.geometry.boundingBox.min);
        mesh.objectBoundary = this.createObjectBoundary(
          diff.x,
          diff.y,
          diff.z,
          mesh.worldPosition
        );

        let topPosition = position;
        topPosition.y = topPosition.y + diff.y / 2;
        mesh.topPosition = topPosition;

        mesh.castShadow = true;

        mesh.objectBoundary.callback = (id, type) =>
          this.objectSelected(id, type);

        this.clickableObjects.push(mesh);
        // this.createObjectBoundary(mesh.geometry.boundingSphere.radius, boundary)
        this.scene.add(mesh);
      });
    }
  };

  addSound = () => {
    this.globalSound.setLoop(false);
    this.globalSound.setVolume(1);
    this.globalSound.duration = 1;
  };

  addLocalSound = () => {
    this.sound.setRefDistance(100);
    this.sound.setLoop(true);
    this.sound.setVolume(1);

    let item = this.clickableObjects.find(i => {
      return i.name === "FbxScene_udgkcewhw_LOD0";
    });
    if (item) {
      item.add(this.sound);
    }
    // this.sound.play()
  };

  stopAllSound = () => {
    this.globalSound.setVolume(0);
    this.sound.setVolume(0);
  };

  playSound = () => {
    if (!this.sound.isPlaying) {
      this.sound.play();
    }
  };

  setExhibitionItems = async () => {
    let exhibitionItems = await RequestManager.getExhibitionItems();
    this.props.setExhibitionItems(exhibitionItems);
  };
  setPages = async () => {
    let pages = await RequestManager.getPages();
    this.props.setPages(pages);
  };

  setAssets = async () => {
    let assets = await RequestManager.getAssets();
    this.props.setMediaAssets(assets);
  };

  createAudioListener = () => {
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);
    this.globalSound = new THREE.Audio(this.listener);
    this.sound = new THREE.PositionalAudio(this.listener);
  };

  createObjectBoundary = (width, height, depth, position) => {
    let material = new THREE.MeshStandardMaterial();
    material.opacity = 0;
    material.transparent = true;
    material.visible = false;

    let geometry = new THREE.BoxGeometry(width, height, depth);
    let boundary = new THREE.Mesh(geometry, material);

    boundary.position.x = position.x;
    boundary.position.y = position.y;
    boundary.position.z = position.z;

    this.scene.add(boundary);

    return boundary;
  };

  objectSelected = (id, modelType) => {
    this.sound.pause();
    this.globalSound.play();
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
      linewidth: 2
    });

    var points = [];
    points.push(new THREE.Vector3(position.x, position.y, position.z));
    points.push(
      new THREE.Vector3(position.x + 50, position.y + 50, position.z)
    );
    points.push(
      new THREE.Vector3(position.x + 100, position.y + 50, position.z)
    );

    var geometry = new THREE.BufferGeometry().setFromPoints(points);

    var line = new THREE.Line(geometry, material);
    this.scene.add(line);
  };

  assignExhibitionItemsToClickableObjects = () => {
    let distance = 10;
    this.clickableObjects.forEach((obj, index) => {
      let objectReference = ObjectExhibitionMap[obj.name];
      if (objectReference) {
        if (objectReference.type === ModelTypes.EXHIBIITION_ITEM) {
          let item = this.props.exhibition_items.find(exItem => {
            return exItem.map_id === objectReference.id;
          });
          let colour = item.is_live ? Colour.green : "black";
          //  Push
          let arr = [];
          arr.push(item.displayed_time, item.participant, `"${item.title}"`);
          let position = this.clickableObjects[index].topPosition;
          position.y = position.y + distance * arr.length;
          let text = [];
          arr.forEach(sentence => {
            text.push(this.addFont(sentence, position, 'black'));
            position.y = position.y - distance;
          });

          this.createLine(this.clickableObjects[index].topPosition, 'black');

          this.clickableObjects[index].objectBoundary.model_id = item.id;
          this.clickableObjects[index].objectBoundary.model_title = item.title;
          this.clickableObjects[index].objectBoundary.model = item;
          this.clickableObjects[index].objectBoundary.model_type =
            ModelTypes.EXHIBIITION_ITEM;
          this.clickableObjects[index].objectBoundary.text = text;
          // if(index === 10) {
          // console.log('EX TEXT', text)
          if(item.is_live){
            this.createTextBox(text);
          }

          // }
        }

        if (objectReference.type === ModelTypes.PAGE) {
          let item = this.props.pages.find(pg => {
            return pg.title.toLowerCase() === objectReference.id;
          });
          let text = [];
          let position = this.clickableObjects[index].topPosition;
          position.y = position.y + distance * 2;
          text.push(this.addFont(item.title, position, 'black'));
          position.y = position.y - distance * 2;
          this.createLine(this.clickableObjects[index].topPosition, 'black');

          this.clickableObjects[index].objectBoundary.model_type =
            ModelTypes.PAGE;
          this.clickableObjects[index].objectBoundary.model_id = item.id;
          this.clickableObjects[index].objectBoundary.text = text;

          this.createTextBox(text);
        }
      } else {
      }
    });

    // Remove Clickable that has no model type or Id
    // this.clickableObjects = this.clickableObjects.filter(obj => {
    //   return obj.model_type;
    // });
  };

  createTextBox = (arrayOfText) => {
    let vPadding = 5;
    let hPadding = 5;
    let box = new THREE.Box3()
    let text;
    let diff;
    if(arrayOfText.length > 1) {
      arrayOfText.forEach((text) => {
        text.geometry.computeBoundingBox(); 

      box = box.union(text.geometry.boundingBox) 
      })
      // console.log('GEO BOX', text.geometry.boundingBox)
      // console.log('BEFORE BOX', box)
      // box = box.union(text.geometry.boundingBox)
      // console.log('AFTER BOX', box)
      // box = arrayOfText[0].geometry.boundingBox
      // box.union(arrayOfText[2].geometry.boundingBox)
      vPadding = 20;
      diff = box.max;
      diff = diff.sub(box.min);
      text = arrayOfText[1];

    } else {
      text = arrayOfText[0];
      text.geometry.computeBoundingBox();
      box = text.geometry.boundingBox;
      diff = box.max;
      diff = diff.sub(box.min);
      // this.createObjectBoundary(diff.x,diff.y, diff.z, text.position)
    }

    var material = new THREE.LineBasicMaterial({
      color: Colour.green,
      linewidth: Device.isMobile() ? 1 : 10,

    });

    var points = [];

    let startPosition = box.min.add(text.position)

    points.push(
      new THREE.Vector3(startPosition.x - hPadding, startPosition.y + vPadding, startPosition.z)
    );
    // Add to Y axis
    points.push(
      new THREE.Vector3(startPosition.x - hPadding, startPosition.y + diff.y + (vPadding), startPosition.z)
    );

    // Add to X + Y axis
    points.push(
      new THREE.Vector3(startPosition.x + diff.x + hPadding, startPosition.y + diff.y + vPadding, startPosition.z)
    );

    // Add to Y axis
    points.push(
        new THREE.Vector3(startPosition.x + diff.x + hPadding, startPosition.y - vPadding, startPosition.z)
    );
    // // Add to X + Y Axis
    points.push(
      new THREE.Vector3(startPosition.x - hPadding, startPosition.y - vPadding, startPosition.z)
    );

    points.push(
      new THREE.Vector3(startPosition.x - hPadding, startPosition.y + ( vPadding), startPosition.z)
    );

    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }

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

  setupFlyControls = () => {
    this.controls = new FlyControls(this.camera, this.renderer.domElement);
    this.controls.dragToLook = true;
    this.controls.movementSpeed = 10;
    this.controls.rollSpeed = 0.008;
    this.controls.update(1);
  };

  // Here should come custom code.
  // Code below is taken from Three.js BoxGeometry example
  // https://threejs.org/docs/#api/en/geometries/BoxGeometry
  canOpen = (object) => {
    if(object.model_type === ModelTypes.PAGE) {
      return true
    }

    if(!object.model) {
      return false;
    }

    return object.model.is_live;
  }

  onDocumentDoubleClick = event => {
    if (!this.state.pause) {
      this.setMouse(event);
      let boundingBoxes = this.clickableObjects.map(object => {
        return object.objectBoundary;
      });
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.intersects = this.raycaster.intersectObjects(boundingBoxes);
      if (this.intersects.length > 0) {
        let mesh = this.intersects[0];

        if (mesh.object.callback && mesh.object.model_id && this.canOpen(mesh.object)) {
          mesh.object.callback(mesh.object.model_id, mesh.object.model_type);
        }
      }
    }
  };

  onDocumentTouchStart = event => {
    if (!this.state.pause) {
      // event.preventDefault();
      this.hideInstructions()

      this.mouse.x =
        (event.targetTouches[0].clientX / this.mount.clientWidth) * 2 - 1;
      this.mouse.y =
        -(event.targetTouches[0].clientY / this.mount.clientHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      let boundingBoxes = this.clickableObjects.map(object => {
        return object.objectBoundary;
      });
      this.intersects = this.raycaster.intersectObjects(boundingBoxes);
      if (this.intersects.length > 0) {
        let mesh = this.intersects[0];
        if (mesh.object.callback && mesh.object.model_id && this.canOpen(mesh.object)) {
          mesh.object.callback(mesh.object.model_id, mesh.object.model_type);
        }
      }
    }
  };

  onKeyDown = event => {
    if (!this.state.pause) {
      this.hideInstructions()
      this.playSound();
    }
  };

  hideInstructions = () => {
    if(this.props.show_instructions) {
      setTimeout(() => {
        this.props.hideInstructions();
      }, 1500)
    }
  }

  onDocumentMouseMove = event => {
    if (!this.state.pause) {
      event.preventDefault();
      this.setMouse(event);
      this.raycaster.setFromCamera(this.mouse, this.camera);
      let boundingBoxes = this.clickableObjects.map(object => {
        return object.objectBoundary;
      });
      this.intersects = this.raycaster.intersectObjects(boundingBoxes, true);
      if (this.intersects.length > 0) {
        if (!this.isHovering) {
          this.isHovering = true;
          // let index = boundingBoxes.findIndex((box) => {
          //   return box.
          // })
          let obj = this.intersects[0].object;
          if(this.canOpen(obj)) {
            let index = boundingBoxes.findIndex((box) => {
              return box.id === obj.id;
            })
  
            this.addColourToMesh(this.clickableObjects[index]);
          }
        }
      } else {
        if (this.isHovering) {
          this.isHovering = false;
          this.removeColourFromAllMesh();
        }
      }
    }
  };


  addColourToMesh = obj => {
    obj.material.color.r = 1;
    obj.material.color.g = 1;
    obj.material.color.b = 1;

    obj.material.emissive.r = 0;
    obj.material.emissive.g = 1;
    obj.material.emissive.b = 0;

  };

  removeColourFromAllMesh = () => {
    this.clickableObjects.forEach(obj => {
      obj.material.color.r = 1;
      obj.material.color.g = 1;
      obj.material.color.b = 1;
      obj.material.emissive.r = 0;
      obj.material.emissive.g = 0;
      obj.material.emissive.b = 0;
    });
  };

  returnHome = () => {
    this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
    this.camera.lookAt(this.centralPoint);
    this.camera.updateProjectionMatrix();
    this.props.showInstructions()
  }

  onWindowResize = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    this.camera.updateProjectionMatrix();
    if (this.isMobile) {
      this.controls.update();
    } else {
      this.controls.update(1);
    }
  };

  animate = () => {
    this.requestID = requestAnimationFrame(this.animate);
    if (this.isMobile) {
      this.controls.update();
    } else {
      this.controls.update(1);
    }
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
    return (
    <EnvironmentWrapper ref={ref => (this.mount = ref)}> 
      <DisplayContainer> <DisplayText onClick={() => this.returnHome()} show={!this.props.show_instructions}> Return </DisplayText> </DisplayContainer>  
    </EnvironmentWrapper>
    );
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
    setPages: pages => dispatch(setPages(pages)),
    setMediaAssets: assets => dispatch(setMediaAssets(assets)),
    loading: (loaded, total) => dispatch(loading(loaded, total)),
    hideInstructions: () => dispatch(hideInstructions()),
    showInstructions: () => dispatch(showInstructions())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Environment);
