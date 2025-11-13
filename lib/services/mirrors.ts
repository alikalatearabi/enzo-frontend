import { MIRRORS, MirrorTemplate } from "../mocks/mirrors";

export async function getMirrors(): Promise<MirrorTemplate[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MIRRORS), 200);
  });
}

export async function createMirror(input: Partial<MirrorTemplate>) {
  console.info("createMirror() mock", input);
  return Promise.resolve({
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function updateMirror(id: string, input: Partial<MirrorTemplate>) {
  console.info("updateMirror() mock", id, input);
  return Promise.resolve({
    ...input,
    id,
    updatedAt: new Date().toISOString(),
  });
}

