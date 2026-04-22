// Player HLS completo com auto qualidade + seletor manual

class VideoPlayer {
  constructor(videoId, source) {
    this.video = document.getElementById(videoId);
    this.source = source;
    this.hls = null;

    this.init();
  }

  init() {
    if (window.Hls && Hls.isSupported()) {
      this.hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      this.hls.loadSource(this.source);
      this.hls.attachMedia(this.video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Qualidades disponíveis:", this.hls.levels);
        this.createQualitySelector();
      });

    } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari (suporte nativo HLS)
      this.video.src = this.source;
    } else {
      console.error("HLS não suportado");
    }
  }

  createQualitySelector() {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.bottom = "10px";
    container.style.right = "10px";
    container.style.background = "rgba(0,0,0,0.7)";
    container.style.padding = "5px";

    const select = document.createElement("select");

    // Auto
    const autoOption = document.createElement("option");
    autoOption.value = -1;
    autoOption.text = "Auto";
    select.appendChild(autoOption);

    // Qualidades disponíveis
    this.hls.levels.forEach((level, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.text = `${level.height}p`;
      select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
      const level = parseInt(e.target.value);
      this.hls.currentLevel = level;
    });

    container.appendChild(select);
    this.video.parentElement.style.position = "relative";
    this.video.parentElement.appendChild(container);
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  new VideoPlayer("video", "master.m3u8");
});

<!DOCTYPE html>
<html>
<head>
  <title>Player 8K</title>
</head>
<body>

<div style="width: 800px;">
  <video id="video" controls style="width:100%"></video>
</div>

<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script src="player.js"></script>

</body>
</html>

const video = document.getElementById('video');

if (Hls.isSupported()) {
  const hls = new Hls({
    lowLatencyMode: true,
    liveSyncDuration: 2,        // quão perto do "ao vivo"
    liveMaxLatencyDuration: 5,  // limite de atraso
    maxBufferLength: 10,        // buffer menor
    maxMaxBufferLength: 20,
    enableWorker: true
  });

  hls.loadSource('live.m3u8');
  hls.attachMedia(video);

  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    video.play();
  });
}

ffmpeg -i input_stream \
-c:v libx264 -preset veryfast -tune zerolatency \
-g 48 -keyint_min 48 \
-sc_threshold 0 \
-f hls \
-hls_time 1 \
-hls_list_size 6 \
-hls_flags delete_segments+append_list+independent_segments \
-hls_segment_type fmp4 \
-hls_fmp4_init_filename init.mp4 \
master.m3u8
ffmpeg -i input_stream \
-c:v libx265 -preset veryfast -tune zerolatency \
-x265-params "keyint=48:min-keyint=48:no-scenecut=1" \
-b:v 8M \
-f hls \
-hls_time 1 \
-hls_list_size 6 \
-hls_flags delete_segments+append_list+independent_segments \
-hls_segment_type fmp4 \
live_hevc.m3u8

ffmpeg -i input_stream \
-c:v libaom-av1 -cpu-used 8 -b:v 6M \
-f hls \
-hls_time 1 \
live_av1.m3u8

const hls = new Hls({
  lowLatencyMode: true,
  liveSyncDuration: 2,
  maxBufferLength: 8
});

hls.loadSource('master.m3u8');
hls.attachMedia(document.getElementById('video'));

ffmpeg -i input_stream \
-c:v libx264 -preset veryfast -tune zerolatency \
-g 48 -keyint_min 48 -sc_threshold 0 \
-b:v 4000k -maxrate 4500k -bufsize 8000k \
-f hls \
-hls_time 1 \
-hls_list_size 6 \
-hls_flags delete_segments+append_list+independent_segments \
live.m3u8

const hls = new Hls({
  lowLatencyMode: true,
  liveSyncDuration: 3,
  liveMaxLatencyDuration: 6,

  maxBufferLength: 10,
  maxMaxBufferLength: 20,

  abrEwmaDefaultEstimate: 5000000, // estimativa inicial
  abrBandWidthFactor: 0.8,         // mais conservador
  abrBandWidthUpFactor: 0.7
});

hls.loadSource('live.m3u8');
hls.attachMedia(document.getElementById('video'));

