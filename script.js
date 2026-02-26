const projects = [
        { name: "F2 ARHUD", fov: 12, res: 1920 },
        { name: "F2N ARHUD Near", fov: 10, res: 1000 },
        { name: "F2N ARHUD Far", fov: 12, res: 1350 },
        { name: "F3 ARHUD", fov: 10.7, res: 1800 },
        { name: "F1L ARHUD", fov: 10.7, res: 1800 },
        { name: "EHU ARHUD", fov: 10.7, res: 1800 },    
        { name: "X6S ARHUD", fov: 12.4, res: 1920 },
        { name: "X1L WHUD", fov: 9, res: 1074 },
        { name: "EHV WHUD", fov: 9, res: 730 },
        { name: "X4M WHUD", fov: 9, res: 747 },
        { name: "X6M WHUD", fov: 9, res: 1482 },
        { name: "SHB WHUD", fov: 9, res: 1245 },
    ];

// 👻 交互逻辑
const ghostEmoji = document.getElementById('ghost-emoji');
ghostEmoji.addEventListener('click', (e) => {
    ghostEmoji.style.transform = 'scale(1.6)';
    setTimeout(() => { ghostEmoji.style.transform = 'scale(1)'; }, 200);
    const rect = ghostEmoji.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
        const ghost = document.createElement('div');
        ghost.className = 'floating-ghost';
        ghost.innerText = '👻';
        ghost.style.setProperty('--x-random', `${(Math.random() - 0.5) * 240}px`);
        ghost.style.setProperty('--r-random', `${(Math.random() - 0.5) * 60}deg`);
        ghost.style.left = (rect.left + rect.width / 2 - 15) + 'px';
        ghost.style.top = (rect.top + rect.height / 2 - 15) + 'px';
        document.body.appendChild(ghost);
        setTimeout(() => ghost.remove(), 1800);
    }
});

function renderProjects() {
    document.getElementById('projectList').innerHTML = projects.map(p => `
        <tr onclick="applyHw(${p.fov}, ${p.res})">
            <td>${p.name}</td><td>${p.fov}°</td><td>${p.res}px</td>
        </tr>
    `).join('');
    const options = projects.map((p, i) => `<option value="${i}">${p.name}</option>`).join('');
    document.getElementById('srcProject').innerHTML = options;
    document.getElementById('dstProject').innerHTML = options;
    document.getElementById('srcProject').selectedIndex = 0;
    document.getElementById('dstProject').selectedIndex = 5;
}

function calcConvert() {
    const srcP = projects[document.getElementById('srcProject').value];
    const dstP = projects[document.getElementById('dstProject').value];
    const px = parseFloat(document.getElementById('convertInputPx').value) || 0;
    const srcPpd = srcP.res / srcP.fov;
    const dstPpd = dstP.res / dstP.fov;
    const fov = px / srcPpd;
    document.getElementById('srcPpdVal').innerText = srcPpd.toFixed(1);
    document.getElementById('dstPpdVal').innerText = dstPpd.toFixed(1);
    document.getElementById('srcFovVal').innerText = fov.toFixed(2);
    document.getElementById('convertFov').innerText = fov.toFixed(2);
    document.getElementById('convertResult').innerText = Math.round(fov * dstPpd);
}

function calculateAll() {
    const f = parseFloat(document.getElementById('hwFov').value) || 0;
    const r = parseFloat(document.getElementById('hwRes').value) || 0;
    const tF = parseFloat(document.getElementById('targetFov').value) || 0;
    if (f > 0 && r > 0) {
        const ppd = r / f;
        document.getElementById('ppdOut').innerText = ppd.toFixed(2);
        document.getElementById('pxOut').innerText = Math.round(tF * ppd);
    }
}

function applyHw(f, r) { document.getElementById('hwFov').value = f; document.getElementById('hwRes').value = r; calculateAll(); }

function calculateColor() {
    const c1 = parseColor(document.getElementById('color1').value);
    const c2 = parseColor(document.getElementById('color2').value);
    if (c1 && c2) {
        const y1 = 0.299 * c1.r + 0.587 * c1.g + 0.114 * c1.b;
        const y2 = 0.299 * c2.r + 0.587 * c2.g + 0.114 * c2.b;
        document.getElementById('y-diff').innerText = Math.abs(y1 - y2).toFixed(2);
    }
}

function parseColor(input) {
    input = input.trim();
    let r, g, b;
    if (input.startsWith('#')) {
        const hex = input.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else if (input.toLowerCase().startsWith('rgb')) {
        const match = input.match(/\d+/g);
        if (match) [r, g, b] = match.map(Number);
    }
    return (isNaN(r) || isNaN(g) || isNaN(b)) ? null : { r, g, b };
}

renderProjects(); calculateAll(); calcConvert();