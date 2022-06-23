// Hacked from Yuri at 
// https://www.youtube.com/watch?v=87J8EhKMH6c  
// https://www.patreon.com/allyourhtml/posts
// https://gist.github.com/akella/a19954c9ee42e3ae85b76d0e06977535

// import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { VertexTangentsHelper } from 'three/examples/jsm/helpers/VertexTangentsHelper.js';

// import { GridHelper } from 'three/examples/jsm/helpers/GridHelper.js';
// import { SkeletonHelper } from 'three/examples/jsm/helpers/SkeletonHelper.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// "dat.gui": "^0.7.9",
// "gsap": "^3.10.4",
// import fragment from "./shader/fragment.glsl";
// import vertex from "./shader/vertex.glsl";
// import * as dat from "dat.gui";
// import gsap from "gsap";

import front from '../front.png'
import back from '../back.png'

let THREE
let OrbitControls
let VertexTangentsHelper

export default class Ribbon {
  constructor( three, orbitControls, vertexTangentsHelper ) {
    THREE = three
    OrbitControls = orbitControls
    VertexTangentsHelper = vertexTangentsHelper
  }
  explicitConstructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1); 
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // this.camera.position.set(0, 0, 2);
    this.camera.position.set(0, 0.5, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;
  }

  addAndRender({
      curveObject,
      finalMesh,
      tubeMeshes,
    }) {

    this.scene.add( curveObject )

    this.scene.add( finalMesh )

    for( const tm in tubeMeshes ) {
      this.scene.add( tubeMeshes[ tm ] )
    }

    // // curveObject.geometry.toNonIndexed()
    // finalMesh.geometry.computeVertexNormals()
    // finalMesh.geometry.computeTangents()
    // const helper = new VertexTangentsHelper( finalMesh, 1, 0x00ffff, 1 );
    // // const helper = new VertexTangentsHelper( geometry, 1, 0x00ffff, 1 );
    // // const helper = new VertexTangentsHelper( curveObject, 1, 0x00ffff, 1 );
    // this.scene.add(helper);

    finalMesh.geometry.computeVertexNormals()
    finalMesh.geometry.computeTangents()
    const helper = new THREE.SkeletonHelper( finalMesh );
    this.scene.add(helper);

    const gridHelper = new THREE.GridHelper( 10, 10 );
    this.scene.add( gridHelper );

    // this.resize();
    this.render();
    // this.setupResize();
    this.addLights()
    // this.settings();
  }


  addLights(){

    // this.scene.add(new THREE.AmbientLight(0xffffff,0.86))
    // this.scene.add(new THREE.AmbientLight(0xffffff,0.16))

    // let dirLight = new THREE.DirectionalLight(0xffffff,5)
    // dirLight.position.set(0,-10,-10)
    // let dirLight = new THREE.DirectionalLight(0x0000ff,5)
    let dirLight = new THREE.DirectionalLight(0xffffff, 10)
    dirLight.position.set(0,5,5)
    dirLight.position.set( 0, 5, 5 )
    this.scene.add(dirLight)
  }

  // settings() {
  //   let that = this;
  //   this.settings = {
  //     progress: 0,
  //   };
  //   this.gui = new dat.GUI();
  //   this.gui.add(this.settings, "progress", 0, 1, 0.01);
  // }

  // setupResize() {
  //   window.addEventListener("resize", this.resize.bind(this));
  // }

  // resize() {
  //   this.width = this.container.offsetWidth;
  //   this.height = this.container.offsetHeight;
  //   this.renderer.setSize(this.width, this.height);
  //   this.camera.aspect = this.width / this.height;
  //   this.camera.updateProjectionMatrix();
  // }

  getObjects( args = {} ) {
    const { 
      vectors = [
        new THREE.Vector3( 0, 0, 1.5 ),
        new THREE.Vector3( 0, 0, 1.0 ),
        new THREE.Vector3( 0, 0, 0.0 ),
        new THREE.Vector3( -.500, .2500, -0.500 ),
        new THREE.Vector3( .500, .500, -1.00 ),
        new THREE.Vector3( 1, 1, -2.00 ),
        new THREE.Vector3( 1, 2, -3.00 ),
        new THREE.Vector3( -2, 2.5, -4.00 ),
      ], 
      width = 0.1,
      // frontColor = 'red',
      // frontColor = '0x44aaff',
      frontColor = 'blue',
      // backColor = 'Aquamarine',
      // backColor = 'green',
      backColor = 'Aqua',
    } = args
    const frontTexture = new THREE.TextureLoader().load(front);
    const backTexture = new THREE.TextureLoader().load(back);

    [frontTexture,backTexture].forEach(t=>{
      t.wrapS = 1000;
      t.wrapT = 1000;
      t.repeat.set(1,1);
      t.offset.setX(0.5)
      t.flipY = false
    })

    backTexture.repeat.set(-1,1)
    // frontTexture.flipY = false


    // let frontMaterial = new THREE.MeshStandardMaterial({
    //   map: frontTexture,
    //   side: THREE.BackSide,
    //   roughness: 0.65,
    //   metalness: 0.25,
    //   alphaTest: true,
    //   flatShading: true
    // })

    // let backMaterial = new THREE.MeshStandardMaterial({
    //   map: backTexture,
    //   side: THREE.FrontSide,
    //   roughness: 0.65,
    //   metalness: 0.25,
    //   alphaTest: true,
    //   flatShading: true
    // })

    let frontMaterialOld = new THREE.MeshStandardMaterial({
      // map: frontTexture,
      color: 'red',
      side: THREE.BackSide,
      // roughness: 0.65,
      // metalness: 0.25,
      // alphaTest: true,
      // flatShading: true,
      // wireframe: true,
    })

    // const frontMaterial = new THREE.MeshBasicMaterial( { 
    //   color: 0xffff00,
    //   side: THREE.BackSide,
    //   // flatShading: false,
    //   // wireframe: true,
    // })
    // const frontMaterial = new THREE.LineBasicMaterial( { 
    //   color : 0x44aaff,
    //   side: THREE.BackSide,
    // } );
    let frontMaterial = new THREE.MeshStandardMaterial({
    // const frontMaterial = new THREE.MeshLambertMaterial({ 
    // const frontMaterial = new THREE.MeshPhongMaterial({ 
    // const frontMaterial = new THREE.MeshNormalMaterial({ 
      side: THREE.FrontSide,
      // color: 'green',
      // color: 0xb000bb, 
      // color : 0x44aaff,
      color: frontColor,
      roughness: 0.65,
      metalness: 0.25,
      alphaTest: true,
      // flatShading: true,
      // wireframe: false 
    });

    let backMaterial = new THREE.MeshStandardMaterial({
    // let backMaterial = new THREE.MeshNormalMaterial({
      side: THREE.BackSide,
      // map: backTexture,
      // color : 0x44aaff,
      color: backColor,
      roughness: 0.65,
      metalness: 0.25,
      alphaTest: true,
      // flatShading: true,
      // wireframe: true,
    })

    // const doubleSidedMaterial = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    // const doubleSidedMaterial = new THREE.MeshNormalMaterial( { side: THREE.DoubleSide, wireframe: true } )

    




    // this.geometry = new THREE.SphereBufferGeometry(1, 30,30);
    // this.plane = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({color: 0x00ff00,wireframe: true}));
    // this.scene.add(this.plane);



    // let num = 7;
    // let curvePoints = []
    // for (let i = 0; i < num; i++) {
    //   let theta = i/num * Math.PI*2;
    //     curvePoints.push(
    //       new THREE.Vector3().setFromSphericalCoords(
    //         1, Math.PI/2 + 0.9*(Math.random() - 0.5),theta
    //       )
    //     )
    // }
    const curvePoints = vectors

    const curve = new THREE.CatmullRomCurve3( curvePoints );
    curve.tension = 0.7;
    // curve.closed = true;
    curve.closed = false;

    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    // Create the final object to add to the scene
    const curveObject = new THREE.Line( geometry, material );


    // this.scene.add(curveObject);

    let number = 10000;

    // let frenetFrames = curve.computeFrenetFrames(number, true)
    let frenetFrames = curve.computeFrenetFrames(number, false)
    let spacedPoints = curve.getSpacedPoints(number)
    let tempPlane = new THREE.PlaneBufferGeometry(1,1,number,1)
    // let dimensions = [-.1,0.1]
    let dimensions = [ -width, +width ]

    this.materials = [ frontMaterial, backMaterial ]
    // this.materials = [ backMaterial, frontMaterial ]
    // this.materials = [frontMaterial]

    // tempPlane.addGroup(0,6000,0)
    // tempPlane.addGroup(0,6000,1)
    const nVertices = tempPlane.index ? tempPlane.index.count : tempPlane.attributes.position.count
    tempPlane.addGroup( 0, nVertices, 0 )
    tempPlane.addGroup( 0, nVertices, 1 )


    console.log(frenetFrames,spacedPoints)
    let point = new THREE.Vector3();
    let binormalShift = new THREE.Vector3();
    let temp2 = new THREE.Vector3();

    let finalPoints = []
    let tubePoints = []



    dimensions.forEach(d=>{
      tubePoints[ d ] = []
      for (let i = 0; i <= number; i++) {
        point = spacedPoints[i];
// console.log( 'LANCE d', d )
// console.log( 'LANCE before binormalShift', binormalShift )
// console.log( 'LANCE frenetFrames.binormals[i]', frenetFrames.binormals[i] )
        // binormalShift.add(frenetFrames.binormals[i]).multiplyScalar(d);
        binormalShift.copy(frenetFrames.binormals[i]).multiplyScalar(d);
        // binormalShift.copy(frenetFrames.normals[i]).multiplyScalar(d);
// console.log( 'LANCE after binormalShift', binormalShift )

        const newPoint = new THREE.Vector3().copy(point).add(binormalShift)

        finalPoints.push(
          // new THREE.Vector3().copy(point).add(binormalShift)
          newPoint
          )
        
        tubePoints[ d ].push(
          newPoint
          )
      }
    })

    // finalPoints[number + 1].copy()
    console.log(finalPoints[number + 1],'/number')

    // finalPoints[0].copy(finalPoints[number])
    // finalPoints[number+1].copy(finalPoints[2*number+1])

    // finalPoints.push(new THREE.Vector3(Math.random(),Math.random(),Math.random()))

    // finalPoints.copy

    tempPlane.setFromPoints(finalPoints)
    // tempPlane.computeTangents()
    console.log(tempPlane,finalPoints)

    // console.log(finalPoints)

    // DO SOMETHING IN HERE



    let finalMesh = new THREE.Mesh(
      tempPlane,
      this.materials,
      // new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true, wireframeLinewidth: 4 })
      // doubleSidedMaterial,
    )

    // this.scene.add(finalMesh);

    const tubeMeshes = []
    dimensions.forEach(d=>{
      // const tubeGeometry = new THREE.TubeGeometry()
      // tubeGeometry.setFromPoints( tubePoints[ d ] );

      const tubeCurve = new THREE.CatmullRomCurve3( tubePoints[ d ] );
      tubeCurve.tension = 0.7;
      tubeCurve.closed = false;

      const tubeGeometry = new THREE.TubeGeometry( tubeCurve, 200, 0.005, 8, false )
      // tubeGeometry.setFromPoints( tubePoints[ d ] );
      const nVertices = tubeGeometry.index ? tubeGeometry.index.count : tubeGeometry.attributes.position.count
      tubeGeometry.addGroup( 0, nVertices, 0 )
      tubeGeometry.addGroup( 0, nVertices, 1 )

      tubeMeshes[ d ] = new THREE.Mesh(
        tubeGeometry,
        this.materials,
      )

      // this.scene.add( tubeMeshes[ d ] );
    })

    return {
      curveObject,
      finalMesh,
      tubeMeshes,
    }

  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.001;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);

    // this.materials.forEach((m,i) => {
    //   m.map.offset.setX(this.time)
    //   if(i>0){
    //     m.map.offset.setX(-this.time)
    //   }
    // })

    // setTimeout( () => {
    //   this.renderer.render(this.scene, this.camera);
    // }, 100 )
  }
}
