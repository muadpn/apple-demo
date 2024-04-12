import { useGSAP } from "@gsap/react"
import gsap from "gsap/gsap-core"
import ModelView from "./ModelView"
import { useEffect, useRef, useState } from "react"
import { yellowImg } from "../utils"
import * as THREE from 'three'
import { Canvas } from "@react-three/fiber"
import { View } from "@react-three/drei"
import { models, sizes } from "../constants"
import { animationWithGsapTimeLine } from "../utils/animation"
const Model = () => {
    const [size, SetSize] = useState('small');
    const [model, SetModel] = useState({
        title: 'Iphone 15 Pro in Natural Titanium',
        color: ['#8F8A81', '#FFE7B9', '#6F6C64'],
        img: yellowImg
    })
    //Camera
    const cameraControlSmall = useRef()
    const cameraControlLarge = useRef()

    //model
    const small = useRef(new THREE.Group())
    const large = useRef(new THREE.Group())

    //Rotation
    const [smallRotation, setSmallRotation] = useState(0)
    const [largeRoation, setLargeRotation] = useState(0)
    const tl = gsap.timeline();
    useEffect(() => {
        if (size === 'large') {
            animationWithGsapTimeLine(tl, small, smallRotation, '#view1', '#view2', {
                transform: 'translateX(-100%)',
                duration: 2
            })
        }
        if (size === 'small') {
            animationWithGsapTimeLine(tl, large, largeRoation, '#view2', '#view1', {
                transform: 'translateX(0%)',
                duration: 2
            })

        }
    }, [size])
    useGSAP(() => {
        gsap.to('#heading', {
            opacity: 1,
            y: 0
        })
    }, [])
    return (
        <section className='common-padding'>
            <div className='screen-max-width'>
                <h1 id='heading' className='section-heading'>
                    Take a closer look.
                </h1>
                <div className="flex flex-col items-center mt-5">
                <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
                        <ModelView
                            index={1}
                            groupRef={small}
                            gsapType='view1'
                            controlRef={cameraControlSmall}
                            setRotationState={setSmallRotation}
                            item={model}
                            size={size}
                        />
                        <ModelView
                            index={2}
                            groupRef={large}
                            gsapType='view2'
                            controlRef={cameraControlLarge}
                            setRotationState={setLargeRotation}
                            item={model}
                            size={size}
                        />
                        <Canvas
                            className="w-full h-full"
                            style={{
                                position: 'fixed',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                overflow: 'hidden'
                            }}
                            eventSource={document.getElementById('root')}
                        >
                            <View.Port />
                        </Canvas>
                    </div>
                    <div className="mx-auto w-full">
                        <p
                            className="text-sm font-light text-center mb-5"
                        >{model.title}</p>
                        <div className="flex-center">
                            <ul className="color-container">
                                {models.map((mod, i) => {
                                    return (
                                        <li key={i} className="w-6 h-6 rounded-full mx-2 cursor-pointer" style={{
                                            backgroundColor: mod.color[0]
                                        }}
                                            onClick={() => SetModel(mod)}
                                        />
                                    )
                                })}
                            </ul>
                            <button className="size-btn-container">
                                {sizes.map(({ label, value }) => (
                                    <span key={label} className="size-btn" style={{
                                        backgroundColor: size === value ? 'white' : 'transparent',
                                        color: size === value ? 'black' : 'white',
                                    }}
                                        onClick={() => SetSize(value)}
                                    >
                                        {label}
                                    </span>
                                ))}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Model
