"use strict";

const BOOT_CONFIG = {
    width: 1280,
    height: 720,
    gridSize: 40,
    backgroundTop: "#07111d",
    backgroundBottom: "#0d2236",
    gridColor: "rgba(120, 180, 220, 0.12)"
};

function drawBootScreen(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, BOOT_CONFIG.backgroundTop);
    gradient.addColorStop(1, BOOT_CONFIG.backgroundBottom);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = BOOT_CONFIG.gridColor;
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += BOOT_CONFIG.gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let y = 0; y <= height; y += BOOT_CONFIG.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.fillStyle = "#d8f2ff";
    ctx.font = "700 44px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText("ECLIPSE SIEGE", width * 0.5, height * 0.44);

    ctx.fillStyle = "#8fb5c8";
    ctx.font = "400 20px Trebuchet MS";
    ctx.fillText("Commit 1: Canvas initialized", width * 0.5, height * 0.51);
}

function bootstrapCanvas() {
    const canvas = document.getElementById("gameCanvas");
    const stateEl = document.getElementById("gameState");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        stateEl.textContent = "canvas-error";
        return;
    }

    canvas.width = BOOT_CONFIG.width;
    canvas.height = BOOT_CONFIG.height;

    drawBootScreen(ctx, canvas.width, canvas.height);

    stateEl.textContent = "ready";
}

document.addEventListener("DOMContentLoaded", bootstrapCanvas);
