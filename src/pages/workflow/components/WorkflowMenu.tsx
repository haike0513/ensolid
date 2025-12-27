import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
import { Panel } from "@ensolid/solidflow";
import { Button } from "../../../components/ui/button";

interface WorkflowMenuProps {
  onImport: (file: File) => void;
  onExport: () => void;
  onClear: () => void;
}

export const WorkflowMenu: Component<WorkflowMenuProps> = (props) => {
  const [showMenu, setShowMenu] = createSignal(false);
  let fileInput: HTMLInputElement | undefined;

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      props.onImport(file);
    }
    target.value = "";
  };

  return (
    <Panel position="top-left" class="m-4">
      <input
        type="file"
        ref={fileInput}
        style={{ display: "none" }}
        accept=".json"
        onChange={handleFileChange}
      />
      <div class="relative">
        <Button
          variant="outline"
          size="icon"
          class="bg-white border-gray-200 shadow-sm hover:bg-gray-50 h-10 w-10 rounded-lg"
          onClick={() => setShowMenu(!showMenu())}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-700"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </Button>

        <Show when={showMenu()}>
          <div class="absolute top-12 left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-2 flex flex-col gap-1 text-sm text-gray-700 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <button
              onClick={() => {
                fileInput?.click();
                setShowMenu(false);
              }}
              class="flex items-center justify-between px-3 py-2 rounded hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left"
            >
              <div class="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
                <span>Open</span>
              </div>
              <span class="text-xs text-gray-400">Cmd+O</span>
            </button>
            <button
              onClick={() => {
                props.onExport();
                setShowMenu(false);
              }}
              class="flex items-center justify-between px-3 py-2 rounded hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left"
            >
              <div class="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                <span>Save to...</span>
              </div>
            </button>
            <button class="flex items-center justify-between px-3 py-2 rounded hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left">
              <div class="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span>Export image...</span>
              </div>
              <span class="text-xs text-gray-400">Cmd+Shift+E</span>
            </button>

            <div class="h-px bg-gray-100 my-1"></div>

            <button
              onClick={() => {
                props.onClear();
                setShowMenu(false);
              }}
              class="flex items-center justify-between px-3 py-2 rounded hover:bg-red-50 hover:text-red-700 transition-colors text-left"
            >
              <div class="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6" />
                  <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
                <span>Reset canvas</span>
              </div>
            </button>

            <div class="h-px bg-gray-100 my-1"></div>

            <div class="px-3 py-2">
              <div class="text-xs font-semibold text-gray-400 mb-2">Links</div>
              <a
                href="#"
                class="flex items-center gap-3 text-sm text-gray-600 hover:text-indigo-600 mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                GitHub
              </a>
              <a
                href="#"
                class="flex items-center gap-3 text-sm text-gray-600 hover:text-indigo-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 12l-4-4-4 4" />
                </svg>
                Documentation
              </a>
            </div>

            <div class="h-px bg-gray-100 my-1"></div>

            <div class="px-3 py-2 bg-gray-50 rounded mt-1">
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Theme</span>
                <div class="flex gap-1 bg-gray-200 p-1 rounded-md">
                  <button class="p-1 bg-white rounded shadow-sm text-gray-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  </button>
                  <button class="p-1 hover:bg-white rounded hover:shadow-sm text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </Panel>
  );
};
