import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadImages } from "./uploads";
import {
  createCatchLog as createCatchLogOnline,
  fetchLogs as fetchLogsOnline,
  deleteLog as deleteLogOnline,
} from "./logs";

const PENDING_LOGS_KEY = "pendingCatchLogs";
const CACHED_LOGS_KEY = "cachedLogs";

function safeParse(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function getPendingCatchLogs() {
  const stored = await AsyncStorage.getItem(PENDING_LOGS_KEY);
  return safeParse(stored, []);
}

async function setPendingCatchLogs(logs) {
  await AsyncStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(logs));
}

async function getCachedLogs() {
  const stored = await AsyncStorage.getItem(CACHED_LOGS_KEY);
  return safeParse(stored, []);
}

async function setCachedLogs(logs) {
  await AsyncStorage.setItem(CACHED_LOGS_KEY, JSON.stringify(logs || []));
}

function normalizePendingLog(log) {
  return {
    ...log.payload,
    _id: log.id,
    pending: true,
    imageUrls:
      log.payload.imageUrls ||
      log.files?.map((file) => (typeof file === "string" ? file : file.uri)) ||
      [],
    createdAt: log.createdAt,
  };
}

export async function savePendingCatchLog(payload, files) {
  const pendingLogs = await getPendingCatchLogs();
  const item = {
    id: `pending-${Date.now()}`,
    payload,
    files,
    createdAt: new Date().toISOString(),
  };
  await setPendingCatchLogs([item, ...pendingLogs]);
  return item;
}

export async function removePendingCatchLog(id) {
  const pendingLogs = await getPendingCatchLogs();
  await setPendingCatchLogs(pendingLogs.filter((item) => item.id !== id));
}

export async function syncPendingCatchLogs(token) {
  if (!token) return [];

  const pendingLogs = await getPendingCatchLogs();
  if (!pendingLogs.length) return [];

  const remaining = [];
  const synced = [];

  for (const item of pendingLogs) {
    try {
      const imageUrls = item.payload.imageUrls?.length
        ? item.payload.imageUrls
        : item.files?.length
          ? await uploadImages(item.files, token)
          : [];

      const result = await createCatchLogOnline(
        {
          ...item.payload,
          imageUrls,
        },
        token,
      );

      synced.push(result);
    } catch (err) {
      remaining.push(item);
    }
  }

  await setPendingCatchLogs(remaining);

  if (synced.length) {
    try {
      const logs = await fetchLogsOnline(token);
      await setCachedLogs(logs);
    } catch {
      // keep user data if cache update fails
    }
  }

  return synced;
}

export async function fetchOfflineLogs(token) {
  const pendingLogs = (await getPendingCatchLogs()).map(normalizePendingLog);

  try {
    const remoteLogs = await fetchLogsOnline(token);
    await setCachedLogs(remoteLogs);
    return [...pendingLogs, ...remoteLogs].sort((a, b) => {
      const aTime = new Date(a.date || a.createdAt).getTime();
      const bTime = new Date(b.date || b.createdAt).getTime();
      return bTime - aTime;
    });
  } catch {
    const cachedLogs = await getCachedLogs();
    return [...pendingLogs, ...cachedLogs].sort((a, b) => {
      const aTime = new Date(a.date || a.createdAt).getTime();
      const bTime = new Date(b.date || b.createdAt).getTime();
      return bTime - aTime;
    });
  }
}

export async function deleteCatchLog(id, token) {
  if (id?.startsWith("pending-")) {
    await removePendingCatchLog(id);
    return;
  }
  await deleteLogOnline(id, token);
}
