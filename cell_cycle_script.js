const totalImages = 72;
const basePath = "images/"; // Local folder path
const displayDuration = 20000; // Phase summary display duration
const speed = 200; // Transition speed for images

let currentIndex = 1;
let isPaused = false;
let phaseTimeout;
let slideshowInterval;

const imgElement = document.getElementById('slideshow');
const phaseIndicator = document.getElementById('phaseIndicator');
const summaryElement = document.getElementById('summary');
const summaryText = document.getElementById('summaryText');
const progressBar = document.getElementById('progressBar');
const skipButton = document.getElementById('skipButton');
const pauseButton = document.getElementById('pauseButton');
const backButton = document.getElementById('backButton');
const forwardButton = document.getElementById('forwardButton');

const phases = {
    1: { name: "Interphase", summary: "Interphase is the longest phase of the cell cycle. The cell grows bigger and copies its DNA to get ready for division. It also makes more organelles and prepares all the materials it needs to split later." },
    7: { name: "Prophase", summary: "During prophase, chromosomes get thicker and become visible. The nucleus starts to break apart. Spindle fibers begin to form, which will help move the chromosomes later." },
    25: { name: "Metaphase", summary: "In metaphase, chromosomes line up in the middle of the cell. This helps make sure each new cell gets the right number of chromosomes. The spindle fibers attach to the chromosomes to hold them in place." },
    37: { name: "Anaphase", summary: "In anaphase, the chromosomes split and move to opposite sides of the cell. This makes sure each new cell gets a full set of DNA. The spindle fibers pull each half of the chromosome toward the edges of the cell." },
    57: { name: "Telophase", summary: "Telophase is when two new nuclei form. The cell is almost ready to split into two. Chromosomes start to loosen up again, and the cell begins to pinch in the middle." },
    67: { name: "Cytokinesis", summary: "Cytokinesis is the final step. The cell fully splits into two new cells. Each cell gets its own nucleus and a complete set of DNA, ready to start the cycle again." },
    72: { name: "Interphase", summary: "Interphase starts the cycle again. The cell keeps growing and getting ready for another division. It checks its DNA to make sure everything is correct before moving forward." },
};

function updateSlideshow() {
    imgElement.src = `${basePath}image_${currentIndex}.png`;
    handlePhaseSummary();
    updatePauseButton();
}

function handlePhaseSummary() {
    const phase = phases[currentIndex];
    if (phase) showPhaseSummary(phase);
    else resetPhaseSummary();
}

function showPhaseSummary(phase) {
    hideNavButtons();
    phaseIndicator.textContent = `Current Phase: ${phase.name}`;
    summaryText.textContent = phase.summary;
    summaryElement.style.display = 'block';
    summaryElement.style.opacity = 1;
    skipButton.style.display = 'block';
    pauseButton.style.display = 'none';
    startProgressBar();

    pauseSlideshow(); // Pause during phase summary

    clearTimeout(phaseTimeout);
    phaseTimeout = setTimeout(() => {
        hidePhaseSummary();
        resumeSlideshow(); // Resume after summary ends
    }, displayDuration);
}

function resetPhaseSummary() {
    phaseIndicator.textContent = '';
    summaryElement.style.display = 'none';
    skipButton.style.display = 'none';
    showNavButtons();
    pauseButton.style.display = 'inline-block';
}

function startProgressBar() {
    progressBar.style.width = '100%';
    setTimeout(() => {
        progressBar.style.transitionDuration = `${displayDuration}ms`;
        progressBar.style.width = '0%';
    }, 100);
}

function hidePhaseSummary() {
    summaryElement.style.opacity = 0;
    setTimeout(() => {
        summaryElement.style.display = 'none';
        resetPhaseSummary();
    }, 500);
}

function updatePauseButton() {
    pauseButton.textContent = isPaused ? "Unpause" : "Pause";
}

function pauseSlideshow() {
    isPaused = true;
    clearInterval(slideshowInterval);
    updatePauseButton();
}

function resumeSlideshow() {
    isPaused = false;
    startSlideshow();
    updatePauseButton();
}

function changeImage(direction) {
    currentIndex = (currentIndex + direction + totalImages - 1) % totalImages + 1;
    updateSlideshow();
}

function showNavButtons() {
    backButton.style.display = 'inline-block';
    forwardButton.style.display = 'inline-block';
}

function hideNavButtons() {
    backButton.style.display = 'none';
    forwardButton.style.display = 'none';
}

pauseButton.addEventListener('click', () => isPaused ? resumeSlideshow() : pauseSlideshow());
skipButton.addEventListener('click', () => {
    progressBar.style.transitionDuration = '0ms';
    progressBar.style.width = '0%';
    hidePhaseSummary();
    resumeSlideshow();
});
backButton.addEventListener('click', () => { pauseSlideshow(); changeImage(-1); });
forwardButton.addEventListener('click', () => { pauseSlideshow(); changeImage(1); });

function startSlideshow() {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
        if (!isPaused) changeImage(1);
    }, speed);
}

window.onload = () => {
    updateSlideshow();
    startSlideshow();
};
