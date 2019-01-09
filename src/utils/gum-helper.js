function addStereoAudioSupport(mediaAudio) {
    let audioSupport;
    let stereoAudioSupport = { channelCount:{exact: 2}, echoCancellation:false, autoGainControl:false, noiseSuppression:false };
    if(typeof mediaAudio === 'object') {
        audioSupport = Object.assign( {}, mediaAudio, stereoAudioSupport)
    }
    else {
        audioSupport = stereoAudioSupport;
    }
    return audioSupport
}

export {addStereoAudioSupport};