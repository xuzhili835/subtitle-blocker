const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let controlPanelWindow;
let isResizing = false;
let currentOpacity = 0.8;
let currentColor = '#000000';

// 设置存储路径
const settingsPath = path.join(app.getPath('userData'), 'subtitle-blocker-settings.json');

// 保存设置到文件
function saveSettings(settings) {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}

// 从文件加载设置
function loadSettings() {
    try {
        if (fs.existsSync(settingsPath)) {
            const data = fs.readFileSync(settingsPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
    return {};
}

// 创建主遮挡器窗口
function createMainWindow() {
    // 加载保存的设置
    const settings = loadSettings();

    // 从设置中恢复窗口状态，或使用默认值
    const windowBounds = settings.bounds || { x: null, y: null, width: 400, height: 100 };
    currentOpacity = settings.opacity || 0.8;
    currentColor = settings.color || '#000000';

    mainWindow = new BrowserWindow({
        width: windowBounds.width,
        height: windowBounds.height,
        minWidth: 50,
        minHeight: 20,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: false,  // 显示任务栏图标
        resizable: true,
        type: 'toolbar',    // 设置窗口类型，提高置顶优先级
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload-main.js')
        }
    });

    // 确保窗口始终在最前面
    mainWindow.setAlwaysOnTop(true, 'screen-saver');

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // 设置窗口位置
    if (windowBounds.x !== null && windowBounds.y !== null) {
        mainWindow.setPosition(windowBounds.x, windowBounds.y);
    } else {
        mainWindow.center();
    }

    // 等待窗口加载完成后应用初始样式
    mainWindow.webContents.once('did-finish-load', () => {
        const r = parseInt(currentColor.slice(1, 3), 16);
        const g = parseInt(currentColor.slice(3, 5), 16);
        const b = parseInt(currentColor.slice(5, 7), 16);

        mainWindow.webContents.send('style-update', {
            r, g, b, opacity: currentOpacity
        });
    });

    // 保存窗口状态
    mainWindow.on('moved', () => {
        if (mainWindow) {
            const bounds = mainWindow.getBounds();
            const settings = loadSettings();
            settings.bounds = bounds;
            saveSettings(settings);
        }
    });

    mainWindow.on('resized', () => {
        if (mainWindow) {
            const bounds = mainWindow.getBounds();
            const settings = loadSettings();
            settings.bounds = bounds;
            saveSettings(settings);
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (controlPanelWindow) {
            controlPanelWindow.close();
        }
    });
}

// 创建控制面板窗口
function createControlPanelWindow() {
    if (controlPanelWindow) {
        controlPanelWindow.focus();
        return;
    }

    controlPanelWindow = new BrowserWindow({
        width: 300,
        height: 380,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload-control.js')
        }
    });

    controlPanelWindow.loadFile(path.join(__dirname, 'control-panel.html'));
    controlPanelWindow.center();

    controlPanelWindow.on('closed', () => {
        controlPanelWindow = null;
    });

    // 窗口失焦时自动隐藏（可选）
    controlPanelWindow.on('blur', () => {
        // 注释掉这行如果你希望窗口保持打开
        // setTimeout(() => {
        //     if (controlPanelWindow && !controlPanelWindow.isFocused()) {
        //         controlPanelWindow.hide();
        //     }
        // }, 200);
    });
}

// IPC通信处理
function setupIpcHandlers() {
    // 主窗口相关
    ipcMain.handle('resize-window', (event, { handle, deltaX, deltaY }) => {
        if (!mainWindow || isResizing) return;

        isResizing = true;

        try {
            const [currentWidth, currentHeight] = mainWindow.getSize();
            const [currentX, currentY] = mainWindow.getPosition();

            let newWidth = currentWidth;
            let newHeight = currentHeight;
            let newX = currentX;
            let newY = currentY;

            switch(handle) {
                case 'right':
                    newWidth = Math.max(50, currentWidth + deltaX);
                    break;
                case 'left':
                    newWidth = Math.max(50, currentWidth - deltaX);
                    newX = currentX + deltaX;
                    break;
                case 'bottom':
                    newHeight = Math.max(20, currentHeight + deltaY);
                    break;
                case 'top':
                    newHeight = Math.max(20, currentHeight - deltaY);
                    newY = currentY + deltaY;
                    break;
                case 'bottom-right':
                    newWidth = Math.max(50, currentWidth + deltaX);
                    newHeight = Math.max(20, currentHeight + deltaY);
                    break;
                case 'bottom-left':
                    newWidth = Math.max(50, currentWidth - deltaX);
                    newHeight = Math.max(20, currentHeight + deltaY);
                    newX = currentX + deltaX;
                    break;
                case 'top-right':
                    newWidth = Math.max(50, currentWidth + deltaX);
                    newHeight = Math.max(20, currentHeight - deltaY);
                    newY = currentY + deltaY;
                    break;
                case 'top-left':
                    newWidth = Math.max(50, currentWidth - deltaX);
                    newHeight = Math.max(20, currentHeight - deltaY);
                    newX = currentX + deltaX;
                    newY = currentY + deltaY;
                    break;
            }

            mainWindow.setBounds({
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight
            });

        } catch (error) {
            console.error('Resize error:', error);
        } finally {
            setTimeout(() => {
                isResizing = false;
            }, 16);
        }
    });

    // 显示控制面板
    ipcMain.handle('show-control-panel', () => {
        if (controlPanelWindow) {
            // 如果控制面板已打开，则关闭它
            controlPanelWindow.close();
            controlPanelWindow = null;
        } else {
            // 如果控制面板未打开，则创建它
            createControlPanelWindow();
        }
    });

    // 隐藏控制面板
    ipcMain.handle('hide-control-panel', () => {
        if (controlPanelWindow) {
            controlPanelWindow.close();
            controlPanelWindow = null;
        }
    });

    
    // 更新遮挡器样式
    ipcMain.handle('update-blocker-style', (event, { color, opacity }) => {
        currentColor = color;
        currentOpacity = opacity;

        // 保存设置
        const settings = loadSettings();
        settings.color = color;
        settings.opacity = opacity;
        saveSettings(settings);

        // 通知主窗口更新样式
        if (mainWindow && mainWindow.webContents) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            mainWindow.webContents.send('style-update', {
                r, g, b, opacity
            });
        }
    });

    // 调整透明度
    ipcMain.handle('adjust-opacity', (event, delta) => {
        const newOpacity = Math.max(0, Math.min(1, currentOpacity + (delta / 100)));
        currentOpacity = newOpacity;

        // 保存设置
        const settings = loadSettings();
        settings.opacity = newOpacity;
        saveSettings(settings);

        if (mainWindow && mainWindow.webContents) {
            const r = parseInt(currentColor.slice(1, 3), 16);
            const g = parseInt(currentColor.slice(3, 5), 16);
            const b = parseInt(currentColor.slice(5, 7), 16);

            mainWindow.webContents.send('style-update', {
                r, g, b, opacity: newOpacity
            });
        }

        // 如果控制面板打开，同步更新滑块
        if (controlPanelWindow && controlPanelWindow.webContents) {
            controlPanelWindow.webContents.send('opacity-update', Math.round(newOpacity * 100));
        }
    });

    // 获取当前设置
    ipcMain.handle('get-settings', () => {
        return {
            opacity: Math.round(currentOpacity * 100),
            color: currentColor
        };
    });

    // 获取当前透明度
    ipcMain.handle('get-current-opacity', () => {
        return currentOpacity;
    });

    // 获取当前颜色
    ipcMain.handle('get-current-color', () => {
        return currentColor;
    });

    // 退出应用
    ipcMain.handle('quit-app', () => {
        app.quit();
    });
}

// 应用程序事件
app.whenReady().then(() => {
    createMainWindow();
    setupIpcHandlers();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});