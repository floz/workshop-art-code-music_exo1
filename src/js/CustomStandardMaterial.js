import vs from "shaders/customStandardMaterial.vs"
import fs from "shaders/customStandardMaterial.fs"

export default class CustomStandardMaterial extends THREE.MeshStandardMaterial {
	
	constructor(parameters, uniforms={}){
		super(parameters)
		this.uniforms = THREE.UniformsUtils.merge([
			THREE.ShaderLib.standard.uniforms,
			uniforms
		])
		this.isMeshStandardMaterial  = true
		this.setFlags(this,fs,vs)
		this.setValues(parameters)
	}
	
	setFlags(material, fs, vs) {
		material.vertexShader = vs;
		material.fragmentShader = fs;
		material.type = 'CustomStandardMaterial';
	}

}
	
export { CustomStandardMaterial }
