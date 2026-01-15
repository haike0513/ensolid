import type { Component } from 'solid-js';
import { Canvas } from '@ensolid/fiber';
import { FiberScene } from './fiber/Scene.fiber';
import { useI18n } from "../i18n";

export const FiberPage: Component = () => {
  const { t } = useI18n();
  return (
    <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* 背景装饰 */}
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      {/* 顶部信息栏 */}
      <div class="absolute top-0 left-0 right-0 z-10 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30">
                <span class="text-xl">🎨</span>
                <span class="text-xs font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  3D Graphics
                </span>
              </div>
              <h1 class="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t().fiberPage.title}
              </h1>
              <p class="text-sm text-gray-400 mt-1">
                {t().fiberPage.subtitle}
              </p>
            </div>
            <div class="flex gap-4 text-sm">
              <div class="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                <div class="text-gray-400 text-xs mb-1">{t().fiberPage.engine}</div>
                <div class="text-white font-medium">Three.js</div>
              </div>
              <div class="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                <div class="text-gray-400 text-xs mb-1">{t().fiberPage.framework}</div>
                <div class="text-white font-medium">SolidJS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D 画布容器 */}
      <div class="relative h-screen w-full pt-[100px]">
        <div class="absolute inset-0 top-[100px]">
          <div class="relative h-full w-full">
            {/* 边框装饰 */}
            <div class="absolute inset-4 border-2 border-purple-500/20 rounded-2xl pointer-events-none z-10"></div>
            <div class="absolute inset-8 border border-blue-500/10 rounded-xl pointer-events-none z-10"></div>
            
            {/* Canvas */}
            <div class="h-full w-full p-4">
              <div class="h-full w-full rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/5">
                <Canvas>
                  <FiberScene />
                </Canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部控制提示 */}
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div class="flex gap-4 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          <div class="flex items-center gap-2 text-sm">
            <div class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            <span class="text-gray-300">{t().fiberPage.controls.rotate}</span>
          </div>
          <div class="w-px h-4 bg-white/20"></div>
          <div class="flex items-center gap-2 text-sm">
            <div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ "animation-delay": "0.5s" }}></div>
            <span class="text-gray-300">{t().fiberPage.controls.zoom}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
