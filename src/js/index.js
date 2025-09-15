import { removeBackground } from "https://cdn.jsdelivr.net/npm/@imgly/background-removal/+esm";


const inpImage = document.getElementById("inpImage");
const processBtn = document.getElementById("processBtn");
const originalImage = document.getElementById("originalImage");
const outImage = document.getElementById("outImage");
const downloadBtn = document.getElementById("downloadBtn");

let selected = null;


// this function ables the remove backfround button after the image is loaded
inpImage.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(!file) return;

    selected = file;
    const reader = new FileReader();
    reader.onload = (event) => {
        originalImage.src = event.target.result;
        processBtn.disabled = false;
    };

    reader.readAsDataURL(file);
});

processBtn.addEventListener("click", async () => {
    if (!selected) return;
    processBtn.disabled = true;
    processBtn.textContent = "Wait a minute...";

    try {
        const resultBlob = await removeBackground(selected);

        const img = new Image();
        img.src = URL.createObjectURL(resultBlob);
        img.onload = () => {
            outImage.width = img.width;
            outImage.height = img.height;
            const ctx = outImage.getContext("2d");
            ctx.drawImage(img, 0, 0);

            downloadBtn.href = outImage.toDataURL("image/png");
            downloadBtn.classList.remove("hidden");
            downloadBtn.classList.add("btnStyle");
        };
    } catch (err) {
        alert("Error removing background: " + err.message);
    }

    processBtn.textContent = "Remove Background";
    processBtn.disabled = true;
})