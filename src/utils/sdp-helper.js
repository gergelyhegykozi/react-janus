function findLine(strArray, str1, str2) {
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

    var codecIndex = findLine(sdpLines, 'a=rtpmap', codec);
    if (codecIndex === -1) return sdp;

    var rtpmapLine = sdpLines[codecIndex];
    var extractPayloadRegEx = rtpmapLine.match(/a=rtpmap:(\d+) (.*)/); // "a=rtpmap:111 opus/48000/2".match(/a=rtpmap:(\d+) (.*)/);
    var codecPayloadType = extractPayloadRegEx[1]; //e.g. 111;

    var fmtpLineIndex = findLine(sdpLines, `a=fmtp:`, codecPayloadType);
    var fmtpNewLineValue = 'a=fmtp:' + codecPayloadType.toString() + ' ' + params;
    if (fmtpLineIndex === -1) {
        // no fmtp line, we can insert a new one easily and freely
        // a=fmtp:101 maxplaybackrate=16000; sprop-maxcapturerate=16000; maxaveragebitrate=128000
        sdpLines[codecIndex] = sdpLines[codecIndex].concat('\r\n' + fmtpNewLineValue);
    } else {
        // the line already exists with somet   hing like this: a=fmtp:111 minptime=10;useinbandfec=1
        // we need to concat with this -->
        // a=fmtp:101 maxplaybackrate=16000; sprop-maxcapturerate=16000; maxaveragebitrate=128000
        sdpLines[fmtpLineIndex] = fmtpNewLineValue;
    }

    sdp = sdpLines.join('\r\n');
    return sdp;
}

function setMaxAudioBitrate(sdp) {
    let codecName = 'opus/48000';
    let params = 'maxaveragebitrate=' + (128 * 1024) + ';stereo=1;sprop-stereo=1;cbr=1;x-google-min-bitrate=128;x-google-max-bitrate=128;';
    sdp = setAudioBitrate(sdp, codecName, params);
    return sdp;
}

export {setMaxAudioBitrate};