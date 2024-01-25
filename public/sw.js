!(function () {
  "use strict";
  var e, t;
  let a, s, i, n, r;
  let o = {
      googleAnalytics: "googleAnalytics",
      precache: "precache-v2",
      prefix: "serwist",
      runtime: "runtime",
      suffix: "undefined" != typeof registration ? registration.scope : "",
    },
    c = (e) =>
      [o.prefix, e, o.suffix].filter((e) => e && e.length > 0).join("-"),
    l = (e) => {
      for (let t of Object.keys(o)) e(t);
    },
    h = {
      updateDetails: (e) => {
        l((t) => {
          let a = e[t];
          "string" == typeof a && (o[t] = a);
        });
      },
      getGoogleAnalyticsName: (e) => e || c(o.googleAnalytics),
      getPrecacheName: (e) => e || c(o.precache),
      getPrefix: () => o.prefix,
      getRuntimeName: (e) => e || c(o.runtime),
      getSuffix: () => o.suffix,
    },
    u = (e, ...t) => {
      let a = e;
      return t.length > 0 && (a += ` :: ${JSON.stringify(t)}`), a;
    };
  class d extends Error {
    details;
    constructor(e, t) {
      super(u(e, t)), (this.name = e), (this.details = t);
    }
  }
  let f = new Set();
  async function p(e, t) {
    let s = null;
    if ((e.url && (s = new URL(e.url).origin), s !== self.location.origin))
      throw new d("cross-origin-copy-response", { origin: s });
    let i = e.clone(),
      n = {
        headers: new Headers(i.headers),
        status: i.status,
        statusText: i.statusText,
      },
      r = t ? t(n) : n,
      o = !(function () {
        if (void 0 === a) {
          let e = new Response("");
          if ("body" in e)
            try {
              new Response(e.body), (a = !0);
            } catch (e) {
              a = !1;
            }
          a = !1;
        }
        return a;
      })()
        ? await i.blob()
        : i.body;
    return new Response(o, r);
  }
  class m {
    promise;
    resolve;
    reject;
    constructor() {
      this.promise = new Promise((e, t) => {
        (this.resolve = e), (this.reject = t);
      });
    }
  }
  function g(e, t) {
    let a = new URL(e);
    for (let e of t) a.searchParams.delete(e);
    return a.href;
  }
  async function w(e, t, a, s) {
    let i = g(t.url, a);
    if (t.url === i) return e.match(t, s);
    let n = { ...s, ignoreSearch: !0 };
    for (let r of await e.keys(t, n))
      if (i === g(r.url, a)) return e.match(r, s);
  }
  function y(e) {
    e.then(() => {});
  }
  async function _() {
    for (let e of f) await e();
  }
  let b = (e) =>
    new URL(String(e), location.href).href.replace(
      RegExp(`^${location.origin}`),
      "",
    );
  function v(e) {
    return new Promise((t) => setTimeout(t, e));
  }
  async function x(e) {
    let t;
    if (!e) return;
    let a = await self.clients.matchAll({ type: "window" }),
      s = new Set(a.map((e) => e.id)),
      i = performance.now();
    for (
      ;
      performance.now() - i < 2e3 &&
      !(t = (a = await self.clients.matchAll({ type: "window" })).find((t) =>
        e ? t.id === e : !s.has(t.id),
      ));

    )
      await v(100);
    return t;
  }
  function R(e, t) {
    let a = t();
    return e.waitUntil(a), a;
  }
  let E = (e, t) => t.some((t) => e instanceof t),
    S = new WeakMap(),
    q = new WeakMap(),
    C = new WeakMap(),
    D = {
      get(e, t, a) {
        if (e instanceof IDBTransaction) {
          if ("done" === t) return S.get(e);
          if ("store" === t)
            return a.objectStoreNames[1]
              ? void 0
              : a.objectStore(a.objectStoreNames[0]);
        }
        return N(e[t]);
      },
      set: (e, t, a) => ((e[t] = a), !0),
      has: (e, t) =>
        (e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
        t in e,
    };
  function N(e) {
    var t;
    if (e instanceof IDBRequest)
      return (function (e) {
        let t = new Promise((t, a) => {
          let s = () => {
              e.removeEventListener("success", i),
                e.removeEventListener("error", n);
            },
            i = () => {
              t(N(e.result)), s();
            },
            n = () => {
              a(e.error), s();
            };
          e.addEventListener("success", i), e.addEventListener("error", n);
        });
        return C.set(t, e), t;
      })(e);
    if (q.has(e)) return q.get(e);
    let a =
      "function" == typeof (t = e)
        ? (
            i ||
            (i = [
              IDBCursor.prototype.advance,
              IDBCursor.prototype.continue,
              IDBCursor.prototype.continuePrimaryKey,
            ])
          ).includes(t)
          ? function (...e) {
              return t.apply(k(this), e), N(this.request);
            }
          : function (...e) {
              return N(t.apply(k(this), e));
            }
        : (t instanceof IDBTransaction &&
              (function (e) {
                if (S.has(e)) return;
                let t = new Promise((t, a) => {
                  let s = () => {
                      e.removeEventListener("complete", i),
                        e.removeEventListener("error", n),
                        e.removeEventListener("abort", n);
                    },
                    i = () => {
                      t(), s();
                    },
                    n = () => {
                      a(
                        e.error || new DOMException("AbortError", "AbortError"),
                      ),
                        s();
                    };
                  e.addEventListener("complete", i),
                    e.addEventListener("error", n),
                    e.addEventListener("abort", n);
                });
                S.set(e, t);
              })(t),
            E(
              t,
              s ||
                (s = [
                  IDBDatabase,
                  IDBObjectStore,
                  IDBIndex,
                  IDBCursor,
                  IDBTransaction,
                ]),
            ))
          ? new Proxy(t, D)
          : t;
    return a !== e && (q.set(e, a), C.set(a, e)), a;
  }
  let k = (e) => C.get(e);
  function P(
    e,
    t,
    { blocked: a, upgrade: s, blocking: i, terminated: n } = {},
  ) {
    let r = indexedDB.open(e, t),
      o = N(r);
    return (
      s &&
        r.addEventListener("upgradeneeded", (e) => {
          s(N(r.result), e.oldVersion, e.newVersion, N(r.transaction), e);
        }),
      a &&
        r.addEventListener("blocked", (e) => a(e.oldVersion, e.newVersion, e)),
      o
        .then((e) => {
          n && e.addEventListener("close", () => n()),
            i &&
              e.addEventListener("versionchange", (e) =>
                i(e.oldVersion, e.newVersion, e),
              );
        })
        .catch(() => {}),
      o
    );
  }
  let T = ["get", "getKey", "getAll", "getAllKeys", "count"],
    A = ["put", "add", "delete", "clear"],
    L = new Map();
  function I(e, t) {
    if (!(e instanceof IDBDatabase && !(t in e) && "string" == typeof t))
      return;
    if (L.get(t)) return L.get(t);
    let a = t.replace(/FromIndex$/, ""),
      s = t !== a,
      i = A.includes(a);
    if (
      !(a in (s ? IDBIndex : IDBObjectStore).prototype) ||
      !(i || T.includes(a))
    )
      return;
    let n = async function (e, ...t) {
      let n = this.transaction(e, i ? "readwrite" : "readonly"),
        r = n.store;
      return (
        s && (r = r.index(t.shift())),
        (await Promise.all([r[a](...t), i && n.done]))[0]
      );
    };
    return L.set(t, n), n;
  }
  D = {
    ...(e = D),
    get: (t, a, s) => I(t, a) || e.get(t, a, s),
    has: (t, a) => !!I(t, a) || e.has(t, a),
  };
  let U = ["continue", "continuePrimaryKey", "advance"],
    F = {},
    W = new WeakMap(),
    M = new WeakMap(),
    B = {
      get(e, t) {
        if (!U.includes(t)) return e[t];
        let a = F[t];
        return (
          a ||
            (a = F[t] =
              function (...e) {
                W.set(this, M.get(this)[t](...e));
              }),
          a
        );
      },
    };
  async function* O(...e) {
    let t = this;
    if ((t instanceof IDBCursor || (t = await t.openCursor(...e)), !t)) return;
    let a = new Proxy(t, B);
    for (M.set(a, t), C.set(a, k(t)); t; )
      yield a, (t = await (W.get(a) || t.continue())), W.delete(a);
  }
  function K(e, t) {
    return (
      (t === Symbol.asyncIterator &&
        E(e, [IDBIndex, IDBObjectStore, IDBCursor])) ||
      ("iterate" === t && E(e, [IDBIndex, IDBObjectStore]))
    );
  }
  D = {
    ...(t = D),
    get: (e, a, s) => (K(e, a) ? O : t.get(e, a, s)),
    has: (e, a) => K(e, a) || t.has(e, a),
  };
  let j = "requests",
    $ = "queueName";
  class H {
    _db = null;
    async addEntry(e) {
      let t = (await this.getDb()).transaction(j, "readwrite", {
        durability: "relaxed",
      });
      await t.store.add(e), await t.done;
    }
    async getFirstEntryId() {
      let e = await this.getDb(),
        t = await e.transaction(j).store.openCursor();
      return t?.value.id;
    }
    async getAllEntriesByQueueName(e) {
      let t = await this.getDb();
      return (await t.getAllFromIndex(j, $, IDBKeyRange.only(e))) || [];
    }
    async getEntryCountByQueueName(e) {
      return (await this.getDb()).countFromIndex(j, $, IDBKeyRange.only(e));
    }
    async deleteEntry(e) {
      let t = await this.getDb();
      await t.delete(j, e);
    }
    async getFirstEntryByQueueName(e) {
      return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "next");
    }
    async getLastEntryByQueueName(e) {
      return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "prev");
    }
    async getEndEntryFromIndex(e, t) {
      let a = await this.getDb(),
        s = await a.transaction(j).store.index($).openCursor(e, t);
      return s?.value;
    }
    async getDb() {
      return (
        this._db ||
          (this._db = await P("serwist-background-sync", 3, {
            upgrade: this._upgradeDb,
          })),
        this._db
      );
    }
    _upgradeDb(e, t) {
      t > 0 &&
        t < 3 &&
        e.objectStoreNames.contains(j) &&
        e.deleteObjectStore(j),
        e
          .createObjectStore(j, { autoIncrement: !0, keyPath: "id" })
          .createIndex($, $, { unique: !1 });
    }
  }
  class G {
    _queueName;
    _queueDb;
    constructor(e) {
      (this._queueName = e), (this._queueDb = new H());
    }
    async pushEntry(e) {
      delete e.id,
        (e.queueName = this._queueName),
        await this._queueDb.addEntry(e);
    }
    async unshiftEntry(e) {
      let t = await this._queueDb.getFirstEntryId();
      t ? (e.id = t - 1) : delete e.id,
        (e.queueName = this._queueName),
        await this._queueDb.addEntry(e);
    }
    async popEntry() {
      return this._removeEntry(
        await this._queueDb.getLastEntryByQueueName(this._queueName),
      );
    }
    async shiftEntry() {
      return this._removeEntry(
        await this._queueDb.getFirstEntryByQueueName(this._queueName),
      );
    }
    async getAll() {
      return await this._queueDb.getAllEntriesByQueueName(this._queueName);
    }
    async size() {
      return await this._queueDb.getEntryCountByQueueName(this._queueName);
    }
    async deleteEntry(e) {
      await this._queueDb.deleteEntry(e);
    }
    async _removeEntry(e) {
      return e && (await this.deleteEntry(e.id)), e;
    }
  }
  let V = [
    "method",
    "referrer",
    "referrerPolicy",
    "mode",
    "credentials",
    "cache",
    "redirect",
    "integrity",
    "keepalive",
  ];
  class Q {
    _requestData;
    static async fromRequest(e) {
      let t = { url: e.url, headers: {} };
      for (let a of ("GET" !== e.method &&
        (t.body = await e.clone().arrayBuffer()),
      e.headers.forEach((e, a) => {
        t.headers[a] = e;
      }),
      V))
        void 0 !== e[a] && (t[a] = e[a]);
      return new Q(t);
    }
    constructor(e) {
      "navigate" === e.mode && (e.mode = "same-origin"),
        (this._requestData = e);
    }
    toObject() {
      let e = Object.assign({}, this._requestData);
      return (
        (e.headers = Object.assign({}, this._requestData.headers)),
        e.body && (e.body = e.body.slice(0)),
        e
      );
    }
    toRequest() {
      return new Request(this._requestData.url, this._requestData);
    }
    clone() {
      return new Q(this.toObject());
    }
  }
  let z = "serwist-background-sync",
    J = new Set(),
    X = (e) => {
      let t = {
        request: new Q(e.requestData).toRequest(),
        timestamp: e.timestamp,
      };
      return e.metadata && (t.metadata = e.metadata), t;
    };
  class Y {
    _name;
    _onSync;
    _maxRetentionTime;
    _queueStore;
    _forceSyncFallback;
    _syncInProgress = !1;
    _requestsAddedDuringSync = !1;
    constructor(
      e,
      { forceSyncFallback: t, onSync: a, maxRetentionTime: s } = {},
    ) {
      if (J.has(e)) throw new d("duplicate-queue-name", { name: e });
      J.add(e),
        (this._name = e),
        (this._onSync = a || this.replayRequests),
        (this._maxRetentionTime = s || 10080),
        (this._forceSyncFallback = !!t),
        (this._queueStore = new G(this._name)),
        this._addSyncListener();
    }
    get name() {
      return this._name;
    }
    async pushRequest(e) {
      await this._addRequest(e, "push");
    }
    async unshiftRequest(e) {
      await this._addRequest(e, "unshift");
    }
    async popRequest() {
      return this._removeRequest("pop");
    }
    async shiftRequest() {
      return this._removeRequest("shift");
    }
    async getAll() {
      let e = await this._queueStore.getAll(),
        t = Date.now(),
        a = [];
      for (let s of e) {
        let e = 6e4 * this._maxRetentionTime;
        t - s.timestamp > e
          ? await this._queueStore.deleteEntry(s.id)
          : a.push(X(s));
      }
      return a;
    }
    async size() {
      return await this._queueStore.size();
    }
    async _addRequest(
      { request: e, metadata: t, timestamp: a = Date.now() },
      s,
    ) {
      let i = {
        requestData: (await Q.fromRequest(e.clone())).toObject(),
        timestamp: a,
      };
      switch ((t && (i.metadata = t), s)) {
        case "push":
          await this._queueStore.pushEntry(i);
          break;
        case "unshift":
          await this._queueStore.unshiftEntry(i);
      }
      this._syncInProgress
        ? (this._requestsAddedDuringSync = !0)
        : await this.registerSync();
    }
    async _removeRequest(e) {
      let t;
      let a = Date.now();
      switch (e) {
        case "pop":
          t = await this._queueStore.popEntry();
          break;
        case "shift":
          t = await this._queueStore.shiftEntry();
      }
      if (t) {
        let s = 6e4 * this._maxRetentionTime;
        return a - t.timestamp > s ? this._removeRequest(e) : X(t);
      }
    }
    async replayRequests() {
      let e;
      for (; (e = await this.shiftRequest()); )
        try {
          await fetch(e.request.clone());
        } catch (t) {
          throw (
            (await this.unshiftRequest(e),
            new d("queue-replay-failed", { name: this._name }))
          );
        }
    }
    async registerSync() {
      if ("sync" in self.registration && !this._forceSyncFallback)
        try {
          await self.registration.sync.register(`${z}:${this._name}`);
        } catch (e) {}
    }
    _addSyncListener() {
      "sync" in self.registration && !this._forceSyncFallback
        ? self.addEventListener("sync", (e) => {
            if (e.tag === `${z}:${this._name}`) {
              let t = async () => {
                let t;
                this._syncInProgress = !0;
                try {
                  await this._onSync({ queue: this });
                } catch (e) {
                  if (e instanceof Error) throw e;
                } finally {
                  this._requestsAddedDuringSync &&
                    !(t && !e.lastChance) &&
                    (await this.registerSync()),
                    (this._syncInProgress = !1),
                    (this._requestsAddedDuringSync = !1);
                }
              };
              e.waitUntil(t());
            }
          })
        : this._onSync({ queue: this });
    }
    static get _queueNames() {
      return J;
    }
  }
  class Z {
    _queue;
    constructor(e, t) {
      this._queue = new Y(e, t);
    }
    fetchDidFail = async ({ request: e }) => {
      await this._queue.pushRequest({ request: e });
    };
  }
  let ee = (e) => (e && "object" == typeof e ? e : { handle: e });
  class et {
    handler;
    match;
    method;
    catchHandler;
    constructor(e, t, a = "GET") {
      (this.handler = ee(t)), (this.match = e), (this.method = a);
    }
    setCatchHandler(e) {
      this.catchHandler = ee(e);
    }
  }
  class ea extends et {
    _allowlist;
    _denylist;
    constructor(e, { allowlist: t = [/./], denylist: a = [] } = {}) {
      super((e) => this._match(e), e),
        (this._allowlist = t),
        (this._denylist = a);
    }
    _match({ url: e, request: t }) {
      if (t && "navigate" !== t.mode) return !1;
      let a = e.pathname + e.search;
      for (let e of this._denylist) if (e.test(a)) return !1;
      return !!this._allowlist.some((e) => e.test(a));
    }
  }
  class es extends et {
    constructor(e, t, a) {
      super(
        ({ url: t }) => {
          let a = e.exec(t.href);
          if (a && (t.origin === location.origin || 0 === a.index))
            return a.slice(1);
        },
        t,
        a,
      );
    }
  }
  class ei {
    _routes;
    _defaultHandlerMap;
    _catchHandler;
    constructor() {
      (this._routes = new Map()), (this._defaultHandlerMap = new Map());
    }
    get routes() {
      return this._routes;
    }
    addFetchListener() {
      self.addEventListener("fetch", (e) => {
        let { request: t } = e,
          a = this.handleRequest({ request: t, event: e });
        a && e.respondWith(a);
      });
    }
    addCacheListener() {
      self.addEventListener("message", (e) => {
        if (e.data && "CACHE_URLS" === e.data.type) {
          let { payload: t } = e.data,
            a = Promise.all(
              t.urlsToCache.map((t) => {
                "string" == typeof t && (t = [t]);
                let a = new Request(...t);
                return this.handleRequest({ request: a, event: e });
              }),
            );
          e.waitUntil(a),
            e.ports?.[0] && a.then(() => e.ports[0].postMessage(!0));
        }
      });
    }
    handleRequest({ request: e, event: t }) {
      let a;
      let s = new URL(e.url, location.href);
      if (!s.protocol.startsWith("http")) return;
      let i = s.origin === location.origin,
        { params: n, route: r } = this.findMatchingRoute({
          event: t,
          request: e,
          sameOrigin: i,
          url: s,
        }),
        o = r?.handler,
        c = e.method;
      if (
        (!o &&
          this._defaultHandlerMap.has(c) &&
          (o = this._defaultHandlerMap.get(c)),
        !o)
      )
        return;
      try {
        a = o.handle({ url: s, request: e, event: t, params: n });
      } catch (e) {
        a = Promise.reject(e);
      }
      let l = r?.catchHandler;
      return (
        a instanceof Promise &&
          (this._catchHandler || l) &&
          (a = a.catch(async (a) => {
            if (l)
              try {
                return await l.handle({
                  url: s,
                  request: e,
                  event: t,
                  params: n,
                });
              } catch (e) {
                e instanceof Error && (a = e);
              }
            if (this._catchHandler)
              return this._catchHandler.handle({
                url: s,
                request: e,
                event: t,
              });
            throw a;
          })),
        a
      );
    }
    findMatchingRoute({ url: e, sameOrigin: t, request: a, event: s }) {
      for (let i of this._routes.get(a.method) || []) {
        let n;
        let r = i.match({ url: e, sameOrigin: t, request: a, event: s });
        if (r)
          return (
            Array.isArray((n = r)) && 0 === n.length
              ? (n = void 0)
              : r.constructor === Object && 0 === Object.keys(r).length
                ? (n = void 0)
                : "boolean" == typeof r && (n = void 0),
            { route: i, params: n }
          );
      }
      return {};
    }
    setDefaultHandler(e, t = "GET") {
      this._defaultHandlerMap.set(t, ee(e));
    }
    setCatchHandler(e) {
      this._catchHandler = ee(e);
    }
    registerRoute(e) {
      this._routes.has(e.method) || this._routes.set(e.method, []),
        this._routes.get(e.method).push(e);
    }
    unregisterRoute(e) {
      if (!this._routes.has(e.method))
        throw new d("unregister-route-but-not-found-with-method", {
          method: e.method,
        });
      let t = this._routes.get(e.method).indexOf(e);
      if (t > -1) this._routes.get(e.method).splice(t, 1);
      else throw new d("unregister-route-route-not-registered");
    }
  }
  let en = () => (
    n || ((n = new ei()).addFetchListener(), n.addCacheListener()), n
  );
  function er(e, t, a) {
    let s;
    if ("string" == typeof e) {
      let i = new URL(e, location.href);
      s = new et(({ url: e }) => e.href === i.href, t, a);
    } else if (e instanceof RegExp) s = new es(e, t, a);
    else if ("function" == typeof e) s = new et(e, t, a);
    else if (e instanceof et) s = e;
    else
      throw new d("unsupported-route-type", {
        moduleName: "@serwist/routing",
        funcName: "registerRoute",
        paramName: "capture",
      });
    return en().registerRoute(s), s;
  }
  function eo(e) {
    return "string" == typeof e ? new Request(e) : e;
  }
  class ec {
    request;
    url;
    event;
    params;
    _cacheKeys = {};
    _strategy;
    _extendLifetimePromises;
    _handlerDeferred;
    _plugins;
    _pluginStateMap;
    constructor(e, t) {
      for (let a of (Object.assign(this, t),
      (this.event = t.event),
      (this._strategy = e),
      (this._handlerDeferred = new m()),
      (this._extendLifetimePromises = []),
      (this._plugins = [...e.plugins]),
      (this._pluginStateMap = new Map()),
      this._plugins))
        this._pluginStateMap.set(a, {});
      this.event.waitUntil(this._handlerDeferred.promise);
    }
    async fetch(e) {
      let { event: t } = this,
        a = eo(e);
      if (
        "navigate" === a.mode &&
        t instanceof FetchEvent &&
        t.preloadResponse
      ) {
        let e = await t.preloadResponse;
        if (e) return e;
      }
      let s = this.hasCallback("fetchDidFail") ? a.clone() : null;
      try {
        for (let e of this.iterateCallbacks("requestWillFetch"))
          a = await e({ request: a.clone(), event: t });
      } catch (e) {
        if (e instanceof Error)
          throw new d("plugin-error-request-will-fetch", {
            thrownErrorMessage: e.message,
          });
      }
      let i = a.clone();
      try {
        let e;
        for (let s of ((e = await fetch(
          a,
          "navigate" === a.mode ? void 0 : this._strategy.fetchOptions,
        )),
        this.iterateCallbacks("fetchDidSucceed")))
          e = await s({ event: t, request: i, response: e });
        return e;
      } catch (e) {
        throw (
          (s &&
            (await this.runCallbacks("fetchDidFail", {
              error: e,
              event: t,
              originalRequest: s.clone(),
              request: i.clone(),
            })),
          e)
        );
      }
    }
    async fetchAndCachePut(e) {
      let t = await this.fetch(e),
        a = t.clone();
      return this.waitUntil(this.cachePut(e, a)), t;
    }
    async cacheMatch(e) {
      let t;
      let a = eo(e),
        { cacheName: s, matchOptions: i } = this._strategy,
        n = await this.getCacheKey(a, "read"),
        r = { ...i, cacheName: s };
      for (let e of ((t = await caches.match(n, r)),
      this.iterateCallbacks("cachedResponseWillBeUsed")))
        t =
          (await e({
            cacheName: s,
            matchOptions: i,
            cachedResponse: t,
            request: n,
            event: this.event,
          })) || void 0;
      return t;
    }
    async cachePut(e, t) {
      let a = eo(e);
      await v(0);
      let s = await this.getCacheKey(a, "write");
      if (!t) throw new d("cache-put-with-no-response", { url: b(s.url) });
      let i = await this._ensureResponseSafeToCache(t);
      if (!i) return !1;
      let { cacheName: n, matchOptions: r } = this._strategy,
        o = await self.caches.open(n),
        c = this.hasCallback("cacheDidUpdate"),
        l = c ? await w(o, s.clone(), ["__WB_REVISION__"], r) : null;
      try {
        await o.put(s, c ? i.clone() : i);
      } catch (e) {
        if (e instanceof Error)
          throw ("QuotaExceededError" === e.name && (await _()), e);
      }
      for (let e of this.iterateCallbacks("cacheDidUpdate"))
        await e({
          cacheName: n,
          oldResponse: l,
          newResponse: i.clone(),
          request: s,
          event: this.event,
        });
      return !0;
    }
    async getCacheKey(e, t) {
      let a = `${e.url} | ${t}`;
      if (!this._cacheKeys[a]) {
        let s = e;
        for (let e of this.iterateCallbacks("cacheKeyWillBeUsed"))
          s = eo(
            await e({
              mode: t,
              request: s,
              event: this.event,
              params: this.params,
            }),
          );
        this._cacheKeys[a] = s;
      }
      return this._cacheKeys[a];
    }
    hasCallback(e) {
      for (let t of this._strategy.plugins) if (e in t) return !0;
      return !1;
    }
    async runCallbacks(e, t) {
      for (let a of this.iterateCallbacks(e)) await a(t);
    }
    *iterateCallbacks(e) {
      for (let t of this._strategy.plugins)
        if ("function" == typeof t[e]) {
          let a = this._pluginStateMap.get(t),
            s = (s) => {
              let i = { ...s, state: a };
              return t[e](i);
            };
          yield s;
        }
    }
    waitUntil(e) {
      return this._extendLifetimePromises.push(e), e;
    }
    async doneWaiting() {
      let e;
      for (; (e = this._extendLifetimePromises.shift()); ) await e;
    }
    destroy() {
      this._handlerDeferred.resolve(null);
    }
    async _ensureResponseSafeToCache(e) {
      let t = e,
        a = !1;
      for (let e of this.iterateCallbacks("cacheWillUpdate"))
        if (
          ((t =
            (await e({
              request: this.request,
              response: t,
              event: this.event,
            })) || void 0),
          (a = !0),
          !t)
        )
          break;
      return !a && t && 200 !== t.status && (t = void 0), t;
    }
  }
  class el {
    cacheName;
    plugins;
    fetchOptions;
    matchOptions;
    constructor(e = {}) {
      (this.cacheName = h.getRuntimeName(e.cacheName)),
        (this.plugins = e.plugins || []),
        (this.fetchOptions = e.fetchOptions),
        (this.matchOptions = e.matchOptions);
    }
    handle(e) {
      let [t] = this.handleAll(e);
      return t;
    }
    handleAll(e) {
      e instanceof FetchEvent && (e = { event: e, request: e.request });
      let t = e.event,
        a = "string" == typeof e.request ? new Request(e.request) : e.request,
        s = new ec(this, {
          event: t,
          request: a,
          params: "params" in e ? e.params : void 0,
        }),
        i = this._getResponse(s, a, t),
        n = this._awaitComplete(i, s, a, t);
      return [i, n];
    }
    async _getResponse(e, t, a) {
      let s;
      await e.runCallbacks("handlerWillStart", { event: a, request: t });
      try {
        if (
          ((s = await this._handle(t, e)), void 0 === s || "error" === s.type)
        )
          throw new d("no-response", { url: t.url });
      } catch (i) {
        if (i instanceof Error) {
          for (let n of e.iterateCallbacks("handlerDidError"))
            if (void 0 !== (s = await n({ error: i, event: a, request: t })))
              break;
        }
        if (!s) throw i;
      }
      for (let i of e.iterateCallbacks("handlerWillRespond"))
        s = await i({ event: a, request: t, response: s });
      return s;
    }
    async _awaitComplete(e, t, a, s) {
      let i, n;
      try {
        i = await e;
      } catch (e) {}
      try {
        await t.runCallbacks("handlerDidRespond", {
          event: s,
          request: a,
          response: i,
        }),
          await t.doneWaiting();
      } catch (e) {
        e instanceof Error && (n = e);
      }
      if (
        (await t.runCallbacks("handlerDidComplete", {
          event: s,
          request: a,
          response: i,
          error: n,
        }),
        t.destroy(),
        n)
      )
        throw n;
    }
  }
  class eh extends el {
    async _handle(e, t) {
      let a,
        s = await t.cacheMatch(e);
      if (!s)
        try {
          s = await t.fetchAndCachePut(e);
        } catch (e) {
          e instanceof Error && (a = e);
        }
      if (!s) throw new d("no-response", { url: e.url, error: a });
      return s;
    }
  }
  class eu extends el {
    async _handle(e, t) {
      let a = await t.cacheMatch(e);
      if (!a) throw new d("no-response", { url: e.url });
      return a;
    }
  }
  let ed = {
    cacheWillUpdate: async ({ response: e }) =>
      200 === e.status || 0 === e.status ? e : null,
  };
  class ef extends el {
    _networkTimeoutSeconds;
    constructor(e = {}) {
      super(e),
        this.plugins.some((e) => "cacheWillUpdate" in e) ||
          this.plugins.unshift(ed),
        (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0);
    }
    async _handle(e, t) {
      let a;
      let s = [],
        i = [];
      if (this._networkTimeoutSeconds) {
        let { id: n, promise: r } = this._getTimeoutPromise({
          request: e,
          logs: s,
          handler: t,
        });
        (a = n), i.push(r);
      }
      let n = this._getNetworkPromise({
        timeoutId: a,
        request: e,
        logs: s,
        handler: t,
      });
      i.push(n);
      let r = await t.waitUntil(
        (async () => (await t.waitUntil(Promise.race(i))) || (await n))(),
      );
      if (!r) throw new d("no-response", { url: e.url });
      return r;
    }
    _getTimeoutPromise({ request: e, logs: t, handler: a }) {
      let s;
      return {
        promise: new Promise((t) => {
          s = setTimeout(async () => {
            t(await a.cacheMatch(e));
          }, 1e3 * this._networkTimeoutSeconds);
        }),
        id: s,
      };
    }
    async _getNetworkPromise({
      timeoutId: e,
      request: t,
      logs: a,
      handler: s,
    }) {
      let i, n;
      try {
        n = await s.fetchAndCachePut(t);
      } catch (e) {
        e instanceof Error && (i = e);
      }
      return e && clearTimeout(e), (i || !n) && (n = await s.cacheMatch(t)), n;
    }
  }
  class ep extends el {
    _networkTimeoutSeconds;
    constructor(e = {}) {
      super(e), (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0);
    }
    async _handle(e, t) {
      let a, s;
      try {
        let s = [t.fetch(e)];
        if (this._networkTimeoutSeconds) {
          let e = v(1e3 * this._networkTimeoutSeconds);
          s.push(e);
        }
        if (!(a = await Promise.race(s)))
          throw Error(
            `Timed out the network response after ${this._networkTimeoutSeconds} seconds.`,
          );
      } catch (e) {
        e instanceof Error && (s = e);
      }
      if (!a) throw new d("no-response", { url: e.url, error: s });
      return a;
    }
  }
  class em extends el {
    constructor(e = {}) {
      super(e),
        this.plugins.some((e) => "cacheWillUpdate" in e) ||
          this.plugins.unshift(ed);
    }
    async _handle(e, t) {
      let a;
      let s = t.fetchAndCachePut(e).catch(() => {});
      t.waitUntil(s);
      let i = await t.cacheMatch(e);
      if (i);
      else
        try {
          i = await s;
        } catch (e) {
          e instanceof Error && (a = e);
        }
      if (!i) throw new d("no-response", { url: e.url, error: a });
      return i;
    }
  }
  let eg = "www.google-analytics.com",
    ew = "www.googletagmanager.com",
    ey = /^\/(\w+\/)?collect/,
    e_ =
      (e) =>
      async ({ queue: t }) => {
        let a;
        for (; (a = await t.shiftRequest()); ) {
          let { request: s, timestamp: i } = a,
            n = new URL(s.url);
          try {
            let t =
                "POST" === s.method
                  ? new URLSearchParams(await s.clone().text())
                  : n.searchParams,
              a = i - (Number(t.get("qt")) || 0),
              r = Date.now() - a;
            if ((t.set("qt", String(r)), e.parameterOverrides))
              for (let a of Object.keys(e.parameterOverrides)) {
                let s = e.parameterOverrides[a];
                t.set(a, s);
              }
            "function" == typeof e.hitFilter && e.hitFilter.call(null, t),
              await fetch(
                new Request(n.origin + n.pathname, {
                  body: t.toString(),
                  method: "POST",
                  mode: "cors",
                  credentials: "omit",
                  headers: { "Content-Type": "text/plain" },
                }),
              );
          } catch (e) {
            throw (await t.unshiftRequest(a), e);
          }
        }
      },
    eb = (e) => {
      let t = ({ url: e }) => e.hostname === eg && ey.test(e.pathname),
        a = new ep({ plugins: [e] });
      return [new et(t, a, "GET"), new et(t, a, "POST")];
    },
    ev = (e) =>
      new et(
        ({ url: e }) => e.hostname === eg && "/analytics.js" === e.pathname,
        new ef({ cacheName: e }),
        "GET",
      ),
    ex = (e) =>
      new et(
        ({ url: e }) => e.hostname === ew && "/gtag/js" === e.pathname,
        new ef({ cacheName: e }),
        "GET",
      ),
    eR = (e) =>
      new et(
        ({ url: e }) => e.hostname === ew && "/gtm.js" === e.pathname,
        new ef({ cacheName: e }),
        "GET",
      ),
    eE = (e = {}) => {
      let t = h.getGoogleAnalyticsName(e.cacheName),
        a = new Z("serwist-google-analytics", {
          maxRetentionTime: 2880,
          onSync: e_(e),
        }),
        s = [eR(t), ev(t), ex(t), ...eb(a)],
        i = new ei();
      for (let e of s) i.registerRoute(e);
      i.addFetchListener();
    };
  class eS extends el {
    _fallbackToNetwork;
    static defaultPrecacheCacheabilityPlugin = {
      cacheWillUpdate: async ({ response: e }) =>
        !e || e.status >= 400 ? null : e,
    };
    static copyRedirectedCacheableResponsesPlugin = {
      cacheWillUpdate: async ({ response: e }) =>
        e.redirected ? await p(e) : e,
    };
    constructor(e = {}) {
      (e.cacheName = h.getPrecacheName(e.cacheName)),
        super(e),
        (this._fallbackToNetwork = !1 !== e.fallbackToNetwork),
        this.plugins.push(eS.copyRedirectedCacheableResponsesPlugin);
    }
    async _handle(e, t) {
      return (
        (await t.cacheMatch(e)) ||
        (t.event && "install" === t.event.type
          ? await this._handleInstall(e, t)
          : await this._handleFetch(e, t))
      );
    }
    async _handleFetch(e, t) {
      let a;
      let s = t.params || {};
      if (this._fallbackToNetwork) {
        let i = s.integrity,
          n = e.integrity,
          r = !n || n === i;
        (a = await t.fetch(
          new Request(e, { integrity: "no-cors" !== e.mode ? n || i : void 0 }),
        )),
          i &&
            r &&
            "no-cors" !== e.mode &&
            (this._useDefaultCacheabilityPluginIfNeeded(),
            await t.cachePut(e, a.clone()));
      } else
        throw new d("missing-precache-entry", {
          cacheName: this.cacheName,
          url: e.url,
        });
      return a;
    }
    async _handleInstall(e, t) {
      this._useDefaultCacheabilityPluginIfNeeded();
      let a = await t.fetch(e);
      if (!(await t.cachePut(e, a.clone())))
        throw new d("bad-precaching-response", {
          url: e.url,
          status: a.status,
        });
      return a;
    }
    _useDefaultCacheabilityPluginIfNeeded() {
      let e = null,
        t = 0;
      for (let [a, s] of this.plugins.entries())
        s !== eS.copyRedirectedCacheableResponsesPlugin &&
          (s === eS.defaultPrecacheCacheabilityPlugin && (e = a),
          s.cacheWillUpdate && t++);
      0 === t
        ? this.plugins.push(eS.defaultPrecacheCacheabilityPlugin)
        : t > 1 && null !== e && this.plugins.splice(e, 1);
    }
  }
  class eq {
    _precacheController;
    constructor({ precacheController: e }) {
      this._precacheController = e;
    }
    cacheKeyWillBeUsed = async ({ request: e, params: t }) => {
      let a = t?.cacheKey || this._precacheController.getCacheKeyForURL(e.url);
      return a ? new Request(a, { headers: e.headers }) : e;
    };
  }
  class eC {
    updatedURLs = [];
    notUpdatedURLs = [];
    handlerWillStart = async ({ request: e, state: t }) => {
      t && (t.originalRequest = e);
    };
    cachedResponseWillBeUsed = async ({
      event: e,
      state: t,
      cachedResponse: a,
    }) => {
      if (
        "install" === e.type &&
        t?.originalRequest &&
        t.originalRequest instanceof Request
      ) {
        let e = t.originalRequest.url;
        a ? this.notUpdatedURLs.push(e) : this.updatedURLs.push(e);
      }
      return a;
    };
  }
  class eD {
    _installAndActiveListenersAdded;
    _strategy;
    _urlsToCacheKeys = new Map();
    _urlsToCacheModes = new Map();
    _cacheKeysToIntegrities = new Map();
    constructor({
      cacheName: e,
      plugins: t = [],
      fallbackToNetwork: a = !0,
    } = {}) {
      (this._strategy = new eS({
        cacheName: h.getPrecacheName(e),
        plugins: [...t, new eq({ precacheController: this })],
        fallbackToNetwork: a,
      })),
        (this.install = this.install.bind(this)),
        (this.activate = this.activate.bind(this));
    }
    get strategy() {
      return this._strategy;
    }
    precache(e) {
      this.addToCacheList(e),
        this._installAndActiveListenersAdded ||
          (self.addEventListener("install", this.install),
          self.addEventListener("activate", this.activate),
          (this._installAndActiveListenersAdded = !0));
    }
    addToCacheList(e) {
      let t = [];
      for (let a of e) {
        "string" == typeof a
          ? t.push(a)
          : a && void 0 === a.revision && t.push(a.url);
        let { cacheKey: e, url: s } = (function (e) {
            if (!e)
              throw new d("add-to-cache-list-unexpected-type", { entry: e });
            if ("string" == typeof e) {
              let t = new URL(e, location.href);
              return { cacheKey: t.href, url: t.href };
            }
            let { revision: t, url: a } = e;
            if (!a)
              throw new d("add-to-cache-list-unexpected-type", { entry: e });
            if (!t) {
              let e = new URL(a, location.href);
              return { cacheKey: e.href, url: e.href };
            }
            let s = new URL(a, location.href),
              i = new URL(a, location.href);
            return (
              s.searchParams.set("__WB_REVISION__", t),
              { cacheKey: s.href, url: i.href }
            );
          })(a),
          i = "string" != typeof a && a.revision ? "reload" : "default";
        if (this._urlsToCacheKeys.has(s) && this._urlsToCacheKeys.get(s) !== e)
          throw new d("add-to-cache-list-conflicting-entries", {
            firstEntry: this._urlsToCacheKeys.get(s),
            secondEntry: e,
          });
        if ("string" != typeof a && a.integrity) {
          if (
            this._cacheKeysToIntegrities.has(e) &&
            this._cacheKeysToIntegrities.get(e) !== a.integrity
          )
            throw new d("add-to-cache-list-conflicting-integrities", {
              url: s,
            });
          this._cacheKeysToIntegrities.set(e, a.integrity);
        }
        this._urlsToCacheKeys.set(s, e),
          this._urlsToCacheModes.set(s, i),
          t.length > 0 &&
            console.warn(`Serwist is precaching URLs without revision info: ${t.join(
              ", ",
            )}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`);
      }
    }
    install(e) {
      return R(e, async () => {
        let t = new eC();
        for (let [a, s] of (this.strategy.plugins.push(t),
        this._urlsToCacheKeys)) {
          let t = this._cacheKeysToIntegrities.get(s),
            i = this._urlsToCacheModes.get(a),
            n = new Request(a, {
              integrity: t,
              cache: i,
              credentials: "same-origin",
            });
          await Promise.all(
            this.strategy.handleAll({
              params: { cacheKey: s },
              request: n,
              event: e,
            }),
          );
        }
        let { updatedURLs: a, notUpdatedURLs: s } = t;
        return { updatedURLs: a, notUpdatedURLs: s };
      });
    }
    activate(e) {
      return R(e, async () => {
        let e = await self.caches.open(this.strategy.cacheName),
          t = await e.keys(),
          a = new Set(this._urlsToCacheKeys.values()),
          s = [];
        for (let i of t) a.has(i.url) || (await e.delete(i), s.push(i.url));
        return { deletedURLs: s };
      });
    }
    getURLsToCacheKeys() {
      return this._urlsToCacheKeys;
    }
    getCachedURLs() {
      return [...this._urlsToCacheKeys.keys()];
    }
    getCacheKeyForURL(e) {
      let t = new URL(e, location.href);
      return this._urlsToCacheKeys.get(t.href);
    }
    getIntegrityForCacheKey(e) {
      return this._cacheKeysToIntegrities.get(e);
    }
    async matchPrecache(e) {
      let t = e instanceof Request ? e.url : e,
        a = this.getCacheKeyForURL(t);
      if (a) return (await self.caches.open(this.strategy.cacheName)).match(a);
    }
    createHandlerBoundToURL(e) {
      let t = this.getCacheKeyForURL(e);
      if (!t) throw new d("non-precached-url", { url: e });
      return (a) => (
        (a.request = new Request(e)),
        (a.params = { cacheKey: t, ...a.params }),
        this.strategy.handle(a)
      );
    }
  }
  let eN = () => (r || (r = new eD()), r);
  class ek {
    _fallbackURL;
    _precacheController;
    constructor({ fallbackURL: e, precacheController: t }) {
      (this._fallbackURL = e), (this._precacheController = t || eN());
    }
    handlerDidError = () =>
      this._precacheController.matchPrecache(this._fallbackURL);
  }
  class eP extends et {
    constructor(e, t) {
      super(({ request: a }) => {
        let s = e.getURLsToCacheKeys();
        for (let i of (function* (
          e,
          {
            ignoreURLParametersMatching: t = [/^utm_/, /^fbclid$/],
            directoryIndex: a = "index.html",
            cleanURLs: s = !0,
            urlManipulation: i,
          } = {},
        ) {
          let n = new URL(e, location.href);
          (n.hash = ""), yield n.href;
          let r = (function (e, t = []) {
            for (let a of [...e.searchParams.keys()])
              t.some((e) => e.test(a)) && e.searchParams.delete(a);
            return e;
          })(n, t);
          if ((yield r.href, a && r.pathname.endsWith("/"))) {
            let e = new URL(r.href);
            (e.pathname += a), yield e.href;
          }
          if (s) {
            let e = new URL(r.href);
            (e.pathname += ".html"), yield e.href;
          }
          if (i) for (let e of i({ url: n })) yield e.href;
        })(a.url, t)) {
          let t = s.get(i);
          if (t) {
            let a = e.getIntegrityForCacheKey(t);
            return { cacheKey: t, integrity: a };
          }
        }
      }, e.strategy);
    }
  }
  let eT = "-precache-",
    eA = async (e, t = eT) => {
      let a = (await self.caches.keys()).filter(
        (a) => a.includes(t) && a.includes(self.registration.scope) && a !== e,
      );
      return await Promise.all(a.map((e) => self.caches.delete(e))), a;
    };
  function eL(e, t) {
    eN().precache(e), er(new eP(eN(), t));
  }
  let eI = (e, t, a) =>
      !a.some((a) => e.headers.has(a) && t.headers.has(a)) ||
      a.every((a) => {
        let s = e.headers.has(a) === t.headers.has(a),
          i = e.headers.get(a) === t.headers.get(a);
        return s && i;
      }),
    eU = ["content-length", "etag", "last-modified"],
    eF =
      "undefined" != typeof navigator &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  function eW(e) {
    return { cacheName: e.cacheName, updatedURL: e.request.url };
  }
  class eM {
    _headersToCheck;
    _generatePayload;
    _notifyAllClients;
    constructor({
      generatePayload: e,
      headersToCheck: t,
      notifyAllClients: a,
    } = {}) {
      (this._headersToCheck = t || eU),
        (this._generatePayload = e || eW),
        (this._notifyAllClients = a ?? !0);
    }
    async notifyIfUpdated(e) {
      if (
        e.oldResponse &&
        !eI(e.oldResponse, e.newResponse, this._headersToCheck)
      ) {
        let t = {
          type: "CACHE_UPDATED",
          meta: "serwist-broadcast-update",
          payload: this._generatePayload(e),
        };
        if ("navigate" === e.request.mode) {
          let t;
          e.event instanceof FetchEvent && (t = e.event.resultingClientId),
            (!(await x(t)) || eF) && (await v(3500));
        }
        if (this._notifyAllClients)
          for (let e of await self.clients.matchAll({ type: "window" }))
            e.postMessage(t);
        else if (e.event instanceof FetchEvent) {
          let a = await self.clients.get(e.event.clientId);
          a?.postMessage(t);
        }
      }
    }
  }
  class eB {
    _broadcastUpdate;
    constructor(e) {
      this._broadcastUpdate = new eM(e);
    }
    cacheDidUpdate = async (e) => {
      y(this._broadcastUpdate.notifyIfUpdated(e));
    };
  }
  class eO {
    _statuses;
    _headers;
    constructor(e = {}) {
      (this._statuses = e.statuses), (this._headers = e.headers);
    }
    isResponseCacheable(e) {
      let t = !0;
      return (
        this._statuses && (t = this._statuses.includes(e.status)),
        this._headers &&
          t &&
          (t = Object.keys(this._headers).some(
            (t) => e.headers.get(t) === this._headers[t],
          )),
        t
      );
    }
  }
  class eK {
    _cacheableResponse;
    constructor(e) {
      this._cacheableResponse = new eO(e);
    }
    cacheWillUpdate = async ({ response: e }) =>
      this._cacheableResponse.isResponseCacheable(e) ? e : null;
  }
  let ej = "cache-entries",
    e$ = (e) => {
      let t = new URL(e, location.href);
      return (t.hash = ""), t.href;
    };
  class eH {
    _cacheName;
    _db = null;
    constructor(e) {
      this._cacheName = e;
    }
    _upgradeDb(e) {
      let t = e.createObjectStore(ej, { keyPath: "id" });
      t.createIndex("cacheName", "cacheName", { unique: !1 }),
        t.createIndex("timestamp", "timestamp", { unique: !1 });
    }
    _upgradeDbAndDeleteOldDbs(e) {
      this._upgradeDb(e),
        this._cacheName &&
          (function (e, { blocked: t } = {}) {
            let a = indexedDB.deleteDatabase(e);
            t && a.addEventListener("blocked", (e) => t(e.oldVersion, e)),
              N(a).then(() => void 0);
          })(this._cacheName);
    }
    async setTimestamp(e, t) {
      let a = {
          url: (e = e$(e)),
          timestamp: t,
          cacheName: this._cacheName,
          id: this._getId(e),
        },
        s = (await this.getDb()).transaction(ej, "readwrite", {
          durability: "relaxed",
        });
      await s.store.put(a), await s.done;
    }
    async getTimestamp(e) {
      let t = await this.getDb(),
        a = await t.get(ej, this._getId(e));
      return a?.timestamp;
    }
    async expireEntries(e, t) {
      let a = await this.getDb(),
        s = await a
          .transaction(ej)
          .store.index("timestamp")
          .openCursor(null, "prev"),
        i = [],
        n = 0;
      for (; s; ) {
        let a = s.value;
        a.cacheName === this._cacheName &&
          ((e && a.timestamp < e) || (t && n >= t) ? i.push(s.value) : n++),
          (s = await s.continue());
      }
      let r = [];
      for (let e of i) await a.delete(ej, e.id), r.push(e.url);
      return r;
    }
    _getId(e) {
      return `${this._cacheName}|${e$(e)}`;
    }
    async getDb() {
      return (
        this._db ||
          (this._db = await P("serwist-expiration", 1, {
            upgrade: this._upgradeDbAndDeleteOldDbs.bind(this),
          })),
        this._db
      );
    }
  }
  class eG {
    _isRunning = !1;
    _rerunRequested = !1;
    _maxEntries;
    _maxAgeSeconds;
    _matchOptions;
    _cacheName;
    _timestampModel;
    constructor(e, t = {}) {
      (this._maxEntries = t.maxEntries),
        (this._maxAgeSeconds = t.maxAgeSeconds),
        (this._matchOptions = t.matchOptions),
        (this._cacheName = e),
        (this._timestampModel = new eH(e));
    }
    async expireEntries() {
      if (this._isRunning) {
        this._rerunRequested = !0;
        return;
      }
      this._isRunning = !0;
      let e = this._maxAgeSeconds ? Date.now() - 1e3 * this._maxAgeSeconds : 0,
        t = await this._timestampModel.expireEntries(e, this._maxEntries),
        a = await self.caches.open(this._cacheName);
      for (let e of t) await a.delete(e, this._matchOptions);
      (this._isRunning = !1),
        this._rerunRequested &&
          ((this._rerunRequested = !1), y(this.expireEntries()));
    }
    async updateTimestamp(e) {
      await this._timestampModel.setTimestamp(e, Date.now());
    }
    async isURLExpired(e) {
      if (!this._maxAgeSeconds) return !1;
      let t = await this._timestampModel.getTimestamp(e),
        a = Date.now() - 1e3 * this._maxAgeSeconds;
      return void 0 === t || t < a;
    }
    async delete() {
      (this._rerunRequested = !1),
        await this._timestampModel.expireEntries(1 / 0);
    }
  }
  class eV {
    _config;
    _maxAgeSeconds;
    _cacheExpirations;
    constructor(e = {}) {
      (this._config = e),
        (this._maxAgeSeconds = e.maxAgeSeconds),
        (this._cacheExpirations = new Map()),
        e.purgeOnQuotaError && f.add(() => this.deleteCacheAndMetadata());
    }
    _getCacheExpiration(e) {
      if (e === h.getRuntimeName()) throw new d("expire-custom-caches-only");
      let t = this._cacheExpirations.get(e);
      return (
        t || ((t = new eG(e, this._config)), this._cacheExpirations.set(e, t)),
        t
      );
    }
    cachedResponseWillBeUsed = async ({
      event: e,
      request: t,
      cacheName: a,
      cachedResponse: s,
    }) => {
      if (!s) return null;
      let i = this._isResponseDateFresh(s),
        n = this._getCacheExpiration(a);
      y(n.expireEntries());
      let r = n.updateTimestamp(t.url);
      if (e)
        try {
          e.waitUntil(r);
        } catch (e) {}
      return i ? s : null;
    };
    _isResponseDateFresh(e) {
      if (!this._maxAgeSeconds) return !0;
      let t = this._getDateHeaderTimestamp(e);
      return null === t || t >= Date.now() - 1e3 * this._maxAgeSeconds;
    }
    _getDateHeaderTimestamp(e) {
      if (!e.headers.has("date")) return null;
      let t = new Date(e.headers.get("date")).getTime();
      return Number.isNaN(t) ? null : t;
    }
    cacheDidUpdate = async ({ cacheName: e, request: t }) => {
      let a = this._getCacheExpiration(e);
      await a.updateTimestamp(t.url), await a.expireEntries();
    };
    async deleteCacheAndMetadata() {
      for (let [e, t] of this._cacheExpirations)
        await self.caches.delete(e), await t.delete();
      this._cacheExpirations = new Map();
    }
  }
  async function eQ(e, t) {
    try {
      if (206 === t.status) return t;
      let a = e.headers.get("range");
      if (!a) throw new d("no-range-header");
      let s = (function (e) {
          let t = e.trim().toLowerCase();
          if (!t.startsWith("bytes="))
            throw new d("unit-must-be-bytes", { normalizedRangeHeader: t });
          if (t.includes(","))
            throw new d("single-range-only", { normalizedRangeHeader: t });
          let a = /(\d*)-(\d*)/.exec(t);
          if (!a || !(a[1] || a[2]))
            throw new d("invalid-range-values", { normalizedRangeHeader: t });
          return {
            start: "" === a[1] ? void 0 : Number(a[1]),
            end: "" === a[2] ? void 0 : Number(a[2]),
          };
        })(a),
        i = await t.blob(),
        n = (function (e, t, a) {
          let s, i;
          let n = e.size;
          if ((a && a > n) || (t && t < 0))
            throw new d("range-not-satisfiable", { size: n, end: a, start: t });
          return (
            void 0 !== t && void 0 !== a
              ? ((s = t), (i = a + 1))
              : void 0 !== t && void 0 === a
                ? ((s = t), (i = n))
                : void 0 !== a && void 0 === t && ((s = n - a), (i = n)),
            { start: s, end: i }
          );
        })(i, s.start, s.end),
        r = i.slice(n.start, n.end),
        o = r.size,
        c = new Response(r, {
          status: 206,
          statusText: "Partial Content",
          headers: t.headers,
        });
      return (
        c.headers.set("Content-Length", String(o)),
        c.headers.set(
          "Content-Range",
          `bytes ${n.start}-${n.end - 1}/${i.size}`,
        ),
        c
      );
    } catch (e) {
      return new Response("", {
        status: 416,
        statusText: "Range Not Satisfiable",
      });
    }
  }
  class ez {
    cachedResponseWillBeUsed = async ({ request: e, cachedResponse: t }) =>
      t && e.headers.has("range") ? await eQ(e, t) : t;
  }
  let eJ = () => {
      self.__WB_DISABLE_DEV_LOGS = !0;
    },
    eX = ({ runtimeCaching: e, entries: t, precacheOptions: a }) => (
      eL(
        t.map(({ url: e, revision: t }) => ({
          url: "string" == typeof e ? e : e.toString(),
          revision: t,
        })),
        a,
      ),
      (e = e.map(
        (e) => (
          !e.options ||
            e.options.precacheFallback ||
            e.options.plugins?.some((e) => "handlerDidError" in e) ||
            (e.options.plugins || (e.options.plugins = []),
            e.options.plugins.push({
              async handlerDidError(e) {
                for (let {
                  matcher: a,
                  url: s,
                  cacheMatchOptions: i = { ignoreSearch: !0 },
                } of t)
                  if (a(e)) return caches.match(s, i);
                return Response.error();
              },
            })),
          e
        ),
      ))
    ),
    eY = ({
      precacheEntries: e,
      precacheOptions: t,
      cleanupOutdatedCaches: a = !1,
      ...s
    }) => {
      if (
        (e && e.length > 0 && eL(e, t),
        a &&
          self.addEventListener("activate", (e) => {
            let t = h.getPrecacheName();
            e.waitUntil(eA(t).then((e) => {}));
          }),
        s.navigateFallback)
      ) {
        var i;
        er(
          new ea(((i = s.navigateFallback), eN().createHandlerBoundToURL(i)), {
            allowlist: s.navigateFallbackAllowlist,
            denylist: s.navigateFallbackDenylist,
          }),
        );
      }
    },
    eZ = (e) => null != e,
    e0 = {
      CacheFirst: eh,
      CacheOnly: eu,
      NetworkFirst: ef,
      NetworkOnly: ep,
      StaleWhileRevalidate: em,
    },
    e1 = (...e) => {
      for (let t of e)
        if ("string" == typeof t.handler) {
          let {
              cacheName: e,
              networkTimeoutSeconds: a,
              fetchOptions: s,
              matchOptions: i,
              plugins: n,
              backgroundSync: r,
              broadcastUpdate: o,
              cacheableResponse: c,
              expiration: l,
              precacheFallback: h,
              rangeRequests: u,
            } = t.options,
            d = e0[t.handler];
          er(
            t.urlPattern,
            new d({
              cacheName: e ?? void 0,
              networkTimeoutSeconds: a,
              fetchOptions: s,
              matchOptions: i,
              plugins: [
                ...(n ?? []),
                r && new Z(r.name, r.options),
                o && new eB({ channelName: o.channelName, ...o.options }),
                c && new eK(c),
                l && new eV(l),
                h && new ek(h),
                u ? new ez() : void 0,
              ].filter(eZ),
            }),
            t.method,
          );
        } else er(t.urlPattern, t.handler, t.method);
    };
  (({
    precacheEntries: e,
    precacheOptions: t,
    cleanupOutdatedCaches: a,
    skipWaiting: s = !1,
    importScripts: i,
    navigationPreload: n = !1,
    cacheId: r,
    clientsClaim: o = !1,
    runtimeCaching: c,
    offlineAnalyticsConfig: l,
    disableDevLogs: u,
    fallbacks: d,
    ...f
  }) => {
    var p;
    i && i.length > 0 && self.importScripts(...i),
      n &&
        self.registration?.navigationPreload &&
        self.addEventListener("activate", (e) => {
          e.waitUntil(
            self.registration.navigationPreload.enable().then(() => {
              p && self.registration.navigationPreload.setHeaderValue(p);
            }),
          );
        }),
      void 0 !== r && h.updateDetails({ prefix: r }),
      s
        ? self.skipWaiting()
        : self.addEventListener("message", (e) => {
            e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
          }),
      o && self.addEventListener("activate", () => self.clients.claim()),
      eY({
        precacheEntries: e,
        precacheOptions: t,
        cleanupOutdatedCaches: a,
        ...(f.navigateFallback && {
          navigateFallback: f.navigateFallback,
          navigateFallbackAllowlist: f.navigateFallbackAllowlist,
          navigateFallbackDenylist: f.navigateFallbackDenylist,
        }),
      }),
      void 0 !== c &&
        (void 0 !== d && (c = eX({ ...d, runtimeCaching: c })), e1(...c)),
      void 0 !== l && ("boolean" == typeof l ? l && eE() : eE(l)),
      u && eJ();
  })({
    precacheEntries: [
      {
        revision: "ac2deff82460bc44e5732097339971b6",
        url: "/_next/static/2gJ6yEEq0LE4iuEKNK2_q/_buildManifest.js",
      },
      {
        revision: "b6652df95db52feb4daf4eca35380933",
        url: "/_next/static/2gJ6yEEq0LE4iuEKNK2_q/_ssgManifest.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/107-ad3459efc5ff5a87.js",
      },
      {
        revision: "7b1f8cbd1877673a",
        url: "/_next/static/chunks/161.7b1f8cbd1877673a.js",
      },
      {
        revision: "97abc1933dd0d323",
        url: "/_next/static/chunks/216dcd33.97abc1933dd0d323.js",
      },
      {
        revision: "68a408cc8d726abd",
        url: "/_next/static/chunks/227.68a408cc8d726abd.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/261-0122a897635acbb2.js",
      },
      {
        revision: "e5ce25a65f7b22b9",
        url: "/_next/static/chunks/318.e5ce25a65f7b22b9.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/350-d0e49336e442da71.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/367-927675b44257fd09.js",
      },
      {
        revision: "dcd4c0003f6c2836",
        url: "/_next/static/chunks/376.dcd4c0003f6c2836.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/397-7cd5f7f1546ad684.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/458-2bbe5b26db537df4.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/4e3ef0b5-53dda710a2dee2de.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/501-24fde31ab6d89c0a.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/657-5acc038c53f83af2.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/835-1f998f442e5793ce.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/873-2eba38d0486f6e3f.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/883-8d515e6a506a64ce.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/app/_not-found-3a36ab9b8438d9b1.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/app/app/cart/%5Bid%5D/page-5a44b5f836b477b3.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/app/app/config/page-60e9ed26d8509952.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/app/app/debug/page-48027e5df0b655a8.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/app/app/friends/page-88109738c54dc501.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/app/app/layout-3edc5c87b93aeb65.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/app/app/page-0422fe313c888db4.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/app/layout-2d060caf65b1035d.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/app/page-0122cd539ee1ec69.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/framework-c25027af42eb8c45.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/main-00bb58f6034431db.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/main-app-536795bcedfa6d72.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/pages/_app-164c12a73d4dae1b.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/pages/_error-6bbf1640aaa46847.js",
      },
      {
        revision: "837c0df77fd5009c9e46d446188ecfd0",
        url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
      },
      {
        revision: "2gJ6yEEq0LE4iuEKNK2_q",
        url: "/_next/static/chunks/webpack-39f09af3a34f3958.js",
      },
      {
        revision: "b62edf576d61551e",
        url: "/_next/static/css/b62edf576d61551e.css",
      },
      {
        revision: "851d715b74a26b3df67842ad65c61672",
        url: "/img/landing/phone-frame.svg",
      },
      { revision: "1b2274bfd245a0512dc29d534a09dcca", url: "/manifest.json" },
      { revision: "71782f0a19e1ac2b7126fa129afe790b", url: "/sw.js" },
      { revision: "8e3a10e157f75ada21ab742c022d5430", url: "/vite.svg" },
    ],
    skipWaiting: !0,
    clientsClaim: !0,
    navigationPreload: !0,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-webfonts",
          expiration: { maxEntries: 4, maxAgeSeconds: 31536e3 },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "google-fonts-stylesheets",
          expiration: { maxEntries: 4, maxAgeSeconds: 604800 },
        },
      },
      {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-font-assets",
          expiration: { maxEntries: 4, maxAgeSeconds: 604800 },
        },
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-image-assets",
          expiration: { maxEntries: 64, maxAgeSeconds: 2592e3 },
        },
      },
      {
        urlPattern: /\/_next\/static.+\.js$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static-js-assets",
          expiration: { maxEntries: 64, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\/_next\/image\?url=.+$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "next-image",
          expiration: { maxEntries: 64, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\.(?:mp3|wav|ogg)$/i,
        handler: "CacheFirst",
        options: {
          rangeRequests: !0,
          cacheName: "static-audio-assets",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\.(?:mp4|webm)$/i,
        handler: "CacheFirst",
        options: {
          rangeRequests: !0,
          cacheName: "static-video-assets",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\.(?:js)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-js-assets",
          expiration: { maxEntries: 48, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\.(?:css|less)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-style-assets",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "next-data",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\.(?:json|xml|csv)$/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "static-data-assets",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: ({ sameOrigin: e, url: { pathname: t } }) =>
          !(!e || t.startsWith("/api/auth/callback")) &&
          !!t.startsWith("/api/"),
        handler: "NetworkFirst",
        method: "GET",
        options: {
          cacheName: "apis",
          expiration: { maxEntries: 16, maxAgeSeconds: 86400 },
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: ({ request: e, url: { pathname: t }, sameOrigin: a }) =>
          "1" === e.headers.get("RSC") &&
          "1" === e.headers.get("Next-Router-Prefetch") &&
          a &&
          !t.startsWith("/api/"),
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-rsc-prefetch",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: ({ request: e, url: { pathname: t }, sameOrigin: a }) =>
          "1" === e.headers.get("RSC") && a && !t.startsWith("/api/"),
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-rsc",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: ({ url: { pathname: e }, sameOrigin: t }) =>
          t && !e.startsWith("/api/"),
        handler: "NetworkFirst",
        options: {
          cacheName: "pages",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: ({ sameOrigin: e }) => !e,
        handler: "NetworkFirst",
        options: {
          cacheName: "cross-origin",
          expiration: { maxEntries: 32, maxAgeSeconds: 3600 },
          networkTimeoutSeconds: 10,
        },
      },
    ],
  });
})();
