function findLine(strArray, str1, str2) {
    debugger;
    for (var j=0; j<strArray.length; j++) {
        if (!!str2) {
            if (strArray[j].match(str1) && strArray[j].match(str2)) return j;
        }
        else {
            if (strArray[j].match(str1)) return j;
        }
    }
    return -1;
}

// codec = 'opus/48000'
// params = ' minptime=10; useinbandfec=1; maxaveragebitrate='+128*1024+'; stereo=1; sprop-stereo=1 ; cbr=1'
function setAudioBitrate(sdp, codec, params) {
    var sdpLines = sdp.split('\r\n');

    var opusIndex = findLine(sdpLines, 'a=rtpmap', codec);
    // Find the payload in the opus line.

    var opusPayload = 111;

    // a=fmtp:101 maxplaybackrate=16000; sprop-maxcapturerate=16000; maxaveragebitrate=128000
    sdpLines[opusIndex] = sdpLines[opusIndex].concat('\r\n'+'a=fmtp:' + opusPayload.toString() + ' ' + params);
    sdp = sdpLines.join('\r\n');

    return sdp;
}

export {setAudioBitrate};