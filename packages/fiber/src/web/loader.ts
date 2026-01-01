import { createResource } from "solid-js";
import * as THREE from "three";

export function useLoader<T>(
  LoaderClass: new () => THREE.Loader,
  url: string | string[],
  extensions?: (loader: THREE.Loader) => void
) {
  const [resource] = createResource(async () => {
    const loader = new LoaderClass();
    if (extensions) extensions(loader);

    if (Array.isArray(url)) {
      return Promise.all(
        url.map(
          (u) =>
            new Promise((resolve, reject) => {
              loader.load(u, resolve as any, undefined, reject);
            })
        )
      );
    }

    return new Promise((resolve, reject) => {
      loader.load(url, resolve as any, undefined, reject);
    });
  });

  return resource;
}
