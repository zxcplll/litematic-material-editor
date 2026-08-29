# Litematic 建材编辑器

一个面向 Minecraft 建筑蓝图的 `.litematic` 建材查看与统一替换工具。应用默认以空白状态启动，用户载入蓝图后才显示材料统计和投影预览。文件解析、替换和导出都在本机完成，不会上传蓝图内容。

## 下载使用

在 GitHub Releases 下载最新版本：

- `Litematic-建材编辑器-1.0.1-setup.exe`：安装版，会创建开始菜单和桌面快捷方式。
- `Litematic-建材编辑器-1.0.1-portable.exe`：便携版，复制后直接运行，不需要安装 Node.js。

启动软件后，点击“选择文件”或把 `.litematic` 拖入窗口。首次打开不会自动载入示例；需要演示数据时可点击顶部“载入示例”。

## 核心功能

- 读取压缩 NBT，统计全部层或指定层的非空气方块。
- 显示方块中文名、Minecraft ID、所需数量和物品图标；投影颜色由 26.2 原版 blockstate、模型和纹理自动生成，覆盖全部 1,195 个非空气方块。
- 使用 26.2 方块目录搜索替换目标，覆盖完整 blockstate ID 和中文语言表。
- 普通模式按几何类别限制替换：普通方块、半砖、楼梯、门、活板门、墙、栅栏、玻璃板、按钮、压力板、告示牌、地毯、铁轨等只能同类互换。
- 替换时保留源方块的 `Properties`，包括朝向、半砖上下、门/活板门开合、连接方式和水浸状态。
- 每种材料都可直接删除；确认后仅在当前选择的全部层或指定层中用无状态的空气替换该材料。
- 高级模式允许跨形状替换，开启前明确提示碰撞箱、占位范围和状态属性可能产生差异。
- 载入蓝图后提供实时投影预览：左键平移、右键旋转、滚轮缩放，替换和按层筛选会立即重绘。
- 导出仍为标准 `.litematic`，保留原始 NBT 节点并更新统计元数据。

## 开发启动

需要 Node.js 18 或更高版本：

```powershell
cd litematic-editor
npm install
npm test
npm run desktop
```

也可以使用静态服务器运行浏览器版：

```powershell
python -m http.server 4173
```

然后打开 <http://localhost:4173/>。

## 构建 Windows 发布包

```powershell
cd litematic-editor
npm install
npm run dist
```

`npm run dist` 会生成 x64 NSIS 安装版和便携版，输出到 `dist/`。窗口和 `.litematic` 文件关联使用 `assets/app-icon.ico`。

## 项目结构

| 路径 | 说明 |
| --- | --- |
| `index.html` / `styles.css` | 用户界面和样式 |
| `app.js` | 清单、替换规则、图标、投影预览和导出流程 |
| `nbt.js` | NBT 读写、GZIP 解压/压缩和 litematic 处理 |
| `blocks-26.2.js` | 26.2 blockstate 目录 |
| `block-names-26.2.js` | 中文方块语言表 |
| `block-colors-26.2.js` | 从 26.2 原版纹理生成的全量投影颜色表 |
| `tools/generate-block-colors.mjs` | 根据原版客户端资源重新生成颜色表 |
| `main.cjs` / `preload.cjs` | Electron 桌面壳和文件关联桥接 |
| `tests/` | NBT round-trip、替换属性、按层删除、形状和投影回归测试 |
| `发布包/` | 本地分发目录，Release 二进制作为 GitHub 附件发布 |

## 验证

```text
NBT_ROUNDTRIP PASS
REPLACEMENT_RULES PASS
PREVIEW_PROJECTION PASS
```

项目使用 MIT License，详见 `LICENSE`。
