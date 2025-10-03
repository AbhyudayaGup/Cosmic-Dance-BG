// Enhanced Interactive Lines Background Script
class InteractiveLinesBackground {
    constructor() {
        this.canvas = document.getElementById('lines-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.animationId = null;
        this.connectionCount = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        
        this.config = {
            pointCount: 80,
            maxDistance: 150,
            mouseInfluence: 100,
            lineOpacity: 0.3,
            pointSize: 2,
            animationSpeed: 0.5,
            lineWidth: 1,
            colors: {
                primary: '#00d4ff',
                secondary: '#0099cc',
                accent: '#0066ff'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createPoints();
        this.setupEventListeners();
        this.setupControls();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createPoints();
        });
    }
    
    createPoints() {
        this.points = [];
        for (let i = 0; i < this.config.pointCount; i++) {
            this.points.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.animationSpeed,
                vy: (Math.random() - 0.5) * this.config.animationSpeed
            });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });
    }
    
    setupControls() {
        // Node count control
        const nodeCountSlider = document.getElementById('node-count');
        const nodeCountValue = document.getElementById('node-count-value');
        if (nodeCountSlider) {
            nodeCountSlider.addEventListener('input', (e) => {
                this.config.pointCount = parseInt(e.target.value);
                nodeCountValue.textContent = e.target.value;
                this.createPoints();
            });
        }
        
        // Mouse influence control
        const mouseInfluenceSlider = document.getElementById('mouse-influence');
        const mouseInfluenceValue = document.getElementById('mouse-influence-value');
        if (mouseInfluenceSlider) {
            mouseInfluenceSlider.addEventListener('input', (e) => {
                this.config.mouseInfluence = parseInt(e.target.value);
                mouseInfluenceValue.textContent = e.target.value;
            });
        }
        
        // Line distance control
        const lineDistanceSlider = document.getElementById('line-distance');
        const lineDistanceValue = document.getElementById('line-distance-value');
        if (lineDistanceSlider) {
            lineDistanceSlider.addEventListener('input', (e) => {
                this.config.maxDistance = parseInt(e.target.value);
                lineDistanceValue.textContent = e.target.value;
            });
        }
        
        // Line width control
        const lineWidthSlider = document.getElementById('line-width');
        const lineWidthValue = document.getElementById('line-width-value');
        if (lineWidthSlider) {
            lineWidthSlider.addEventListener('input', (e) => {
                this.config.lineWidth = parseFloat(e.target.value);
                lineWidthValue.textContent = e.target.value;
            });
        }
        
        // Animation speed control
        const animationSpeedSlider = document.getElementById('animation-speed');
        const animationSpeedValue = document.getElementById('animation-speed-value');
        if (animationSpeedSlider) {
            animationSpeedSlider.addEventListener('input', (e) => {
                this.config.animationSpeed = parseFloat(e.target.value);
                animationSpeedValue.textContent = e.target.value;
                // Update existing points' velocities
                this.points.forEach(point => {
                    const angle = Math.atan2(point.vy, point.vx);
                    point.vx = Math.cos(angle) * this.config.animationSpeed;
                    point.vy = Math.sin(angle) * this.config.animationSpeed;
                });
            });
        }
        
        // Color controls
        const primaryColorPicker = document.getElementById('primary-color');
        if (primaryColorPicker) {
            primaryColorPicker.addEventListener('input', (e) => {
                this.config.colors.primary = e.target.value;
            });
        }
        
        const secondaryColorPicker = document.getElementById('secondary-color');
        if (secondaryColorPicker) {
            secondaryColorPicker.addEventListener('input', (e) => {
                this.config.colors.secondary = e.target.value;
            });
        }
        
        const accentColorPicker = document.getElementById('accent-color');
        if (accentColorPicker) {
            accentColorPicker.addEventListener('input', (e) => {
                this.config.colors.accent = e.target.value;
            });
        }
        
        // Control panel toggle
        const toggleControls = document.getElementById('toggle-controls');
        const controlPanel = document.getElementById('control-panel');
        if (toggleControls && controlPanel) {
            toggleControls.addEventListener('click', () => {
                controlPanel.classList.toggle('collapsed');
            });
        }
        
        // Action buttons
        const resetBtn = document.getElementById('reset-defaults');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetToDefaults());
        }
        
        const randomBtn = document.getElementById('random-preset');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => this.randomPreset());
        }
    }
    
    resetToDefaults() {
        this.config = {
            pointCount: 80,
            maxDistance: 150,
            mouseInfluence: 100,
            lineOpacity: 0.3,
            pointSize: 2,
            animationSpeed: 0.5,
            lineWidth: 1,
            colors: {
                primary: '#00d4ff',
                secondary: '#0099cc',
                accent: '#0066ff'
            }
        };
        this.updateControlValues();
        this.createPoints();
    }
    
    randomPreset() {
        const randomColors = [
            ['#ff6b6b', '#ff8e53', '#ff6b9d'],
            ['#4ecdc4', '#45b7d1', '#96ceb4'],
            ['#feca57', '#ff9ff3', '#54a0ff'],
            ['#5f27cd', '#00d2d3', '#ff9ff3'],
            ['#10ac84', '#1dd1a1', '#feca57'],
            ['#ff6348', '#ff7675', '#fdcb6e']
        ];
        
        const colors = randomColors[Math.floor(Math.random() * randomColors.length)];
        
        this.config.pointCount = Math.floor(Math.random() * 120) + 40;
        this.config.maxDistance = Math.floor(Math.random() * 200) + 100;
        this.config.mouseInfluence = Math.floor(Math.random() * 150) + 80;
        this.config.animationSpeed = Math.random() * 2 + 0.3;
        this.config.lineWidth = Math.random() * 3 + 0.5;
        this.config.colors.primary = colors[0];
        this.config.colors.secondary = colors[1];
        this.config.colors.accent = colors[2];
        
        this.updateControlValues();
        this.createPoints();
    }
    
    updateControlValues() {
        const controls = [
            { id: 'node-count', value: this.config.pointCount },
            { id: 'mouse-influence', value: this.config.mouseInfluence },
            { id: 'line-distance', value: this.config.maxDistance },
            { id: 'line-width', value: this.config.lineWidth },
            { id: 'animation-speed', value: this.config.animationSpeed },
            { id: 'primary-color', value: this.config.colors.primary },
            { id: 'secondary-color', value: this.config.colors.secondary },
            { id: 'accent-color', value: this.config.colors.accent }
        ];
        
        controls.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            const valueElement = document.getElementById(id + '-value');
            
            if (element) element.value = value;
            if (valueElement) valueElement.textContent = value;
        });
    }
    
    updatePoints() {
        this.points.forEach(point => {
            point.x += point.vx;
            point.y += point.vy;
            
            if (point.x < 0 || point.x > this.canvas.width) point.vx *= -1;
            if (point.y < 0 || point.y > this.canvas.height) point.vy *= -1;
            
            point.x = Math.max(0, Math.min(this.canvas.width, point.x));
            point.y = Math.max(0, Math.min(this.canvas.height, point.y));
            
            const dx = this.mouse.x - point.x;
            const dy = this.mouse.y - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseInfluence) {
                const force = (this.config.mouseInfluence - distance) / this.config.mouseInfluence;
                const angle = Math.atan2(dy, dx);
                point.x += Math.cos(angle) * force * 2;
                point.y += Math.sin(angle) * force * 2;
            }
        });
    }
    
    drawPoints() {
        this.points.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, this.config.pointSize, 0, Math.PI * 2);
            this.ctx.fillStyle = this.hexToRgba(this.config.colors.primary, 0.6);
            this.ctx.fill();
        });
    }
    
    drawLines() {
        this.connectionCount = 0;
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i + 1; j < this.points.length; j++) {
                const point1 = this.points[i];
                const point2 = this.points[j];
                
                const dx = point1.x - point2.x;
                const dy = point1.y - point2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.maxDistance) {
                    this.connectionCount++;
                    const opacity = (this.config.maxDistance - distance) / this.config.maxDistance * this.config.lineOpacity;
                    
                    // Create gradient line
                    const gradient = this.ctx.createLinearGradient(point1.x, point1.y, point2.x, point2.y);
                    gradient.addColorStop(0, this.hexToRgba(this.config.colors.primary, opacity));
                    gradient.addColorStop(0.5, this.hexToRgba(this.config.colors.secondary, opacity));
                    gradient.addColorStop(1, this.hexToRgba(this.config.colors.accent, opacity));
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(point1.x, point1.y);
                    this.ctx.lineTo(point2.x, point2.y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = this.config.lineWidth;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawMouseConnection() {
        this.points.forEach(point => {
            const dx = this.mouse.x - point.x;
            const dy = this.mouse.y - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseInfluence) {
                const opacity = (this.config.mouseInfluence - distance) / this.config.mouseInfluence * 0.5;
                
                this.ctx.beginPath();
                this.ctx.moveTo(point.x, point.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.strokeStyle = this.hexToRgba(this.config.colors.primary, opacity);
                this.ctx.lineWidth = this.config.lineWidth + 1;
                this.ctx.stroke();
            }
        });
        
        // Draw glowing cursor
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = this.hexToRgba(this.config.colors.primary, 0.8);
        this.ctx.fill();
        
        // Add pulsing ring
        const pulseSize = 6 + Math.sin(Date.now() * 0.01) * 3;
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, pulseSize, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.hexToRgba(this.config.colors.accent, 0.6);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    updateStats() {
        // Update FPS
        this.frameCount++;
        const currentTime = performance.now();
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            const fpsCounter = document.getElementById('fps-counter');
            if (fpsCounter) fpsCounter.textContent = this.fps;
        }
        
        // Update connection count
        const connectionCounter = document.getElementById('connection-counter');
        if (connectionCounter) connectionCounter.textContent = this.connectionCount;
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawLines();
        this.drawPoints();
        this.drawMouseConnection();
        this.updateStats();
    }
    
    animate() {
        this.updatePoints();
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InteractiveLinesBackground();
});
