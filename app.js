import {
    Scene,
    PerspectiveCamera,
    PlaneGeometry,
    ShaderMaterial,
    BufferAttribute,
    Points,
    WebGLRenderer,
    Clock
  } from 'three';

document.addEventListener('DOMContentLoaded', function () {
    const date = new Date()
    const curYear = date.getFullYear()
    const expYears = curYear - 2021
    document.getElementById("experience").innerText=`Bringing ${expYears} years of expertise to address your specific challenges. Proficient in databases, server-side logic, and unlimited revisions for your satisfaction.`
    document.getElementById("copyYear").innerText=`Copyright © Hasnain Raza ${curYear}`

    const animated_particle_cluster=()=>{

        class Particle {
            parent;
            id;
            position = { x: 0, y: 0 };
            diameter = 0;
            life = 0;
            speed = { x: 0, y: 0 };
            init() {
                const interval = setInterval(() => {
                    this.position.x += this.speed.x * 60 / 1000;
                    this.position.y -= this.speed.y * 60 / 1000;
                    this.life -= 1 / 60;
                    if (this.life <= 0) {
                        clearInterval(interval);
                        this.parent.particles.delete(this.id);
                    }
                }, 1000 / 60);
            }
            constructor(id, parent) {
                this.parent = parent;
                this.id = id;
                this.init();
            }
        }
        class ParticleSystem {
            canvas;
            size;
            lastId = 0;
            ammount = 0;
            particles = new Map();
            diameter = { min: 0, max: 0 };
            life = { min: 0, max: 0 };
            speed = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
            static getRandomNumberInInterval(invterval) {
                const min = Math.ceil(invterval.min);
                const max = Math.floor(invterval.max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            createParticle() {
                const particle = new Particle(this.lastId.toString(), this);
                particle.position.x = ParticleSystem.getRandomNumberInInterval({ min: 0, max: this.size.x });
                particle.position.y = ParticleSystem.getRandomNumberInInterval({ min: 0, max: this.size.y });
                particle.diameter = ParticleSystem.getRandomNumberInInterval(this.diameter);
                particle.life = ParticleSystem.getRandomNumberInInterval(this.life);
                particle.speed.x = ParticleSystem.getRandomNumberInInterval(this.speed.x);
                particle.speed.y = ParticleSystem.getRandomNumberInInterval(this.speed.y);
                this.particles.set(this.lastId.toString(), particle);
                this.lastId++;
            }
            init() {
                const ctx = this.canvas.getContext('2d');
                ctx.fillStyle = 'white';
                this.particles = new Map()
                for (let i = 0; i < this.ammount; i++)
                    this.createParticle();
                setInterval(() => {
                    if (this.particles.size <= this.ammount)
                        this.createParticle();
                }, 1000 / 60);
                setInterval(() => {
                    ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.particles.forEach((particle) => {
                        ctx?.beginPath();
                        ctx?.arc(particle.position.x, particle.position.y, particle.diameter / 2, 0, 2 * Math.PI, false);
                        ctx?.closePath();
                        ctx?.fill();
                    });
                }, 1000 / 60);
            }
            constructor(canvas, size) {
                this.canvas = canvas;
                this.size = size;
                canvas.width = size.x;
                canvas.height = size.y;
            }
        }
        
                const canvas = document.getElementById('particle_canvas')
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight
                const system = new ParticleSystem(canvas, { x: window.innerWidth, y: window.innerHeight })
                system.ammount = 100
                system.diameter = { min: 1, max: 2 }
                system.life = { min: 15, max: 20 }
                system.speed = { x: { min: -10, max: 10 }, y: { min: -10, max: 10 } }
                system.init()
        
        onresize = (event) => {
          system.size = { x: window.innerWidth, y: window.innerHeight }
          system.init()
        };
    }
    animated_particle_cluster()

    const animated_footer_map=()=>{
    
        /**
        |--------------------------------------------------
        | Constants
        |--------------------------------------------------
        */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        const canvas = document.querySelector('canvas.webgl') 
        const scene = new Scene()
        
        /**
        |--------------------------------------------------
        | Camera
        |--------------------------------------------------
        */
        const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        camera.position.z = 10
        camera.position.y = 1.1
        camera.position.x = 0
        scene.add(camera)
        
        /**
        |--------------------------------------------------
        | Plane
        |--------------------------------------------------
        */
        const planeGeometry = new PlaneGeometry(20, 20, 150, 150)
        const planeMaterial = new ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uElevation: { value: 0.482 }
            },
            vertexShader: `
                uniform float uTime;
                uniform float uElevation;
        
                attribute float aSize;
        
                varying float vPositionY;
                varying float vPositionZ;
        
                void main() {
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    modelPosition.y = sin(modelPosition.x - uTime) * sin(modelPosition.z * 0.6 + uTime) * uElevation;
        
                    vec4 viewPosition = viewMatrix * modelPosition;
                    gl_Position = projectionMatrix * viewPosition;
        
                    gl_PointSize = 2.0 * aSize;
                    gl_PointSize *= ( 1.0 / - viewPosition.z );
        
                    vPositionY = modelPosition.y;
                    vPositionZ = modelPosition.z;
                }
            `,
            fragmentShader: `
                varying float vPositionY;
                varying float vPositionZ;
        
                void main() {
                    float strength = (vPositionY + 0.25) * 0.3;
                    gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
                }
            `,
            transparent: true,
        })
        const planeSizesArray = new Float32Array(planeGeometry.attributes.position.count)
        for (let i = 0; i < planeSizesArray.length; i++) {
            planeSizesArray[i] = Math.random() * 4.0
        }
        planeGeometry.setAttribute('aSize', new BufferAttribute(planeSizesArray, 1))
        
        const plane = new Points(planeGeometry, planeMaterial)
        plane.rotation.x = - Math.PI * 0.4
        scene.add(plane)
        
        /**
        |--------------------------------------------------
        | Resize
        |--------------------------------------------------
        */
        window.addEventListener('resize', () => {
            // Update sizes
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
        
            // Update camera
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()
        
            // Update renderer
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
        
        /**
        |--------------------------------------------------
        | Renderer
        |--------------------------------------------------
        */
        const renderer = new WebGLRenderer({
            canvas: canvas
        })
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        
        /**
        |--------------------------------------------------
        | Animate Function
        |--------------------------------------------------
        */
        const clock = new Clock()
        
        const animate = () => {
            const elapsedTime = clock.getElapsedTime()
        
            planeMaterial.uniforms.uTime.value = elapsedTime
            
            renderer.render(scene, camera)
        
            // Call animate again on the next frame
            window.requestAnimationFrame(animate)
        }
        
        animate()
        }
        animated_footer_map()
        

});

