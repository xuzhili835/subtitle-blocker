# 字幕遮挡器 (Subtitle Blocker)

一个基于 Electron 的桌面应用程序，用于遮挡视频字幕，帮助用户进行语言学习时的听力练习。

## 🌟 功能特性

- **透明度调节**: 支持 0-100% 透明度调节，适应不同背景
- **颜色自定义**: 可选择任意遮挡颜色
- **灵活调整**: 8个调整手柄，支持全方位大小调整
- **窗口置顶**: 始终显示在最前端，不干扰其他应用
- **快捷操作**:
  - 滚轮/方向键调节透明度
  - 空格键快速打开控制面板
- **设置保存**: 自动保存用户偏好设置
- **现代UI**: 毛玻璃效果的控制面板，美观实用

## 📸 截图

> 主窗口：可拖拽的遮挡区域，鼠标悬停显示调整手柄
>
> 控制面板：透明度和颜色调节界面

## 🚀 快速开始

### 系统要求

- Windows 10+
- Node.js 16+ (仅开发环境)

### 安装运行

#### 从预构建版本安装（推荐）

1. 前往 [Releases](https://github.com/xuzhili835/subtitle-blocker/releases) 页面
2. 下载 Windows 安装包：`Subtitle-Blocker-Setup-x.x.x.exe`
3. 运行安装程序并启动应用

#### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/xuzhili835/subtitle-blocker.git
cd subtitle-blocker

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建应用
npm run package
```

## 🎯 使用方法

1. **启动应用**: 运行程序后会显示一个半透明的黑色遮挡窗口
2. **调整位置**: 拖拽窗口到需要遮挡字幕的位置
3. **调整大小**:
   - 鼠标悬停在窗口边缘或角落
   - 出现调整手柄后拖拽调整
4. **调节透明度**:
   - 使用鼠标滚轮
   - 按方向键（↑调高，↓调低）
   - 在控制面板中使用滑块
5. **打开控制面板**: 按空格键或点击应用图标
6. **自定义颜色**: 在控制面板中选择喜欢的遮挡颜色

## 🎮 快捷键

| 快捷键 | 功能 |
|--------|------|
| `空格键` | 打开/关闭控制面板 |
| `↑` | 增加透明度 |
| `↓` | 减少透明度 |
| `鼠标滚轮` | 调节透明度 |

## 🛠️ 技术栈

- **框架**: [Electron](https://electronjs.org/) 38.2.0
- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **构建工具**: electron-builder
- **开发工具**: TypeScript, Vite

## 📁 项目结构

```
subtitle-blocker/
├── src/
│   ├── main.js              # Electron 主进程
│   ├── index.html           # 主遮挡器窗口
│   ├── control-panel.html   # 控制面板窗口
│   ├── preload.js           # 通用预加载脚本
│   ├── preload-main.js      # 主窗口预加载脚本
│   └── preload-control.js   # 控制面板预加载脚本
├── package.json             # 项目配置
└── README.md               # 项目文档
```

## 🔧 开发

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发模式
npm run dev

# 构建应用
npm run package
```

### 构建配置

应用支持 Windows 平台的构建：

- **Windows**: NSIS 安装包

构建文件将输出到 `dist/` 目录。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Electron](https://electronjs.org/) - 跨平台桌面应用框架
- [electron-builder](https://electron.build/) - 应用打包工具

## 📞 联系方式

如果你有任何问题或建议，欢迎提交 [Issue](https://github.com/xuzhili835/subtitle-blocker/issues)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！