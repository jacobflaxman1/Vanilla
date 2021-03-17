(function () {
  let d = document;
  d.onmousemove = getMousePosition;

  let playButton = d.createElement("button");
  playButton.classList.add("play-button");
  d.body.append(playButton);
  playButton.innerText = "Start";
  playButton.addEventListener("click", () => playTone(0.25));

  let nSlider = d.getElementsByClassName("numParticle-slider");
  nSlider[0].addEventListener("change", (e) => changeNumParticles(e));

  let canvas = d.body.appendChild(d.createElement("canvas"));
  let context = canvas.getContext("2d");
  let time = 0;
  let sin = Math.sin;
  let cos = Math.cos;
  let tan = Math.tan;
  let PI = Math.PI;
  let octaveMultiplier = 5;

  let numParticles = 50000;

  function changeNumParticles(e) {
    console.log(e.target);
    numParticles = e.target.value;
  }

  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let masterGainNode = audioContext.createGain();

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);
  analyser.smoothingTimeConstant = 0.2;
  masterGainNode.connect(analyser);
  masterGainNode.connect(audioContext.destination);

  const filter = audioContext.createBiquadFilter();

  function playTone(time) {
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
    gain1.gain.setValueAtTime(0.4, time);
    let gain2 = audioContext.createGain();
    gain2.gain.setValueAtTime(0.4, time);
    let gain3 = audioContext.createGain();
    gain3.gain.setValueAtTime(0.6, time);
    let gain4 = audioContext.createGain();
    gain4.gain.setValueAtTime(0.6, time);
    let gain5 = audioContext.createGain();
    gain5.gain.setValueAtTime(0.6, time);

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
      oscillator2.stop(now + randTime / 2);
      oscillator1.stop(now + randTime / 2);
    } else if (rand > 2 && rand < 2.5) {
      oscillator2.start();
      oscillator3.start();
      oscillator3.stop(now + randTime / 2);
      oscillator2.stop(now + randTime / 2);
    } else if (rand > 2.5 && rand < 3) {
      oscillator2.start();
      oscillator2.stop(now + randTime / 2);
    } else if (rand > 3 && rand < 4) {
      oscillator3.start();
      oscillator3.stop(now + randTime / 2);
    } else if (rand > 4 && rand < 5) {
      oscillator4.start();
      oscillator4.stop(now + randTime / 2);
    } else if (rand > 5 && rand < 6) {
      oscillator5.start();
      oscillator5.stop(now + randTime / 2);
    } else if (rand > 6 && rand < 7) {
      oscillator6.start();
      oscillator6.stop(now + randTime / 2);
      oscillator3.start();
      oscillator3.stop(now + randTime / 2);
    } else if (rand > 7 && rand < 8) {
      oscillator7.start();
      oscillator7.stop(now + randTime / 2);
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
    context.clearRect(0, 0, w, h);
    context.globalCompositeOperation = "lighter";
    analyser.getByteTimeDomainData(dataArray);
    context.fillStyle =
      dataArray[0] === 128
        ? "rgba(0, 255, 255, .7)"
        : colors[Math.round(Math.random() * 15)];

    time += 0.1;

    // The number of particles to generate
    let visualizerFactor = dataArray[0];
    let factor1 = tan;
    let factor2 = cos;
    let factor3 = tan;

    if (visualizerFactor > 130) {
      factor1 = sin;
      factor2 = sin;
      factor3 = sin;
    } else if (visualizerFactor > 110 && visualizerFactor < 130) {
      factor1 = tan;
      factor2 = tan;
      factor3 = cos;
    } else if (visualizerFactor > 90 && visualizerFactor < 110) {
      factor1 = sin;
      factor2 = sin;
      factor3 = sin;
    } else if (visualizerFactor > 70 && visualizerFactor < 90) {
      factor1 = cos;
      factor2 = cos;
      factor3 = cos;
    } else if (visualizerFactor > 80 && visualizerFactor < 90) {
      factor1 = tan;
      factor2 = sin;
      factor3 = cos;
    } else if (visualizerFactor < 80) {
      factor1 = tan;
      factor2 = cos;
      factor3 = sin;
    }

    i = numParticles;
    while (i--) {
      let v = dataArray[i] / 35;
      let y = mouseY;
      r =
        y *
        0.4 *
        (factor1((time + i) * (0.05 + (factor1(time * 0.00002) / PI) * 0.2)) /
          PI);
      context.fillRect(
        factor1(i) * r + mouseX / 10 + w / 2,
        factor3(i) * r + mouseY / 10 + h / 2,
        2,
        4
      );
    }
  }

  function getMousePosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    console.log(mouseX, mouseY);
  }

  setInterval(() => drawPattern1(), 20);
  setInterval(() => playTone(0.25), Math.random() * 1000);
  // setInterval(() => playTone(Math.random() * 5), Math.random() * 5000);
})();
