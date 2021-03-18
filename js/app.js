function init() {
  let d = document;
  d.onmousemove = getMousePosition;

  let playButton = d.createElement("button");
  playButton.classList.add("play-button");
  d.body.append(playButton);
  playButton.innerText = "Start";
  playButton.addEventListener("click", () => getData());

  let noiseGenerator = d.getElementById("noise-generator");
  noiseGenerator.addEventListener("click", () => playTone());

  let canvas = d.body.appendChild(d.createElement("canvas"));
  let context = canvas.getContext("2d");

  let time = 0;
  let sin = Math.sin;
  let cos = Math.cos;
  let tan = Math.tan;
  let PI = Math.PI;
  let octaveMultiplier = 5;

  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let masterGainNode = audioContext.createGain();
  let songBuffer = null;
  let path1 = "../assets/sampleTrackForWeb.mp3";
  let path2 = "../assets/AUDIO_2703.m4a";

  let playForm = d.getElementById("playerForm");
  playForm.playButton.onclick = function (event) {
    event.stopPropagation();
    // I've added two basic validation checks here, but in a real world use case you'd probably be a little more stringient.
    // Be aware that Firefox uses 'audio/mpeg' as the MP3 MIME type, Chrome uses 'audio/mp3'.
    var fileInput = document.forms[0].audioSelect;
    if (
      fileInput.files.length > 0 &&
      ["audio/mpeg", "audio/mp3"].includes(fileInput.files[0].type)
    ) {
      getFilesFromUser(fileInput.files[0], function (mp3BytesAsArrayBuffer) {
        decodeMp3BytesFromArrayBufferAndPlay(mp3BytesAsArrayBuffer);
      });
    } else
      alert("Error! No attached file or attached file was of the wrong type!");
  };

  function getFilesFromUser(selectedFile, callback) {
    var reader = new FileReader();
    reader.onload = function (ev) {
      let mp3BytesAsArrayBuffer = reader.result;
      callback(mp3BytesAsArrayBuffer);
    };
    reader.readAsArrayBuffer(selectedFile);
  }

  function decodeMp3BytesFromArrayBufferAndPlay(mp3BytesAsArrayBuffer) {
    audioContext.decodeAudioData(
      mp3BytesAsArrayBuffer,
      function (decodedSamplesAsAudioBuffer) {
        // Clear any existing audio source that we might be using
        if (songBuffer != null) {
          songBuffer.disconnect(audioContext.destination);
          songBuffer = null; // Leave existing source to garbage collection
        }

        songBuffer = audioContext.createBufferSource();
        songBuffer.buffer = decodedSamplesAsAudioBuffer; // set the buffer to play to our audio buffer
        songBuffer.connect(masterGainNode); // connect the source to the output destinarion
      }
    );
    audioContext.resume();
  }

  function getData() {
    if (!songBuffer) {
      songBuffer = audioContext.createBufferSource();
      var request = new XMLHttpRequest();

      request.open("GET", path2, true);

      request.responseType = "arraybuffer";

      request.onload = function () {
        var audioData = request.response;

        audioContext.decodeAudioData(
          audioData,
          function (buffer) {
            songBuffer.buffer = buffer;
            songBuffer.connect(masterGainNode);
            songBuffer.loop = true;
            songBuffer.start(0);
          },

          function (e) {
            console.log("Error with decoding audio data" + e.err);
          }
        );
      };

      request.send();
    } else {
      songBuffer.start(0);
    }

    audioContext.resume();
  }

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);
  analyser.smoothingTimeConstant = 0.2;
  masterGainNode.connect(analyser);
  masterGainNode.connect(audioContext.destination);

  const filter = audioContext.createBiquadFilter();

  function playTone() {
    let oscillator1 = audioContext.createOscillator();
    oscillator1.type = "sine";
    oscillator1.frequency.value =
      Math.random() * octaveMultiplier + 130.812782650299317;

    let oscillator2 = audioContext.createOscillator();
    oscillator2.type = "sine";
    oscillator2.frequency.value =
      Math.random() * octaveMultiplier + 146.83238395870378;

    let oscillator3 = audioContext.createOscillator();
    oscillator3.type = "sine";
    oscillator3.frequency.value =
      Math.random() * octaveMultiplier + 164.813778456434964;

    let oscillator4 = audioContext.createOscillator();
    oscillator4.type = "sine";
    oscillator4.frequency.value =
      Math.random() * octaveMultiplier + 174.614115716501942;

    let oscillator5 = audioContext.createOscillator();
    oscillator5.type = "sine";
    oscillator5.frequency.value =
      Math.random() * octaveMultiplier + 195.997717990874647;

    let oscillator6 = audioContext.createOscillator();
    oscillator6.type = "sine";
    oscillator6.frequency.value = Math.random() * octaveMultiplier + 220.0;

    let oscillator7 = audioContext.createOscillator();
    oscillator7.type = "sine";
    oscillator7.frequency.value =
      Math.random() * octaveMultiplier + 246.941650628062055;

    let gain1 = audioContext.createGain();
    gain1.gain.setValueAtTime(0.4, 0.25);
    let gain2 = audioContext.createGain();
    gain2.gain.setValueAtTime(0.4, 0.25);
    let gain3 = audioContext.createGain();
    gain3.gain.setValueAtTime(0.6, 0.25);
    let gain4 = audioContext.createGain();
    gain4.gain.setValueAtTime(0.6, 0.25);
    let gain5 = audioContext.createGain();
    gain5.gain.setValueAtTime(0.6, 0.25);

    let masterOscGain = audioContext.createGain();
    masterGainNode.gain.value = 1;

    let delay = audioContext.createDelay();
    delay.delayTime.value = 1;
    filter.type = "lowpass";
    filter.frequency.value = 100000;

    oscillator1.connect(gain1);
    oscillator2.connect(gain2);
    oscillator3.connect(gain3);
    oscillator4.connect(gain4);
    oscillator5.connect(gain5);

    gain1.connect(masterOscGain);
    gain2.connect(masterOscGain);
    gain3.connect(masterOscGain);
    gain4.connect(masterOscGain);
    gain5.connect(masterOscGain);

    masterOscGain.connect(delay);

    delay.connect(filter);

    filter.connect(masterGainNode);
    // delay.connect(audioContext.destination);
    // gain.connect(masterGainNode);

    let now = audioContext.currentTime;

    const rand = Math.random() * 8;
    const randTime = Math.random() * 2;

    if (rand < 1) {
      oscillator1.start();
      oscillator1.stop(rand + 1);
    } else if (rand > 1.5 && rand < 2) {
      oscillator1.start();
      oscillator2.start();
      oscillator2.stop(now + randTime * 2);
      oscillator1.stop(now + randTime * 2);
    } else if (rand > 2 && rand < 2.5) {
      oscillator2.start();
      oscillator3.start();
      oscillator3.stop(now + randTime * 2);
      oscillator2.stop(now + randTime * 2);
    } else if (rand > 2.5 && rand < 3) {
      oscillator2.start();
      oscillator2.stop(now + randTime * 2);
    } else if (rand > 3 && rand < 4) {
      oscillator3.start();
      oscillator3.stop(now + randTime * 2);
    } else if (rand > 4 && rand < 5) {
      oscillator4.start();
      oscillator4.stop(now + randTime * 2);
    } else if (rand > 5 && rand < 6) {
      oscillator5.start();
      oscillator5.stop(now + randTime * 2);
    } else if (rand > 6 && rand < 7) {
      oscillator6.start();
      oscillator6.stop(now + randTime * 2);
      oscillator3.start();
      oscillator3.stop(now + randTime * 2);
    } else if (rand > 7 && rand < 8) {
      oscillator7.start();
      oscillator7.stop(now + randTime * 2);
    }

    // oscillator1.stop(now + 1);
  }

  function resize() {
    canvas.width = w = innerWidth;
    canvas.height = h = innerHeight;
  }

  resize();

  let mouseX = w / 2;
  let mouseY = h / 2;

  canvas.addEventListener("resize", resize, false);

  const colors = new Array(16)
    .fill(0)
    .map((_, i) =>
      i === 0 ? "#000" : `#${(((1 << 24) * Math.random()) | 0).toString(16)}`
    );

  function drawPattern1() {
    console.log("HERE");
    context.clearRect(0, 0, w, h);
    context.globalCompositeOperation = "lighter";
    analyser.getByteFrequencyData(dataArray);
    context.fillStyle = "rgba(0, 255, 255, .7)";

    time += 0.1;

    for (let i = 0; i < bufferLength; i++) {
      r =
        dataArray[i] +
        w * (sin((time + i) * (0.05 + (cos(time * 0.00002) / PI) * 0.2)) / PI);

      context.fillRect(tan(i) * r + w / 2, sin(i) * r + h / 2, 2, 2);
    }
    context.fillStyle =
      dataArray[0] === 0
        ? "rgba(0, 255, 255, .7)"
        : colors[Math.round(Math.random() * 15)];

    for (let i = 0; i < bufferLength / 2; i++) {
      let v = dataArray[i] > 120 ? dataArray[i] / 64 : 1;
      let y = dataArray > 120 ? v * h : h;
      let m = dataArray[i] > 120 ? 0.05 : 1;
      let p = dataArray[i] === 132 ? 10 : 7;
      r =
        (((w + y) * dataArray[i + 100]) / 150) *
        (sin(
          (time + i / dataArray[i]) * (m + (tan(time * 0.00002) / PI) * 0.2)
        ) /
          PI);

      context.fillRect(
        sin(i) * r + w / 2,
        tan(Math.round(Math.random() / i)) * r + h / 2,
        p,
        p
      );
    }

    if (dataArray[0] > 170) {
      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] > 120 ? dataArray[i] / 64 : 1;
        let y = dataArray > 120 ? v * h : h;
        let m = dataArray[i] > 120 ? 0.05 : 1;
        let p = dataArray[i] === 132 ? 10 : 7;
        r = (w + y) * (sin(time * (m + (cos(time * 0.00002) / PI) * 0.2)) / PI);

        context.fillRect(cos(i) * r + w / 2, sin(i) * r + h / 2, p, p);
      }
    }
  }

  function getMousePosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  setInterval(() => drawPattern1(), 16);
}
init();
