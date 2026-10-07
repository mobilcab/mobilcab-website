// An in-memory stand-in for the parts of Brevo's API the site uses, so the
// real code in src/lib/brevo.ts can be tested without an account or network.
// Install it with vi.stubGlobal('fetch', brevo.fetch).

export interface FakeContact {
  email: string;
  ext_id?: string;
  listIds: Set<number>;
  attributes: Record<string, unknown>;
}

export interface SentEmail {
  to: string;
  templateId: number;
  params: Record<string, string>;
}

export class FakeBrevo {
  contacts = new Map<string, FakeContact>();
  sent: SentEmail[] = [];
  deleted: string[] = [];

  /** Adds a contact directly, as if created elsewhere (by hand, or long ago). */
  seed(email: string, opts: { lists?: number[]; attributes?: Record<string, unknown>; ext_id?: string } = {}) {
    this.contacts.set(email, { email, ext_id: opts.ext_id, listIds: new Set(opts.lists ?? []), attributes: { ...opts.attributes } });
  }

  get(email: string) {
    return this.contacts.get(email);
  }

  fetch = async (input: string | URL | Request, init: RequestInit = {}): Promise<Response> => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    const method = (init.method ?? 'GET').toUpperCase();
    const body = init.body ? JSON.parse(String(init.body)) : {};
    const path = url.pathname.replace(/^\/v3/, '');
    const json = (status: number, data?: unknown) =>
      new Response(data === undefined ? null : JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
    const notFound = () => json(404, { code: 'document_not_found', message: 'Contact does not exist' });
    const view = (c: FakeContact) => ({ email: c.email, ext_id: c.ext_id, listIds: [...c.listIds], attributes: { ...c.attributes } });

    let m: RegExpMatchArray | null;

    if (method === 'POST' && path === '/smtp/email') {
      this.sent.push({ to: body.to[0].email, templateId: body.templateId, params: body.params });
      return json(201, { messageId: `<${this.sent.length}@fake>` });
    }

    if ((m = path.match(/^\/contacts\/lists\/(\d+)\/contacts\/add$/)) && method === 'POST') {
      for (const email of body.emails) this.contacts.get(email)?.listIds.add(Number(m[1]));
      return json(201, { contacts: { success: body.emails, failure: [] } });
    }

    if ((m = path.match(/^\/contacts\/lists\/(\d+)$/)) && method === 'GET') {
      const id = Number(m[1]);
      return json(200, { id, uniqueSubscribers: [...this.contacts.values()].filter((c) => c.listIds.has(id)).length });
    }

    if (path === '/contacts' && method === 'GET') {
      const limit = Number(url.searchParams.get('limit') ?? 50);
      const offset = Number(url.searchParams.get('offset') ?? 0);
      const all = [...this.contacts.values()];
      return json(200, { contacts: all.slice(offset, offset + limit).map(view), count: all.length });
    }

    if (path === '/contacts' && method === 'POST') {
      const existing = this.contacts.get(body.email);
      if (existing && !body.updateEnabled) return json(400, { code: 'duplicate_parameter', message: 'Contact already exist' });
      if (existing) {
        Object.assign(existing.attributes, body.attributes ?? {});
        for (const id of body.listIds ?? []) existing.listIds.add(id);
        return json(204);
      }
      this.seed(body.email, { lists: body.listIds, attributes: body.attributes, ext_id: body.ext_id });
      return json(201, { id: this.contacts.size });
    }

    if ((m = path.match(/^\/contacts\/([^/]+)$/))) {
      const id = decodeURIComponent(m[1]!);
      const contact =
        url.searchParams.get('identifierType') === 'ext_id'
          ? [...this.contacts.values()].find((c) => c.ext_id === id)
          : this.contacts.get(id);

      if (method === 'GET') return contact ? json(200, view(contact)) : notFound();
      if (method === 'PUT') {
        if (!contact) return notFound();
        Object.assign(contact.attributes, body.attributes ?? {});
        if (body.ext_id) contact.ext_id = body.ext_id;
        return json(204);
      }
      if (method === 'DELETE') {
        if (!contact) return notFound();
        this.contacts.delete(contact.email);
        this.deleted.push(contact.email);
        return json(204);
      }
    }

    return json(400, { code: 'unknown_route', message: `${method} ${path} isn't faked` });
  };
}
