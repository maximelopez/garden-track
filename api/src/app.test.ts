/**
 * Tests de l'API (sans base de données), lancés avec : npm test
 * Utilise le test runner intégré à Node.js (node:test), aucune librairie à installer.
 */
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';

import { app } from './app.ts';

let server: Server;
let baseUrl: string;

// Démarre l'API sur un port libre avant les tests, l'arrête après
before(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address() as AddressInfo;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe('API GardenTrack', () => {
  it('GET /health répond { status: "ok" }', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: 'ok' });
  });

  it('une route inconnue renvoie une 404 en JSON', async () => {
    const res = await fetch(`${baseUrl}/route-qui-nexiste-pas`);
    assert.equal(res.status, 404);
    const body = (await res.json()) as { error: string };
    assert.match(body.error, /Route introuvable/);
  });

  it('GET /photos/:id avec un id invalide renvoie une 404', async () => {
    const res = await fetch(`${baseUrl}/photos/pas-un-id`);
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'Photo introuvable' });
  });
});
