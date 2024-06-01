function toggleForms() {
    let serviceType = document.getElementById("serviceType").value;
    document.getElementById("skyForm").classList.toggle("hidden", serviceType !== "sky");
    document.getElementById("cloakForm").classList.toggle("hidden", serviceType !== "cloak");
    document.getElementById("thumbnailForm").classList.toggle("hidden", serviceType !== "thumbnail");
}

function getDiscount(value) {
    return (parseFloat(value) || 0) / 100;
}

function calculateSkyPrice() {
    const baseSkyPrice = 5.00;
    const additionalSkies = parseInt(document.getElementById("additionalSkies").value) || 0;
    const recolorsSky = parseInt(document.getElementById("recolorsSky").value) || 0;
    const skyDiscount = getDiscount(document.getElementById("skyDiscount").value);

    if (additionalSkies > 0 && recolorsSky > 0) {
        displayResult("Error: Additional skies and recolors cannot coexist.");
        return;
    }

    const additionalPrice = additionalSkies * (baseSkyPrice * 0.70);
    const recolorPrice = recolorsSky * (baseSkyPrice * 0.30);
    const totalPrice = (baseSkyPrice + additionalPrice + recolorPrice) * (1 - skyDiscount);

    let command = `/sky`;
    if (additionalSkies > 0) command += ` additional_skies:${additionalSkies}`;
    if (recolorsSky > 0) command += ` recolors:${recolorsSky}`;

    displayResult(`Sky Service Total Price: $${totalPrice.toFixed(2)}`, command);
}

function calculateCloakPrice() {
    const resolutionSelect = document.getElementById("resolution");
    const resolutionPrice = parseFloat(resolutionSelect.options[resolutionSelect.selectedIndex].dataset.price);
    const selectedResolution = resolutionSelect.options[resolutionSelect.selectedIndex].text;

    const additionalCloaks = parseInt(document.getElementById("additionalCloaks").value) || 0;
    const recolors = parseInt(document.getElementById("recolors").value) || 0;
    const animations = parseInt(document.getElementById("animations").value) || 0;
    const particlesEnabled = document.getElementById("particles").value === "enabled" ? 3 : 0;
    const cloakDiscount = Math.max(0, Math.min(getDiscount(document.getElementById("cloakDiscount").value), 100));

    if (additionalCloaks > 0 && recolors > 0) {
        displayResult("Error: Additional cloaks and recolors cannot coexist.");
        return;
    }

    const baseCloakPrice = resolutionPrice;
    const additionalCloakPrice = additionalCloaks * resolutionPrice * 0.9; // 90% of base price
    const recolorPrice = recolors * resolutionPrice * 0.5; // 50% of base price
    const animationPrice = animations * resolutionPrice * 0.2; // 20% of base price per frame

    const totalPrice = (baseCloakPrice + additionalCloakPrice + recolorPrice + animationPrice + particlesEnabled) * (1 - cloakDiscount);

    let command = `/cloak resolution:${selectedResolution}`;
    if (additionalCloaks > 0) command += ` additional_cloaks:${additionalCloaks}`;
    if (recolors > 0) command += ` recolors:${recolors}`;
    if (animations > 0) command += ` animations:${animations}`;
    if (particlesEnabled === 3) command += ` particle_info:Describe your particle`;

    displayResult(`Cloak Service Total Price: $${totalPrice.toFixed(2)}`, command);
}

function calculateThumbnailPrice() {
    const baseThumbnailPrice = 5.00;
    const additionalThumbnails = parseInt(document.getElementById("additionalThumbnails").value) || 0;
    const thumbnailDiscount = getDiscount(document.getElementById("thumbnailDiscount").value);

    const additionalPrice = additionalThumbnails * (baseThumbnailPrice * 0.80);
    const totalPrice = (baseThumbnailPrice + additionalPrice) * (1 - thumbnailDiscount);

    let command = `/thumbnail`;
    if (additionalThumbnails > 0) command += ` additional_thumbnails:${additionalThumbnails}`;

    displayResult(`Thumbnail Service Total Price: $${totalPrice.toFixed(2)}`, command);
}

function displayResult(message, command) {
    var resultDiv = document.getElementById("result");
    var commandDiv = document.getElementById("commandDisplay");
    var copyButton = document.getElementById("copyButton");

    resultDiv.innerText = message
    commandDiv.innerText = command

    if (command) {
        commandDiv.style.display = "block";
        copyButton.style.display = "inline-block"
    } else {
        commandDiv.style.display = "none";
        copyButton.style.display = "none";
    }

    resultDiv.style.display = "block"
}

function copyCommandToClipboard() {
    var commandText = document.getElementById("commandDisplay").innerText;
    navigator.clipboard.writeText(commandText)
}

function disableRecolorsIfAdditional(type) {
    if (type === 'sky') {
        document.getElementById('recolorsSky').disabled = parseInt(document.getElementById('additionalSkies').value) > 0;
    } else if (type === 'cloak') {
        document.getElementById('recolors').disabled = parseInt(document.getElementById('additionalCloaks').value) > 0;
    }
}

function disableAdditionalIfRecolors(type) {
    if (type === 'sky') {
        document.getElementById('additionalSkies').disabled = parseInt(document.getElementById('recolorsSky').value) > 0;
    } else if (type === 'cloak') {
        document.getElementById('additionalCloaks').disabled = parseInt(document.getElementById('recolors').value) > 0;
    }
}

let timeoutId;

function copyText() {
    const button = document.getElementById("copyButton");
    clearTimeout(timeoutId);
    button.textContent = "Copied!";
    timeoutId = setTimeout(() => {
        button.textContent = "Copy Command";
    }, 1000);
}
