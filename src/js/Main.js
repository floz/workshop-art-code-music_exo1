import vsBasic from "shaders/basic.vs"
import fsBasic from "shaders/basic.fs"

import audio from "mnf/audio/audio"
import AudioAnalyser from 'mnf/audio/AudioAnalyser'
import AudioDebugger from 'mnf/audio/AudioDebugger'

const TEXTURE = new THREE.TextureLoader().load( "./imgs/toto.jpg" )

class Main {

	constructor(){
		// create a new scene & renderer
		this.scene = new THREE.Scene()
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setPixelRatio( window.devicePixelRatio )
		this.renderer.setSize( window.innerWidth, window.innerHeight )
		document.body.appendChild( this.renderer.domElement )

		// create camera
		this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 )
		this.camera.position.z = 800

		this.scene.add( new THREE.AmbientLight( {color: 0xffffff } ) )
		const pl = new THREE.PointLight( 0x00ff00, 1, 1000 )
		pl.position.y = 100
		this.scene.add( pl )
		
		// Let's add some lights
		this.scene.add( new THREE.AmbientLight( 0x222222 ) );

		const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.set( 1, 1, 1 ).normalize();
		this.scene.add( directionalLight );

		// create a big central Icosahedron
		let geometry = new THREE.IcosahedronGeometry( 100, 2 )
		// https://threejs.org/examples/?q=Physical#webgl_materials_variations_physical
		let material = new THREE.MeshPhysicalMaterial( {
			color: new THREE.Color( 0x0000ff ),
		} )
		this.meshBig = new THREE.Mesh( geometry, material )
		this.scene.add( this.meshBig )

		// create a small Icosahedron with custom material
		let customMaterial = new THREE.RawShaderMaterial( { 
			uniforms: {
				color: { type: "c", value: new THREE.Color( 0x00ff00 ) },
				tex: { type: "t", value: TEXTURE }
			},
			vertexShader: vsBasic,
			fragmentShader: fsBasic
		} )
		this.meshSmall = new THREE.Mesh( geometry, customMaterial )
		this.meshSmall.scale.set( 1, 1, 1 )
		this.scene.add( this.meshSmall )

		const pointLight = new THREE.PointLight( 0xffffff, 2, 800 );
		this.meshSmall.add( pointLight );

		this.theta = 0
		this.phi = 0
		this.radius = 150

		this.volumeScale = 10

		// if you don't want to hear the music, but keep analysing it, set 'shutup' to 'true'!
		// audio.start( { live: false, shutup: false, showCanvas: true  } )
		// audio.onBeat.add( this.onBeat )
		audio.start({  
			live : false,
			playlist : ["audio/galvanize.mp3"], 
			mute : false,
			onLoad : ()=>{
				audio.analyser = new AudioAnalyser(audio)
				audio.analyser.debugger = new AudioDebugger(audio.analyser)
				audio.onBeat.add( this.onBeat ) 
				this.animate()
			}
		} )

		window.addEventListener( 'resize', this.onResize, false )
	}

	onBeat = () => {
		this.meshSmall.material.uniforms.color.value.r = Math.random()
	}

	// each frame
	animate = () => {
		requestAnimationFrame( this.animate )

		this.meshBig.rotation.x += 0.005
		this.meshBig.rotation.y += 0.01
		// play with audio.volume
		let scale = 1 + .025 * audio.volume * this.volumeScale
		this.meshBig.scale.set( scale, scale, scale )

		// 3D rotation !
		// Keep the formula :)
		this.meshSmall.position.x = Math.cos( this.theta ) * Math.sin( this.phi ) * this.radius
		this.meshSmall.position.y = Math.sin( this.theta ) * Math.sin( this.phi ) * this.radius
		this.meshSmall.position.z = Math.cos( this.phi ) * this.radius

		this.theta += .01
		this.phi += .05

		// play with audio.values[ 2 ], the green bar of the preview
		// There is 7 value (audio.values.length = 8)
		scale = .1 + .05 * audio.analyser.ranges[ 2 ].volume * this.volumeScale
		this.meshSmall.scale.set( scale, scale, scale )

		this.renderer.render( this.scene, this.camera )
	}

	// on resize
	onResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize( window.innerWidth, window.innerHeight )
	}

}

export default new Main()
