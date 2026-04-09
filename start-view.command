#!/bin/bash
# 双击此文件启动 Residue 可视化前端。
# 会自动安装依赖（首次）、启动 Vite 开发服务器、打开浏览器。

cd "$(dirname "$0")/view" || exit 1

# 首次运行时自动安装依赖。
if [ ! -d "node_modules" ]; then
  echo "首次启动，正在安装依赖..."
  npm install || { echo "npm install 失败"; read -p "按回车退出"; exit 1; }
fi

PORT=4177

# 先杀掉可能残留的旧进程。
lsof -ti tcp:$PORT | xargs kill 2>/dev/null

echo ""
echo "  ╔══════════════════════════════════╗"
echo "  ║  Residue 氛围可视化前端          ║"
echo "  ║  http://localhost:$PORT            ║"
echo "  ║  关闭此窗口即可停止服务器        ║"
echo "  ╚══════════════════════════════════╝"
echo ""

# 后台等 Vite 真正就绪后再打开浏览器。
(
  for i in $(seq 1 20); do
    sleep 0.5
    if curl -s -o /dev/null http://localhost:$PORT; then
      open "http://localhost:$PORT"
      exit 0
    fi
  done
  echo "等待超时，请手动打开 http://localhost:$PORT"
) &

# --strict-port 确保端口不会被偷换。
npx vite --host localhost --port $PORT --strictPort
