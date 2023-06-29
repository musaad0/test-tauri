import { IFolder, folderSchema, shuffleSchema } from "@/models";
import { Store } from "tauri-plugin-store-api";
import { z } from "zod";

const sessionSchema = z.object({
  index: z.number(),
  folders: z.array(z.string()),
  shuffle: shuffleSchema,
});

type SessionStore = z.infer<typeof sessionSchema>;

const settingsStore = new Store(".settings.dat");
const sessionStore = new Store("session");

export async function storeSessionData(data: SessionStore) {
  const parsedData = sessionSchema.safeParse(data);

  if (!parsedData.success) return;

  await sessionStore.set("session", data);

  await sessionStore.save(); // this manually saves the store, otherwise the store is only saved when your app is closed
}

export async function getSessionData() {
  return await sessionStore
    .get("session")
    .then((item) => sessionSchema.parse(item));
}

export async function getSettings() {
  return await sessionStore.get("theme");
}
