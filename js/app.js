import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { VertexTangentsHelper } from 'three/examples/jsm/helpers/VertexTangentsHelper.js';
import { mergeBufferGeometries, mergeBufferAttributes } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import Ribbon from "./ribbon.js";

const ribbon = new Ribbon( { THREE, OrbitControls, mergeBufferGeometries, mergeBufferAttributes, VertexTangentsHelper, OBJLoader, MTLLoader } )
ribbon.explicitConstructor({
  dom: document.getElementById("container")
})
const objects = ribbon.getObjects()
ribbon.addAndRender( objects )
