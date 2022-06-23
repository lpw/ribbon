import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VertexTangentsHelper } from 'three/examples/jsm/helpers/VertexTangentsHelper.js';

import Ribbon from "./ribbon.js";

const ribbon = new Ribbon( THREE, OrbitControls, VertexTangentsHelper )
ribbon.explicitConstructor({
  dom: document.getElementById("container")
})
const objects = ribbon.getObjects()
ribbon.addAndRender( objects )
