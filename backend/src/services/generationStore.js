import crypto from "crypto";

const jobs = new Map();

export function createLocalJob(payload) {
  const id = crypto.randomUUID();
  const job = {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "QUEUED",
    ...payload
  };

  jobs.set(id, job);
  return job;
}

export function updateLocalJob(id, patch) {
  const current = jobs.get(id);
  if (!current) return null;

  const updated = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString()
  };

  jobs.set(id, updated);
  return updated;
}

export function getLocalJob(id) {
  return jobs.get(id) || null;
}

export function listLocalJobs() {
  return [...jobs.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
