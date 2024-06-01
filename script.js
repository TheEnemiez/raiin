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
    const baseSkyPrice = 2;
    const additionalSkies = parseInt(document.getElementById("additionalSkies").value) || 0;
    const recolorsSky = parseInt(document.getElementById("recolorsSky").value) || 0;
    const skyDiscount = getDiscount(document.getElementById("skyDiscount").value);

    if (additionalSkies > 0 && recolorsSky > 0) {
        displayResult("Error: Additional skies and recolors cannot coexist.");
        return;
    }

    const additionalPrice = additionalSkies * 1.50;
    const recolorPrice = recolorsSky * 1;
    const totalPrice = (baseSkyPrice + additionalPrice + recolorPrice) * (1 - skyDiscount);

    const command = `/sky additional_skies:${additionalSkies} recolors:${recolorsSky}`;

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
    const additionalCloakPrice = additionalCloaks * resolutionPrice * 0.8;
    const recolorPrice = recolors * resolutionPrice * 0.6;
    const animationBasePrice = animations * resolutionPrice * 0.1;
    const additionalAnimationPrice = animations * (additionalCloakPrice * 0.1);
    const recolorAnimationPrice = animations * (recolorPrice * 0.1);

    const totalPrice = (baseCloakPrice + additionalCloakPrice + recolorPrice + animationBasePrice + additionalAnimationPrice + recolorAnimationPrice + particlesEnabled) * (1 - cloakDiscount);

    const command = `/cloak resolution:${selectedResolution} additional_cloaks:${additionalCloaks} recolors:${recolors} animations:${animations} particle_info:${particlesEnabled === 3 ? "Describe your particle" : ""}`;

    displayResult(`Cloak Service Total Price: $${totalPrice.toFixed(2)}`, command);
}


function calculateThumbnailPrice() {
    const baseThumbnailPrice = 2.00;
    const additionalThumbnails = parseInt(document.getElementById("additionalThumbnails").value) || 0;
    const thumbnailDiscount = getDiscount(document.getElementById("thumbnailDiscount").value);

    const additionalPrice = additionalThumbnails * 1.50;
    const totalPrice = (baseThumbnailPrice + additionalPrice) * (1 - thumbnailDiscount);

    const command = `/thumbnail additional_thumbnails:${additionalThumbnails}`;

    displayResult(`Thumbnail Service Total Price: $${totalPrice.toFixed(2)}`, command);
}

function displayResult(message, command) {
    var resultDiv = document.getElementById("result");
    var commandDiv = document.getElementById("commandDisplay");
    var copyButton = document.getElementById("copyButton");

    resultDiv.innerText = message;  // Display the price message.
    commandDiv.innerText = command;  // Store command in a separate div for copying.

    // Only show the command and copy button if a command exists.
    if (command) {
        commandDiv.style.display = "block";
        copyButton.style.display = "inline-block";  // Adjusted to 'inline-block' for better layout control.
    } else {
        commandDiv.style.display = "none";
        copyButton.style.display = "none";
    }

    resultDiv.style.display = "block";  // Make sure the result is visible.
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

    // Clear any existing timeout to prevent overlaps
    clearTimeout(timeoutId);

    // Set the button to the "Copied!" state
    button.textContent = "Copied!";

    // Set a timeout to revert the button back to its original state
    timeoutId = setTimeout(() => {
        button.textContent = "Copy Command";
    }, 1000);
}