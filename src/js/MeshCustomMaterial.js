import vs from "shaders/physicalcustom.vs"
import fs from "shaders/physicalcustom.fs"

export default class MeshCustomMaterial extends THREE.MeshPhysicalMaterial {

	constructor(parameters, uniforms={}){
		super(parameters)

		this.defines = { 'PHYSICAL': '' };

		this.uniforms = THREE.UniformsUtils.merge([
			THREE.ShaderLib.physical.uniforms,
			THREE.ShaderLib.standard.uniforms,
			uniforms
		] )
		
	 	this.setFlags(this)
  	this.setValues(parameters)
		this.isMeshStandardMaterial = true
		this.lights = true
	}
	
	setFlags(material) {
		material.vertexShader = vs;
		material.fragmentShader = fs;
		material.type = 'MeshCustomMaterial';
	}

}
