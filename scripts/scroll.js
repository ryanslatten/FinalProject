document.getElementById('mycanvas').addEventListener("wheel", (event) => {
    if (event.deltaX < 0 && screenstate === -1) {
        screenstate = -2;
    } else if (event.deltaX > 0 && screenstate === 0) {
        screenstate = -2;
    }
})