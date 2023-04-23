import React from 'react'
import './Menu.css'
import { removeOldModels, gsapAnimations, resetAnimation } from '../Scene/Script'

const motors = [{
    name: 'Motor1',
    group: 'motor',
    route: './model/motor/Motor1.gltf'
}, {
    name: 'Motor2',
    group: 'motor',
    route: './model/motor/Motor2.gltf'
}, {
    name: 'Motor3',
    group: 'motor',
    route: './model/motor/Motor3.gltf'
}]

const camaras = [{
    name: 'Camara1',
    group: 'camaras',
    route: './model/cam/Cam1.gltf'
}, {
    name: 'Camara2',
    group: 'camaras',
    route: './model/cam/Cam2.gltf'
}, {
    name: 'Camara3',
    group: 'camaras',
    route: './model/cam/Cam3.gltf'
}]

const helices = [{
    name: 'Helice1',
    group: 'helices',
    route: './model/helices/Helice1.gltf'
}, {
    name: 'Helice2',
    group: 'helices',
    route: './model/helices/Helice2.gltf'
}, {
    name: 'Helice3',
    group: 'helices',
    route: './model/helices/Helice3.gltf'
}]

const animations = {
    motors: {
        target: {
            x: -1.28,
            y: 0.13,
            z: 1.17
        },
        camera: {
            x: -7,
            y: 2.47,
            z: 10
        },
        zoom: 3.24
    },
    camaras: {
        target: {
            x: 0,
            y: -0.26,
            z: 1.3
        },
        camera: {
            x: -1.82,
            y: -0.39,
            z: 9.89,
        },
        zoom: 2.46
    },
    helices: {
        target: {
            x: -1.3,
            y: 0.13,
            z: 1.3
        },
        camera: {
            x: -2.6,
            y: 7.55,
            z: 6.64
        },
        zoom: 2.2
    }
}

export default function Menu() {
    return (
        <div className="MenuContainer">
            <div className="MenuWrapper">
                <div className="MenuOptions">
                    <h1>Drone Customization</h1>

                    <ul className="MenuOptionsList">
                        <li className="MenuOptionsListItem">
                            <label htmlFor="motors">Motores</label>
                            <select name="motors" id="motors"
                                onClick={(e) => {
                                    gsapAnimations(animations.motors.target, animations.motors.camera, animations.motors.zoom)
                                }}

                                onChange={(e) => {
                                    const motor = motors.find(motor => motor.name === e.target.value)
                                    removeOldModels(motor.route, motor.group)
                                }}>
                                {motors.map((motor, index) => {
                                    return (
                                        <option key={index} value={motor.name}>{motor.name}</option>
                                    )
                                })}
                            </select>
                        </li>

                        <li className="MenuOptionsListItem">
                            <label htmlFor="camaras">Camaras</label>
                            <select name="camaras" id="camaras"
                                onClick={(e) => {
                                    gsapAnimations(animations.camaras.target, animations.camaras.camera, animations.camaras.zoom)
                                }}

                                onChange={(e) => {
                                    const camara = camaras.find(camara => camara.name === e.target.value)
                                    removeOldModels(camara.route, camara.group)
                                }}>
                                {camaras.map((camara, index) => {
                                    return (
                                        <option key={index} value={camara.name}>{camara.name}</option>
                                    )
                                })}
                            </select>
                        </li>

                        <li className="MenuOptionsListItem">
                            <label htmlFor="helices">Helices</label>
                            <select name="helices" id="helices"
                                onClick={(e) => {
                                    gsapAnimations(animations.helices.target, animations.helices.camera, animations.helices.zoom)
                                }}

                                onChange={(e) => {
                                    const helice = helices.find(helice => helice.name === e.target.value)
                                    removeOldModels(helice.route, helice.group)
                                }}>
                                {helices.map((helice, index) => {
                                    return (
                                        <option key={index} value={helice.name}>{helice.name}</option>
                                    )
                                })}
                            </select>
                        </li>
                    </ul>

                    <div className="VistaGeneral">
                        <button onClick={(e) => {
                            resetAnimation()
                        }}>Vista General</button>
                    </div>

                </div>
            </div>
        </div>
    )
}
