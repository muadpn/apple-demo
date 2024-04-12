import React, { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import { pauseImg, playImg, replayImg } from '../utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
const VideoCarousel = () => {
    const videoRef = useRef([])
    const videoSpanRef = useRef([])
    const videoDivRef = useRef([])
    const [loadedData, setLoadedData] = useState([])
    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false
    })
    const { isEnd, isLastVideo, isPlaying, startPlay, videoId } = video;
    useGSAP(() => {
        gsap.to('#slider', {
            transform: `translateX(${-100 * videoId}%)`,

            duration: 2,
            ease: 'power2.inOut'
        })
        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none',
            },
            onComplete: () => {
                setVideo((prev) => ({
                    ...prev,
                    startPlay: true,
                    isPlaying: true
                }))
            }
        })
    }, [isEnd, videoId])
    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause();
            } else {
                startPlay && videoRef.current[videoId].play()
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData])
    const handleLoadedMetaData = (i, e) => setLoadedData((pre) => (
        [...pre, e]
    ))
    useEffect(() => {
        let currentProgress = 0
        let span = videoSpanRef.current;
        if (span[videoId]) {
            //animate progress of the video
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100);
                    if (progress !== currentProgress) {
                        currentProgress = progress
                        gsap.to(videoDivRef.current[videoId], {
                            width: window.innerWidth < 760 ? '10vw' : window.innerWidth < 1200 ? '10vw' : '4vw'
                        })
                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: 'white'
                        })
                    }

                },
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: '12px'
                        })
                        gsap.to(span[videoId], {
                            backgroundColor: '#afafaf'
                        })
                    }
                },

            })
            if (videoId === 0) {
                anim.restart()
            }
            const animUpdate = () => {
                anim.progress(videoRef.current[videoId]?.currentTime ? videoRef.current[videoId]?.currentTime : 0 / hightlightsSlides[videoId]?.videoDuration)
            }
            if (isPlaying) {
                gsap.ticker.add(animUpdate)
            } else {
                gsap.ticker.remove(animUpdate)

            }
        }
    }, [videoId, startPlay])
    const handleProcess = (process, i) => {
        switch (process) {
            case 'video-end':
                setVideo((prev) => ({ ...prev, isEnd: true, videoId: i + 1 }));
                break
            case 'video-last':
                setVideo((prev) => ({ ...prev, isLastVideo: true }))
                break
            case 'video-reset':
                setVideo((prev) => ({ ...prev, isLastVideo: false, videoId: 0 }))
                break
            case 'play':
                setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
                break
            case 'pause':
                setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
                break
            default:
                break
        }
    }
    return (
        <>
            <div className='flex  items-center '>
                {hightlightsSlides.map((lists, i) => (
                    <div id="slider" className='sm:pr-20 pr-10' key={lists.id}>
                        <div className='video-carousel_container '>
                            <div className='w-full h-full flex-center rounded-3xl overflow-hidden  bg-black'>
                                <video
                                    onEnded={() => {
                                        i !== 3 ? handleProcess('video-end', i) : handleProcess('video-last')
                                    }}

                                    id='video'
                                    className={`${lists.id === 2 ? 'translate-x-44' : ''} pointer-events-none`}
                                    playsInline={true}
                                    preload='auto'
                                    muted
                                    onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                                    ref={(el) => (videoRef.current[i] = el)}
                                    onPlay={() => setVideo((prevVideo) => {
                                        return {
                                            ...prevVideo,
                                            isPlaying: true
                                        }
                                    })}
                                >
                                    <source
                                        src={lists.video}
                                        type='video/mp4'

                                    />
                                </video>
                            </div>
                            <div className='absolute top-12 left-[5%] z-10 '>
                                {lists.textLists.map((text) => (
                                    <p key={text}
                                        className='md:text-2xl text-xl font-medium'
                                    >{text}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div >
            <div className='relative flex-center mt-10'>
                <div className='flex-center py-5 px-7 backdrop-blur bg-gray-300 rounded-full'>
                    {videoRef.current.map((_, i) => (
                        <span key={i} ref={(el) => (videoDivRef.current[i] = el)} className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer '>
                            <span className='absolute h-full w-full rounded-full' ref={(el) => videoSpanRef.current[i] = el} />
                        </span>
                    ))}
                </div>
                <button className='control-btn' onClick={isLastVideo ? () => handleProcess('video-reset') : !isPlaying ? () => handleProcess('play') : () => handleProcess('pause')}>
                    <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                        alt={isLastVideo ? 'replay' : !isPlaying ? 'Play' : 'Pause'}
                    />
                </button>
            </div>
        </>
    )
}

export default VideoCarousel
