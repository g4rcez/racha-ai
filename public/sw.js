!(function () {
  var e = {
      779: function (e, t, a) {
        "use strict";
        var s, n;
        e.exports =
          (null == (s = a.g.process) ? void 0 : s.env) &&
          "object" == typeof (null == (n = a.g.process) ? void 0 : n.env)
            ? a.g.process
            : a(194);
      },
      194: function (e) {
        !(function () {
          var t = {
              229: function (e) {
                var t,
                  a,
                  s,
                  n = (e.exports = {});
                function r() {
                  throw Error("setTimeout has not been defined");
                }
                function i() {
                  throw Error("clearTimeout has not been defined");
                }
                function o(e) {
                  if (t === setTimeout) return setTimeout(e, 0);
                  if ((t === r || !t) && setTimeout)
                    return (t = setTimeout), setTimeout(e, 0);
                  try {
                    return t(e, 0);
                  } catch (a) {
                    try {
                      return t.call(null, e, 0);
                    } catch (a) {
                      return t.call(this, e, 0);
                    }
                  }
                }
                !(function () {
                  try {
                    t = "function" == typeof setTimeout ? setTimeout : r;
                  } catch (e) {
                    t = r;
                  }
                  try {
                    a = "function" == typeof clearTimeout ? clearTimeout : i;
                  } catch (e) {
                    a = i;
                  }
                })();
                var c = [],
                  l = !1,
                  h = -1;
                function u() {
                  l &&
                    s &&
                    ((l = !1),
                    s.length ? (c = s.concat(c)) : (h = -1),
                    c.length && d());
                }
                function d() {
                  if (!l) {
                    var e = o(u);
                    l = !0;
                    for (var t = c.length; t; ) {
                      for (s = c, c = []; ++h < t; ) s && s[h].run();
                      (h = -1), (t = c.length);
                    }
                    (s = null),
                      (l = !1),
                      (function (e) {
                        if (a === clearTimeout) return clearTimeout(e);
                        if ((a === i || !a) && clearTimeout)
                          return (a = clearTimeout), clearTimeout(e);
                        try {
                          a(e);
                        } catch (t) {
                          try {
                            return a.call(null, e);
                          } catch (t) {
                            return a.call(this, e);
                          }
                        }
                      })(e);
                  }
                }
                function f(e, t) {
                  (this.fun = e), (this.array = t);
                }
                function p() {}
                (n.nextTick = function (e) {
                  var t = Array(arguments.length - 1);
                  if (arguments.length > 1)
                    for (var a = 1; a < arguments.length; a++)
                      t[a - 1] = arguments[a];
                  c.push(new f(e, t)), 1 !== c.length || l || o(d);
                }),
                  (f.prototype.run = function () {
                    this.fun.apply(null, this.array);
                  }),
                  (n.title = "browser"),
                  (n.browser = !0),
                  (n.env = {}),
                  (n.argv = []),
                  (n.version = ""),
                  (n.versions = {}),
                  (n.on = p),
                  (n.addListener = p),
                  (n.once = p),
                  (n.off = p),
                  (n.removeListener = p),
                  (n.removeAllListeners = p),
                  (n.emit = p),
                  (n.prependListener = p),
                  (n.prependOnceListener = p),
                  (n.listeners = function (e) {
                    return [];
                  }),
                  (n.binding = function (e) {
                    throw Error("process.binding is not supported");
                  }),
                  (n.cwd = function () {
                    return "/";
                  }),
                  (n.chdir = function (e) {
                    throw Error("process.chdir is not supported");
                  }),
                  (n.umask = function () {
                    return 0;
                  });
              },
            },
            a = {};
          function s(e) {
            var n = a[e];
            if (void 0 !== n) return n.exports;
            var r = (a[e] = { exports: {} }),
              i = !0;
            try {
              t[e](r, r.exports, s), (i = !1);
            } finally {
              i && delete a[e];
            }
            return r.exports;
          }
          s.ab = "//";
          var n = s(229);
          e.exports = n;
        })();
      },
    },
    t = {};
  function a(s) {
    var n = t[s];
    if (void 0 !== n) return n.exports;
    var r = (t[s] = { exports: {} }),
      i = !0;
    try {
      e[s](r, r.exports, a), (i = !1);
    } finally {
      i && delete t[s];
    }
    return r.exports;
  }
  (a.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  })()),
    (function () {
      "use strict";
      let e, t, s, n, r;
      let i = {
          googleAnalytics: "googleAnalytics",
          precache: "precache-v2",
          prefix: "serwist",
          runtime: "runtime",
          suffix: "undefined" != typeof registration ? registration.scope : "",
        },
        o = (e) =>
          [i.prefix, e, i.suffix].filter((e) => e && e.length > 0).join("-"),
        c = (e) => {
          for (let t of Object.keys(i)) e(t);
        },
        l = {
          updateDetails: (e) => {
            c((t) => {
              let a = e[t];
              "string" == typeof a && (i[t] = a);
            });
          },
          getGoogleAnalyticsName: (e) => e || o(i.googleAnalytics),
          getPrecacheName: (e) => e || o(i.precache),
          getPrefix: () => i.prefix,
          getRuntimeName: (e) => e || o(i.runtime),
          getSuffix: () => i.suffix,
        },
        h = (e, ...t) => {
          let a = e;
          return t.length > 0 && (a += ` :: ${JSON.stringify(t)}`), a;
        };
      class u extends Error {
        details;
        constructor(e, t) {
          super(h(e, t)), (this.name = e), (this.details = t);
        }
      }
      let d = new Set();
      async function f(t, a) {
        let s = null;
        if ((t.url && (s = new URL(t.url).origin), s !== self.location.origin))
          throw new u("cross-origin-copy-response", { origin: s });
        let n = t.clone(),
          r = {
            headers: new Headers(n.headers),
            status: n.status,
            statusText: n.statusText,
          },
          i = a ? a(r) : r,
          o = !(function () {
            if (void 0 === e) {
              let t = new Response("");
              if ("body" in t)
                try {
                  new Response(t.body), (e = !0);
                } catch (t) {
                  e = !1;
                }
              e = !1;
            }
            return e;
          })()
            ? await n.blob()
            : n.body;
        return new Response(o, i);
      }
      class p {
        promise;
        resolve;
        reject;
        constructor() {
          this.promise = new Promise((e, t) => {
            (this.resolve = e), (this.reject = t);
          });
        }
      }
      function m(e, t) {
        let a = new URL(e);
        for (let e of t) a.searchParams.delete(e);
        return a.href;
      }
      async function g(e, t, a, s) {
        let n = m(t.url, a);
        if (t.url === n) return e.match(t, s);
        let r = { ...s, ignoreSearch: !0 };
        for (let i of await e.keys(t, r))
          if (n === m(i.url, a)) return e.match(i, s);
      }
      function w(e) {
        e.then(() => {});
      }
      async function y() {
        for (let e of d) await e();
      }
      let _ = (e) =>
        new URL(String(e), location.href).href.replace(
          RegExp(`^${location.origin}`),
          "",
        );
      function v(e) {
        return new Promise((t) => setTimeout(t, e));
      }
      async function b(e) {
        let t;
        if (!e) return;
        let a = await self.clients.matchAll({ type: "window" }),
          s = new Set(a.map((e) => e.id)),
          n = performance.now();
        for (
          ;
          performance.now() - n < 2e3 &&
          !(t = (a = await self.clients.matchAll({ type: "window" })).find(
            (t) => (e ? t.id === e : !s.has(t.id)),
          ));

        )
          await v(100);
        return t;
      }
      function x(e, t) {
        let a = t();
        return e.waitUntil(a), a;
      }
      let R = (e, t) => t.some((t) => e instanceof t),
        E = new WeakMap(),
        S = new WeakMap(),
        q = new WeakMap(),
        C = {
          get(e, t, a) {
            if (e instanceof IDBTransaction) {
              if ("done" === t) return E.get(e);
              if ("store" === t)
                return a.objectStoreNames[1]
                  ? void 0
                  : a.objectStore(a.objectStoreNames[0]);
            }
            return D(e[t]);
          },
          set: (e, t, a) => ((e[t] = a), !0),
          has: (e, t) =>
            (e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
            t in e,
        };
      function D(e) {
        var a;
        if (e instanceof IDBRequest)
          return (function (e) {
            let t = new Promise((t, a) => {
              let s = () => {
                  e.removeEventListener("success", n),
                    e.removeEventListener("error", r);
                },
                n = () => {
                  t(D(e.result)), s();
                },
                r = () => {
                  a(e.error), s();
                };
              e.addEventListener("success", n), e.addEventListener("error", r);
            });
            return q.set(t, e), t;
          })(e);
        if (S.has(e)) return S.get(e);
        let n =
          "function" == typeof (a = e)
            ? (
                s ||
                (s = [
                  IDBCursor.prototype.advance,
                  IDBCursor.prototype.continue,
                  IDBCursor.prototype.continuePrimaryKey,
                ])
              ).includes(a)
              ? function (...e) {
                  return a.apply(N(this), e), D(this.request);
                }
              : function (...e) {
                  return D(a.apply(N(this), e));
                }
            : (a instanceof IDBTransaction &&
                  (function (e) {
                    if (E.has(e)) return;
                    let t = new Promise((t, a) => {
                      let s = () => {
                          e.removeEventListener("complete", n),
                            e.removeEventListener("error", r),
                            e.removeEventListener("abort", r);
                        },
                        n = () => {
                          t(), s();
                        },
                        r = () => {
                          a(
                            e.error ||
                              new DOMException("AbortError", "AbortError"),
                          ),
                            s();
                        };
                      e.addEventListener("complete", n),
                        e.addEventListener("error", r),
                        e.addEventListener("abort", r);
                    });
                    E.set(e, t);
                  })(a),
                R(
                  a,
                  t ||
                    (t = [
                      IDBDatabase,
                      IDBObjectStore,
                      IDBIndex,
                      IDBCursor,
                      IDBTransaction,
                    ]),
                ))
              ? new Proxy(a, C)
              : a;
        return n !== e && (S.set(e, n), q.set(n, e)), n;
      }
      let N = (e) => q.get(e);
      function T(
        e,
        t,
        { blocked: a, upgrade: s, blocking: n, terminated: r } = {},
      ) {
        let i = indexedDB.open(e, t),
          o = D(i);
        return (
          s &&
            i.addEventListener("upgradeneeded", (e) => {
              s(D(i.result), e.oldVersion, e.newVersion, D(i.transaction), e);
            }),
          a &&
            i.addEventListener("blocked", (e) =>
              a(e.oldVersion, e.newVersion, e),
            ),
          o
            .then((e) => {
              r && e.addEventListener("close", () => r()),
                n &&
                  e.addEventListener("versionchange", (e) =>
                    n(e.oldVersion, e.newVersion, e),
                  );
            })
            .catch(() => {}),
          o
        );
      }
      let k = ["get", "getKey", "getAll", "getAllKeys", "count"],
        P = ["put", "add", "delete", "clear"],
        L = new Map();
      function A(e, t) {
        if (!(e instanceof IDBDatabase && !(t in e) && "string" == typeof t))
          return;
        if (L.get(t)) return L.get(t);
        let a = t.replace(/FromIndex$/, ""),
          s = t !== a,
          n = P.includes(a);
        if (
          !(a in (s ? IDBIndex : IDBObjectStore).prototype) ||
          !(n || k.includes(a))
        )
          return;
        let r = async function (e, ...t) {
          let r = this.transaction(e, n ? "readwrite" : "readonly"),
            i = r.store;
          return (
            s && (i = i.index(t.shift())),
            (await Promise.all([i[a](...t), n && r.done]))[0]
          );
        };
        return L.set(t, r), r;
      }
      C = {
        ...(e1 = C),
        get: (e, t, a) => A(e, t) || e1.get(e, t, a),
        has: (e, t) => !!A(e, t) || e1.has(e, t),
      };
      let I = ["continue", "continuePrimaryKey", "advance"],
        U = {},
        F = new WeakMap(),
        W = new WeakMap(),
        M = {
          get(e, t) {
            if (!I.includes(t)) return e[t];
            let a = U[t];
            return (
              a ||
                (a = U[t] =
                  function (...e) {
                    F.set(this, W.get(this)[t](...e));
                  }),
              a
            );
          },
        };
      async function* O(...e) {
        let t = this;
        if ((t instanceof IDBCursor || (t = await t.openCursor(...e)), !t))
          return;
        let a = new Proxy(t, M);
        for (W.set(a, t), q.set(a, N(t)); t; )
          yield a, (t = await (F.get(a) || t.continue())), F.delete(a);
      }
      function B(e, t) {
        return (
          (t === Symbol.asyncIterator &&
            R(e, [IDBIndex, IDBObjectStore, IDBCursor])) ||
          ("iterate" === t && R(e, [IDBIndex, IDBObjectStore]))
        );
      }
      C = {
        ...(e4 = C),
        get: (e, t, a) => (B(e, t) ? O : e4.get(e, t, a)),
        has: (e, t) => B(e, t) || e4.has(e, t),
      };
      let K = "requests",
        j = "queueName";
      class $ {
        _db = null;
        async addEntry(e) {
          let t = (await this.getDb()).transaction(K, "readwrite", {
            durability: "relaxed",
          });
          await t.store.add(e), await t.done;
        }
        async getFirstEntryId() {
          let e = await this.getDb(),
            t = await e.transaction(K).store.openCursor();
          return t?.value.id;
        }
        async getAllEntriesByQueueName(e) {
          let t = await this.getDb();
          return (await t.getAllFromIndex(K, j, IDBKeyRange.only(e))) || [];
        }
        async getEntryCountByQueueName(e) {
          return (await this.getDb()).countFromIndex(K, j, IDBKeyRange.only(e));
        }
        async deleteEntry(e) {
          let t = await this.getDb();
          await t.delete(K, e);
        }
        async getFirstEntryByQueueName(e) {
          return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "next");
        }
        async getLastEntryByQueueName(e) {
          return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "prev");
        }
        async getEndEntryFromIndex(e, t) {
          let a = await this.getDb(),
            s = await a.transaction(K).store.index(j).openCursor(e, t);
          return s?.value;
        }
        async getDb() {
          return (
            this._db ||
              (this._db = await T("serwist-background-sync", 3, {
                upgrade: this._upgradeDb,
              })),
            this._db
          );
        }
        _upgradeDb(e, t) {
          t > 0 &&
            t < 3 &&
            e.objectStoreNames.contains(K) &&
            e.deleteObjectStore(K),
            e
              .createObjectStore(K, { autoIncrement: !0, keyPath: "id" })
              .createIndex(j, j, { unique: !1 });
        }
      }
      class H {
        _queueName;
        _queueDb;
        constructor(e) {
          (this._queueName = e), (this._queueDb = new $());
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
      let G = [
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
      class V {
        _requestData;
        static async fromRequest(e) {
          let t = { url: e.url, headers: {} };
          for (let a of ("GET" !== e.method &&
            (t.body = await e.clone().arrayBuffer()),
          e.headers.forEach((e, a) => {
            t.headers[a] = e;
          }),
          G))
            void 0 !== e[a] && (t[a] = e[a]);
          return new V(t);
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
          return new V(this.toObject());
        }
      }
      let Q = "serwist-background-sync",
        z = new Set(),
        X = (e) => {
          let t = {
            request: new V(e.requestData).toRequest(),
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
          if (z.has(e)) throw new u("duplicate-queue-name", { name: e });
          z.add(e),
            (this._name = e),
            (this._onSync = a || this.replayRequests),
            (this._maxRetentionTime = s || 10080),
            (this._forceSyncFallback = !!t),
            (this._queueStore = new H(this._name)),
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
          let n = {
            requestData: (await V.fromRequest(e.clone())).toObject(),
            timestamp: a,
          };
          switch ((t && (n.metadata = t), s)) {
            case "push":
              await this._queueStore.pushEntry(n);
              break;
            case "unshift":
              await this._queueStore.unshiftEntry(n);
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
                new u("queue-replay-failed", { name: this._name }))
              );
            }
        }
        async registerSync() {
          if ("sync" in self.registration && !this._forceSyncFallback)
            try {
              await self.registration.sync.register(`${Q}:${this._name}`);
            } catch (e) {}
        }
        _addSyncListener() {
          "sync" in self.registration && !this._forceSyncFallback
            ? self.addEventListener("sync", (e) => {
                if (e.tag === `${Q}:${this._name}`) {
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
          return z;
        }
      }
      class J {
        _queue;
        constructor(e, t) {
          this._queue = new Y(e, t);
        }
        fetchDidFail = async ({ request: e }) => {
          await this._queue.pushRequest({ request: e });
        };
      }
      let Z = (e) => (e && "object" == typeof e ? e : { handle: e });
      class ee {
        handler;
        match;
        method;
        catchHandler;
        constructor(e, t, a = "GET") {
          (this.handler = Z(t)), (this.match = e), (this.method = a);
        }
        setCatchHandler(e) {
          this.catchHandler = Z(e);
        }
      }
      class et extends ee {
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
      class ea extends ee {
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
      class es {
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
          let n = s.origin === location.origin,
            { params: r, route: i } = this.findMatchingRoute({
              event: t,
              request: e,
              sameOrigin: n,
              url: s,
            }),
            o = i?.handler,
            c = e.method;
          if (
            (!o &&
              this._defaultHandlerMap.has(c) &&
              (o = this._defaultHandlerMap.get(c)),
            !o)
          )
            return;
          try {
            a = o.handle({ url: s, request: e, event: t, params: r });
          } catch (e) {
            a = Promise.reject(e);
          }
          let l = i?.catchHandler;
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
                      params: r,
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
          for (let n of this._routes.get(a.method) || []) {
            let r;
            let i = n.match({ url: e, sameOrigin: t, request: a, event: s });
            if (i)
              return (
                Array.isArray((r = i)) && 0 === r.length
                  ? (r = void 0)
                  : i.constructor === Object && 0 === Object.keys(i).length
                    ? (r = void 0)
                    : "boolean" == typeof i && (r = void 0),
                { route: n, params: r }
              );
          }
          return {};
        }
        setDefaultHandler(e, t = "GET") {
          this._defaultHandlerMap.set(t, Z(e));
        }
        setCatchHandler(e) {
          this._catchHandler = Z(e);
        }
        registerRoute(e) {
          this._routes.has(e.method) || this._routes.set(e.method, []),
            this._routes.get(e.method).push(e);
        }
        unregisterRoute(e) {
          if (!this._routes.has(e.method))
            throw new u("unregister-route-but-not-found-with-method", {
              method: e.method,
            });
          let t = this._routes.get(e.method).indexOf(e);
          if (t > -1) this._routes.get(e.method).splice(t, 1);
          else throw new u("unregister-route-route-not-registered");
        }
      }
      let en = () => (
        n || ((n = new es()).addFetchListener(), n.addCacheListener()), n
      );
      function er(e, t, a) {
        let s;
        if ("string" == typeof e) {
          let n = new URL(e, location.href);
          s = new ee(({ url: e }) => e.href === n.href, t, a);
        } else if (e instanceof RegExp) s = new ea(e, t, a);
        else if ("function" == typeof e) s = new ee(e, t, a);
        else if (e instanceof ee) s = e;
        else
          throw new u("unsupported-route-type", {
            moduleName: "@serwist/routing",
            funcName: "registerRoute",
            paramName: "capture",
          });
        return en().registerRoute(s), s;
      }
      function ei(e) {
        return "string" == typeof e ? new Request(e) : e;
      }
      class eo {
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
          (this._handlerDeferred = new p()),
          (this._extendLifetimePromises = []),
          (this._plugins = [...e.plugins]),
          (this._pluginStateMap = new Map()),
          this._plugins))
            this._pluginStateMap.set(a, {});
          this.event.waitUntil(this._handlerDeferred.promise);
        }
        async fetch(e) {
          let { event: t } = this,
            a = ei(e);
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
              throw new u("plugin-error-request-will-fetch", {
                thrownErrorMessage: e.message,
              });
          }
          let n = a.clone();
          try {
            let e;
            for (let s of ((e = await fetch(
              a,
              "navigate" === a.mode ? void 0 : this._strategy.fetchOptions,
            )),
            this.iterateCallbacks("fetchDidSucceed")))
              e = await s({ event: t, request: n, response: e });
            return e;
          } catch (e) {
            throw (
              (s &&
                (await this.runCallbacks("fetchDidFail", {
                  error: e,
                  event: t,
                  originalRequest: s.clone(),
                  request: n.clone(),
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
          let a = ei(e),
            { cacheName: s, matchOptions: n } = this._strategy,
            r = await this.getCacheKey(a, "read"),
            i = { ...n, cacheName: s };
          for (let e of ((t = await caches.match(r, i)),
          this.iterateCallbacks("cachedResponseWillBeUsed")))
            t =
              (await e({
                cacheName: s,
                matchOptions: n,
                cachedResponse: t,
                request: r,
                event: this.event,
              })) || void 0;
          return t;
        }
        async cachePut(e, t) {
          let a = ei(e);
          await v(0);
          let s = await this.getCacheKey(a, "write");
          if (!t) throw new u("cache-put-with-no-response", { url: _(s.url) });
          let n = await this._ensureResponseSafeToCache(t);
          if (!n) return !1;
          let { cacheName: r, matchOptions: i } = this._strategy,
            o = await self.caches.open(r),
            c = this.hasCallback("cacheDidUpdate"),
            l = c ? await g(o, s.clone(), ["__WB_REVISION__"], i) : null;
          try {
            await o.put(s, c ? n.clone() : n);
          } catch (e) {
            if (e instanceof Error)
              throw ("QuotaExceededError" === e.name && (await y()), e);
          }
          for (let e of this.iterateCallbacks("cacheDidUpdate"))
            await e({
              cacheName: r,
              oldResponse: l,
              newResponse: n.clone(),
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
              s = ei(
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
                  let n = { ...s, state: a };
                  return t[e](n);
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
      class ec {
        cacheName;
        plugins;
        fetchOptions;
        matchOptions;
        constructor(e = {}) {
          (this.cacheName = l.getRuntimeName(e.cacheName)),
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
            a =
              "string" == typeof e.request ? new Request(e.request) : e.request,
            s = new eo(this, {
              event: t,
              request: a,
              params: "params" in e ? e.params : void 0,
            }),
            n = this._getResponse(s, a, t),
            r = this._awaitComplete(n, s, a, t);
          return [n, r];
        }
        async _getResponse(e, t, a) {
          let s;
          await e.runCallbacks("handlerWillStart", { event: a, request: t });
          try {
            if (
              ((s = await this._handle(t, e)),
              void 0 === s || "error" === s.type)
            )
              throw new u("no-response", { url: t.url });
          } catch (n) {
            if (n instanceof Error) {
              for (let r of e.iterateCallbacks("handlerDidError"))
                if (
                  void 0 !== (s = await r({ error: n, event: a, request: t }))
                )
                  break;
            }
            if (!s) throw n;
          }
          for (let n of e.iterateCallbacks("handlerWillRespond"))
            s = await n({ event: a, request: t, response: s });
          return s;
        }
        async _awaitComplete(e, t, a, s) {
          let n, r;
          try {
            n = await e;
          } catch (e) {}
          try {
            await t.runCallbacks("handlerDidRespond", {
              event: s,
              request: a,
              response: n,
            }),
              await t.doneWaiting();
          } catch (e) {
            e instanceof Error && (r = e);
          }
          if (
            (await t.runCallbacks("handlerDidComplete", {
              event: s,
              request: a,
              response: n,
              error: r,
            }),
            t.destroy(),
            r)
          )
            throw r;
        }
      }
      class el extends ec {
        async _handle(e, t) {
          let a,
            s = await t.cacheMatch(e);
          if (!s)
            try {
              s = await t.fetchAndCachePut(e);
            } catch (e) {
              e instanceof Error && (a = e);
            }
          if (!s) throw new u("no-response", { url: e.url, error: a });
          return s;
        }
      }
      class eh extends ec {
        async _handle(e, t) {
          let a = await t.cacheMatch(e);
          if (!a) throw new u("no-response", { url: e.url });
          return a;
        }
      }
      let eu = {
        cacheWillUpdate: async ({ response: e }) =>
          200 === e.status || 0 === e.status ? e : null,
      };
      class ed extends ec {
        _networkTimeoutSeconds;
        constructor(e = {}) {
          super(e),
            this.plugins.some((e) => "cacheWillUpdate" in e) ||
              this.plugins.unshift(eu),
            (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0);
        }
        async _handle(e, t) {
          let a;
          let s = [],
            n = [];
          if (this._networkTimeoutSeconds) {
            let { id: r, promise: i } = this._getTimeoutPromise({
              request: e,
              logs: s,
              handler: t,
            });
            (a = r), n.push(i);
          }
          let r = this._getNetworkPromise({
            timeoutId: a,
            request: e,
            logs: s,
            handler: t,
          });
          n.push(r);
          let i = await t.waitUntil(
            (async () => (await t.waitUntil(Promise.race(n))) || (await r))(),
          );
          if (!i) throw new u("no-response", { url: e.url });
          return i;
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
          let n, r;
          try {
            r = await s.fetchAndCachePut(t);
          } catch (e) {
            e instanceof Error && (n = e);
          }
          return (
            e && clearTimeout(e), (n || !r) && (r = await s.cacheMatch(t)), r
          );
        }
      }
      class ef extends ec {
        _networkTimeoutSeconds;
        constructor(e = {}) {
          super(e),
            (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0);
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
          if (!a) throw new u("no-response", { url: e.url, error: s });
          return a;
        }
      }
      class ep extends ec {
        constructor(e = {}) {
          super(e),
            this.plugins.some((e) => "cacheWillUpdate" in e) ||
              this.plugins.unshift(eu);
        }
        async _handle(e, t) {
          let a;
          let s = t.fetchAndCachePut(e).catch(() => {});
          t.waitUntil(s);
          let n = await t.cacheMatch(e);
          if (n);
          else
            try {
              n = await s;
            } catch (e) {
              e instanceof Error && (a = e);
            }
          if (!n) throw new u("no-response", { url: e.url, error: a });
          return n;
        }
      }
      let em = "www.google-analytics.com",
        eg = "www.googletagmanager.com",
        ew = /^\/(\w+\/)?collect/,
        ey =
          (e) =>
          async ({ queue: t }) => {
            let a;
            for (; (a = await t.shiftRequest()); ) {
              let { request: s, timestamp: n } = a,
                r = new URL(s.url);
              try {
                let t =
                    "POST" === s.method
                      ? new URLSearchParams(await s.clone().text())
                      : r.searchParams,
                  a = n - (Number(t.get("qt")) || 0),
                  i = Date.now() - a;
                if ((t.set("qt", String(i)), e.parameterOverrides))
                  for (let a of Object.keys(e.parameterOverrides)) {
                    let s = e.parameterOverrides[a];
                    t.set(a, s);
                  }
                "function" == typeof e.hitFilter && e.hitFilter.call(null, t),
                  await fetch(
                    new Request(r.origin + r.pathname, {
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
        e_ = (e) => {
          let t = ({ url: e }) => e.hostname === em && ew.test(e.pathname),
            a = new ef({ plugins: [e] });
          return [new ee(t, a, "GET"), new ee(t, a, "POST")];
        },
        ev = (e) =>
          new ee(
            ({ url: e }) => e.hostname === em && "/analytics.js" === e.pathname,
            new ed({ cacheName: e }),
            "GET",
          ),
        eb = (e) =>
          new ee(
            ({ url: e }) => e.hostname === eg && "/gtag/js" === e.pathname,
            new ed({ cacheName: e }),
            "GET",
          ),
        ex = (e) =>
          new ee(
            ({ url: e }) => e.hostname === eg && "/gtm.js" === e.pathname,
            new ed({ cacheName: e }),
            "GET",
          ),
        eR = (e = {}) => {
          let t = l.getGoogleAnalyticsName(e.cacheName),
            a = new J("serwist-google-analytics", {
              maxRetentionTime: 2880,
              onSync: ey(e),
            }),
            s = [ex(t), ev(t), eb(t), ...e_(a)],
            n = new es();
          for (let e of s) n.registerRoute(e);
          n.addFetchListener();
        };
      class eE extends ec {
        _fallbackToNetwork;
        static defaultPrecacheCacheabilityPlugin = {
          cacheWillUpdate: async ({ response: e }) =>
            !e || e.status >= 400 ? null : e,
        };
        static copyRedirectedCacheableResponsesPlugin = {
          cacheWillUpdate: async ({ response: e }) =>
            e.redirected ? await f(e) : e,
        };
        constructor(e = {}) {
          (e.cacheName = l.getPrecacheName(e.cacheName)),
            super(e),
            (this._fallbackToNetwork = !1 !== e.fallbackToNetwork),
            this.plugins.push(eE.copyRedirectedCacheableResponsesPlugin);
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
            let n = s.integrity,
              r = e.integrity,
              i = !r || r === n;
            (a = await t.fetch(
              new Request(e, {
                integrity: "no-cors" !== e.mode ? r || n : void 0,
              }),
            )),
              n &&
                i &&
                "no-cors" !== e.mode &&
                (this._useDefaultCacheabilityPluginIfNeeded(),
                await t.cachePut(e, a.clone()));
          } else
            throw new u("missing-precache-entry", {
              cacheName: this.cacheName,
              url: e.url,
            });
          return a;
        }
        async _handleInstall(e, t) {
          this._useDefaultCacheabilityPluginIfNeeded();
          let a = await t.fetch(e);
          if (!(await t.cachePut(e, a.clone())))
            throw new u("bad-precaching-response", {
              url: e.url,
              status: a.status,
            });
          return a;
        }
        _useDefaultCacheabilityPluginIfNeeded() {
          let e = null,
            t = 0;
          for (let [a, s] of this.plugins.entries())
            s !== eE.copyRedirectedCacheableResponsesPlugin &&
              (s === eE.defaultPrecacheCacheabilityPlugin && (e = a),
              s.cacheWillUpdate && t++);
          0 === t
            ? this.plugins.push(eE.defaultPrecacheCacheabilityPlugin)
            : t > 1 && null !== e && this.plugins.splice(e, 1);
        }
      }
      class eS {
        _precacheController;
        constructor({ precacheController: e }) {
          this._precacheController = e;
        }
        cacheKeyWillBeUsed = async ({ request: e, params: t }) => {
          let a =
            t?.cacheKey || this._precacheController.getCacheKeyForURL(e.url);
          return a ? new Request(a, { headers: e.headers }) : e;
        };
      }
      class eq {
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
      class eC {
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
          (this._strategy = new eE({
            cacheName: l.getPrecacheName(e),
            plugins: [...t, new eS({ precacheController: this })],
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
                  throw new u("add-to-cache-list-unexpected-type", {
                    entry: e,
                  });
                if ("string" == typeof e) {
                  let t = new URL(e, location.href);
                  return { cacheKey: t.href, url: t.href };
                }
                let { revision: t, url: a } = e;
                if (!a)
                  throw new u("add-to-cache-list-unexpected-type", {
                    entry: e,
                  });
                if (!t) {
                  let e = new URL(a, location.href);
                  return { cacheKey: e.href, url: e.href };
                }
                let s = new URL(a, location.href),
                  n = new URL(a, location.href);
                return (
                  s.searchParams.set("__WB_REVISION__", t),
                  { cacheKey: s.href, url: n.href }
                );
              })(a),
              n = "string" != typeof a && a.revision ? "reload" : "default";
            if (
              this._urlsToCacheKeys.has(s) &&
              this._urlsToCacheKeys.get(s) !== e
            )
              throw new u("add-to-cache-list-conflicting-entries", {
                firstEntry: this._urlsToCacheKeys.get(s),
                secondEntry: e,
              });
            if ("string" != typeof a && a.integrity) {
              if (
                this._cacheKeysToIntegrities.has(e) &&
                this._cacheKeysToIntegrities.get(e) !== a.integrity
              )
                throw new u("add-to-cache-list-conflicting-integrities", {
                  url: s,
                });
              this._cacheKeysToIntegrities.set(e, a.integrity);
            }
            this._urlsToCacheKeys.set(s, e),
              this._urlsToCacheModes.set(s, n),
              t.length > 0 &&
                console.warn(`Serwist is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`);
          }
        }
        install(e) {
          return x(e, async () => {
            let t = new eq();
            for (let [a, s] of (this.strategy.plugins.push(t),
            this._urlsToCacheKeys)) {
              let t = this._cacheKeysToIntegrities.get(s),
                n = this._urlsToCacheModes.get(a),
                r = new Request(a, {
                  integrity: t,
                  cache: n,
                  credentials: "same-origin",
                });
              await Promise.all(
                this.strategy.handleAll({
                  params: { cacheKey: s },
                  request: r,
                  event: e,
                }),
              );
            }
            let { updatedURLs: a, notUpdatedURLs: s } = t;
            return { updatedURLs: a, notUpdatedURLs: s };
          });
        }
        activate(e) {
          return x(e, async () => {
            let e = await self.caches.open(this.strategy.cacheName),
              t = await e.keys(),
              a = new Set(this._urlsToCacheKeys.values()),
              s = [];
            for (let n of t) a.has(n.url) || (await e.delete(n), s.push(n.url));
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
          if (a)
            return (await self.caches.open(this.strategy.cacheName)).match(a);
        }
        createHandlerBoundToURL(e) {
          let t = this.getCacheKeyForURL(e);
          if (!t) throw new u("non-precached-url", { url: e });
          return (a) => (
            (a.request = new Request(e)),
            (a.params = { cacheKey: t, ...a.params }),
            this.strategy.handle(a)
          );
        }
      }
      let eD = () => (r || (r = new eC()), r);
      class eN {
        _fallbackURL;
        _precacheController;
        constructor({ fallbackURL: e, precacheController: t }) {
          (this._fallbackURL = e), (this._precacheController = t || eD());
        }
        handlerDidError = () =>
          this._precacheController.matchPrecache(this._fallbackURL);
      }
      class eT extends ee {
        constructor(e, t) {
          super(({ request: a }) => {
            let s = e.getURLsToCacheKeys();
            for (let n of (function* (
              e,
              {
                ignoreURLParametersMatching: t = [/^utm_/, /^fbclid$/],
                directoryIndex: a = "index.html",
                cleanURLs: s = !0,
                urlManipulation: n,
              } = {},
            ) {
              let r = new URL(e, location.href);
              (r.hash = ""), yield r.href;
              let i = (function (e, t = []) {
                for (let a of [...e.searchParams.keys()])
                  t.some((e) => e.test(a)) && e.searchParams.delete(a);
                return e;
              })(r, t);
              if ((yield i.href, a && i.pathname.endsWith("/"))) {
                let e = new URL(i.href);
                (e.pathname += a), yield e.href;
              }
              if (s) {
                let e = new URL(i.href);
                (e.pathname += ".html"), yield e.href;
              }
              if (n) for (let e of n({ url: r })) yield e.href;
            })(a.url, t)) {
              let t = s.get(n);
              if (t) {
                let a = e.getIntegrityForCacheKey(t);
                return { cacheKey: t, integrity: a };
              }
            }
          }, e.strategy);
        }
      }
      let ek = "-precache-",
        eP = async (e, t = ek) => {
          let a = (await self.caches.keys()).filter(
            (a) =>
              a.includes(t) && a.includes(self.registration.scope) && a !== e,
          );
          return await Promise.all(a.map((e) => self.caches.delete(e))), a;
        };
      function eL(e, t) {
        eD().precache(e), er(new eT(eD(), t));
      }
      let eA = (e, t, a) =>
          !a.some((a) => e.headers.has(a) && t.headers.has(a)) ||
          a.every((a) => {
            let s = e.headers.has(a) === t.headers.has(a),
              n = e.headers.get(a) === t.headers.get(a);
            return s && n;
          }),
        eI = ["content-length", "etag", "last-modified"],
        eU =
          "undefined" != typeof navigator &&
          /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      function eF(e) {
        return { cacheName: e.cacheName, updatedURL: e.request.url };
      }
      class eW {
        _headersToCheck;
        _generatePayload;
        _notifyAllClients;
        constructor({
          generatePayload: e,
          headersToCheck: t,
          notifyAllClients: a,
        } = {}) {
          (this._headersToCheck = t || eI),
            (this._generatePayload = e || eF),
            (this._notifyAllClients = a ?? !0);
        }
        async notifyIfUpdated(e) {
          if (
            e.oldResponse &&
            !eA(e.oldResponse, e.newResponse, this._headersToCheck)
          ) {
            let t = {
              type: "CACHE_UPDATED",
              meta: "serwist-broadcast-update",
              payload: this._generatePayload(e),
            };
            if ("navigate" === e.request.mode) {
              let t;
              e.event instanceof FetchEvent && (t = e.event.resultingClientId),
                (!(await b(t)) || eU) && (await v(3500));
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
      class eM {
        _broadcastUpdate;
        constructor(e) {
          this._broadcastUpdate = new eW(e);
        }
        cacheDidUpdate = async (e) => {
          w(this._broadcastUpdate.notifyIfUpdated(e));
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
      class eB {
        _cacheableResponse;
        constructor(e) {
          this._cacheableResponse = new eO(e);
        }
        cacheWillUpdate = async ({ response: e }) =>
          this._cacheableResponse.isResponseCacheable(e) ? e : null;
      }
      let eK = "cache-entries",
        ej = (e) => {
          let t = new URL(e, location.href);
          return (t.hash = ""), t.href;
        };
      class e$ {
        _cacheName;
        _db = null;
        constructor(e) {
          this._cacheName = e;
        }
        _upgradeDb(e) {
          let t = e.createObjectStore(eK, { keyPath: "id" });
          t.createIndex("cacheName", "cacheName", { unique: !1 }),
            t.createIndex("timestamp", "timestamp", { unique: !1 });
        }
        _upgradeDbAndDeleteOldDbs(e) {
          this._upgradeDb(e),
            this._cacheName &&
              (function (e, { blocked: t } = {}) {
                let a = indexedDB.deleteDatabase(e);
                t && a.addEventListener("blocked", (e) => t(e.oldVersion, e)),
                  D(a).then(() => void 0);
              })(this._cacheName);
        }
        async setTimestamp(e, t) {
          let a = {
              url: (e = ej(e)),
              timestamp: t,
              cacheName: this._cacheName,
              id: this._getId(e),
            },
            s = (await this.getDb()).transaction(eK, "readwrite", {
              durability: "relaxed",
            });
          await s.store.put(a), await s.done;
        }
        async getTimestamp(e) {
          let t = await this.getDb(),
            a = await t.get(eK, this._getId(e));
          return a?.timestamp;
        }
        async expireEntries(e, t) {
          let a = await this.getDb(),
            s = await a
              .transaction(eK)
              .store.index("timestamp")
              .openCursor(null, "prev"),
            n = [],
            r = 0;
          for (; s; ) {
            let a = s.value;
            a.cacheName === this._cacheName &&
              ((e && a.timestamp < e) || (t && r >= t) ? n.push(s.value) : r++),
              (s = await s.continue());
          }
          let i = [];
          for (let e of n) await a.delete(eK, e.id), i.push(e.url);
          return i;
        }
        _getId(e) {
          return `${this._cacheName}|${ej(e)}`;
        }
        async getDb() {
          return (
            this._db ||
              (this._db = await T("serwist-expiration", 1, {
                upgrade: this._upgradeDbAndDeleteOldDbs.bind(this),
              })),
            this._db
          );
        }
      }
      class eH {
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
            (this._timestampModel = new e$(e));
        }
        async expireEntries() {
          if (this._isRunning) {
            this._rerunRequested = !0;
            return;
          }
          this._isRunning = !0;
          let e = this._maxAgeSeconds
              ? Date.now() - 1e3 * this._maxAgeSeconds
              : 0,
            t = await this._timestampModel.expireEntries(e, this._maxEntries),
            a = await self.caches.open(this._cacheName);
          for (let e of t) await a.delete(e, this._matchOptions);
          (this._isRunning = !1),
            this._rerunRequested &&
              ((this._rerunRequested = !1), w(this.expireEntries()));
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
      class eG {
        _config;
        _maxAgeSeconds;
        _cacheExpirations;
        constructor(e = {}) {
          (this._config = e),
            (this._maxAgeSeconds = e.maxAgeSeconds),
            (this._cacheExpirations = new Map()),
            e.purgeOnQuotaError && d.add(() => this.deleteCacheAndMetadata());
        }
        _getCacheExpiration(e) {
          if (e === l.getRuntimeName())
            throw new u("expire-custom-caches-only");
          let t = this._cacheExpirations.get(e);
          return (
            t ||
              ((t = new eH(e, this._config)), this._cacheExpirations.set(e, t)),
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
          let n = this._isResponseDateFresh(s),
            r = this._getCacheExpiration(a);
          w(r.expireEntries());
          let i = r.updateTimestamp(t.url);
          if (e)
            try {
              e.waitUntil(i);
            } catch (e) {}
          return n ? s : null;
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
      async function eV(e, t) {
        try {
          if (206 === t.status) return t;
          let a = e.headers.get("range");
          if (!a) throw new u("no-range-header");
          let s = (function (e) {
              let t = e.trim().toLowerCase();
              if (!t.startsWith("bytes="))
                throw new u("unit-must-be-bytes", { normalizedRangeHeader: t });
              if (t.includes(","))
                throw new u("single-range-only", { normalizedRangeHeader: t });
              let a = /(\d*)-(\d*)/.exec(t);
              if (!a || !(a[1] || a[2]))
                throw new u("invalid-range-values", {
                  normalizedRangeHeader: t,
                });
              return {
                start: "" === a[1] ? void 0 : Number(a[1]),
                end: "" === a[2] ? void 0 : Number(a[2]),
              };
            })(a),
            n = await t.blob(),
            r = (function (e, t, a) {
              let s, n;
              let r = e.size;
              if ((a && a > r) || (t && t < 0))
                throw new u("range-not-satisfiable", {
                  size: r,
                  end: a,
                  start: t,
                });
              return (
                void 0 !== t && void 0 !== a
                  ? ((s = t), (n = a + 1))
                  : void 0 !== t && void 0 === a
                    ? ((s = t), (n = r))
                    : void 0 !== a && void 0 === t && ((s = r - a), (n = r)),
                { start: s, end: n }
              );
            })(n, s.start, s.end),
            i = n.slice(r.start, r.end),
            o = i.size,
            c = new Response(i, {
              status: 206,
              statusText: "Partial Content",
              headers: t.headers,
            });
          return (
            c.headers.set("Content-Length", String(o)),
            c.headers.set(
              "Content-Range",
              `bytes ${r.start}-${r.end - 1}/${n.size}`,
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
      class eQ {
        cachedResponseWillBeUsed = async ({ request: e, cachedResponse: t }) =>
          t && e.headers.has("range") ? await eV(e, t) : t;
      }
      let ez = () => {
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
                      cacheMatchOptions: n = { ignoreSearch: !0 },
                    } of t)
                      if (a(e)) return caches.match(s, n);
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
                let t = l.getPrecacheName();
                e.waitUntil(eP(t).then((e) => {}));
              }),
            s.navigateFallback)
          ) {
            var n;
            er(
              new et(
                ((n = s.navigateFallback), eD().createHandlerBoundToURL(n)),
                {
                  allowlist: s.navigateFallbackAllowlist,
                  denylist: s.navigateFallbackDenylist,
                },
              ),
            );
          }
        },
        eJ = (e) => null != e,
        eZ = {
          CacheFirst: el,
          CacheOnly: eh,
          NetworkFirst: ed,
          NetworkOnly: ef,
          StaleWhileRevalidate: ep,
        },
        e0 = (...e) => {
          for (let t of e)
            if ("string" == typeof t.handler) {
              let {
                  cacheName: e,
                  networkTimeoutSeconds: a,
                  fetchOptions: s,
                  matchOptions: n,
                  plugins: r,
                  backgroundSync: i,
                  broadcastUpdate: o,
                  cacheableResponse: c,
                  expiration: l,
                  precacheFallback: h,
                  rangeRequests: u,
                } = t.options,
                d = eZ[t.handler];
              er(
                t.urlPattern,
                new d({
                  cacheName: e ?? void 0,
                  networkTimeoutSeconds: a,
                  fetchOptions: s,
                  matchOptions: n,
                  plugins: [
                    ...(r ?? []),
                    i && new J(i.name, i.options),
                    o && new eM({ channelName: o.channelName, ...o.options }),
                    c && new eB(c),
                    l && new eG(l),
                    h && new eN(h),
                    u ? new eQ() : void 0,
                  ].filter(eJ),
                }),
                t.method,
              );
            } else er(t.urlPattern, t.handler, t.method);
        };
      var e1,
        e4,
        e2,
        e6,
        e3 = a(779);
      ((e2 = e6 || (e6 = {})).SENTRY_DSN = e3.env.NEXT_PUBLIC_SENTRY_DSN || ""),
        (e2.ownerEmail = e3.env.NEXT_PUBLIC_OWNER_EMAIL || ""),
        (e2.isLocal = "production" !== e3.env.MODE),
        (e2.version = "0.0.2"),
        e6.isLocal ||
          (({
            precacheEntries: e,
            precacheOptions: t,
            cleanupOutdatedCaches: a,
            skipWaiting: s = !1,
            importScripts: n,
            navigationPreload: r = !1,
            cacheId: i,
            clientsClaim: o = !1,
            runtimeCaching: c,
            offlineAnalyticsConfig: h,
            disableDevLogs: u,
            fallbacks: d,
            ...f
          }) => {
            var p;
            n && n.length > 0 && self.importScripts(...n),
              r &&
                self.registration?.navigationPreload &&
                self.addEventListener("activate", (e) => {
                  e.waitUntil(
                    self.registration.navigationPreload.enable().then(() => {
                      p &&
                        self.registration.navigationPreload.setHeaderValue(p);
                    }),
                  );
                }),
              void 0 !== i && l.updateDetails({ prefix: i }),
              s
                ? self.skipWaiting()
                : self.addEventListener("message", (e) => {
                    e.data &&
                      "SKIP_WAITING" === e.data.type &&
                      self.skipWaiting();
                  }),
              o &&
                self.addEventListener("activate", () => self.clients.claim()),
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
                (void 0 !== d && (c = eX({ ...d, runtimeCaching: c })),
                e0(...c)),
              void 0 !== h && ("boolean" == typeof h ? h && eR() : eR(h)),
              u && ez();
          })({
            precacheEntries: [
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/248-daa052f6c04465d2.js",
              },
              {
                revision: "3b7118d2644f4ec54733c28c14127bb9",
                url: "/_next/static/chunks/248-daa052f6c04465d2.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/287-e56e7dd393aee783.js",
              },
              {
                revision: "8bbb7220f59e6e8e3648dc82ee96bb57",
                url: "/_next/static/chunks/287-e56e7dd393aee783.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/30b509c0-23c8911240be474e.js",
              },
              {
                revision: "82bdfe37fffe783c10c7fdb2eb210cd0",
                url: "/_next/static/chunks/30b509c0-23c8911240be474e.js.map",
              },
              {
                revision: "cc349b15075ca700",
                url: "/_next/static/chunks/3138c351.cc349b15075ca700.js",
              },
              {
                revision: "87909073931c0bd0a2471f1875111a6b",
                url: "/_next/static/chunks/3138c351.cc349b15075ca700.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/318-a2ecabf84d0c1ad2.js",
              },
              {
                revision: "919484c6509c94b84783f936f9d18d82",
                url: "/_next/static/chunks/318-a2ecabf84d0c1ad2.js.map",
              },
              {
                revision: "f13db07fdb7f14f5",
                url: "/_next/static/chunks/509.f13db07fdb7f14f5.js",
              },
              {
                revision: "0a34cf3e6a826a05152b9ebb0b71907d",
                url: "/_next/static/chunks/509.f13db07fdb7f14f5.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/552-3e9afed8c8151075.js",
              },
              {
                revision: "6c681abfa804ca72be17de6eb4eb85db",
                url: "/_next/static/chunks/552-3e9afed8c8151075.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/621-e6c8f8e1932ee994.js",
              },
              {
                revision: "27a516995eb19e709521d3bac064df6a",
                url: "/_next/static/chunks/621-e6c8f8e1932ee994.js.map",
              },
              {
                revision: "bc6faf3fad053082",
                url: "/_next/static/chunks/674.bc6faf3fad053082.js",
              },
              {
                revision: "c20bb17461433f86820bc3c9fee42e80",
                url: "/_next/static/chunks/674.bc6faf3fad053082.js.map",
              },
              {
                revision: "0d462f2c4b70c9dd",
                url: "/_next/static/chunks/713.0d462f2c4b70c9dd.js",
              },
              {
                revision: "f560c26ccbcb51b87bcbc8c849bc3121",
                url: "/_next/static/chunks/713.0d462f2c4b70c9dd.js.map",
              },
              {
                revision: "cb4eea896424369e",
                url: "/_next/static/chunks/732.cb4eea896424369e.js",
              },
              {
                revision: "e22eb72d5fb89aa4a4bc6bfb2a303b14",
                url: "/_next/static/chunks/732.cb4eea896424369e.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/746-c19d8e69c0c924a2.js",
              },
              {
                revision: "1c73482b738644b85ab8b9ffd4be8755",
                url: "/_next/static/chunks/746-c19d8e69c0c924a2.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/771-c2f0a3945fbaa35d.js",
              },
              {
                revision: "3c4ffe577dcda1cf1bf7389768c20a4b",
                url: "/_next/static/chunks/771-c2f0a3945fbaa35d.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/813-4df4aacc6ecacf82.js",
              },
              {
                revision: "0bcf96f5a0971d23480194a5a1d3938b",
                url: "/_next/static/chunks/813-4df4aacc6ecacf82.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/854-4dda956eccc09de3.js",
              },
              {
                revision: "aa9481ea52e0693d6b88c582231e92bc",
                url: "/_next/static/chunks/854-4dda956eccc09de3.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/922-6a1c75d1a6269950.js",
              },
              {
                revision: "592e8821e56500b623a053494a34ab38",
                url: "/_next/static/chunks/922-6a1c75d1a6269950.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/951-10bc789e2c17050e.js",
              },
              {
                revision: "359afbef1023b531eedc92cd5e7fdf33",
                url: "/_next/static/chunks/951-10bc789e2c17050e.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/app/_not-found-aadb057ee975943f.js",
              },
              {
                revision: "3ca406abd01c35985dd31166be8ea215",
                url: "/_next/static/chunks/app/_not-found-aadb057ee975943f.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/app/app/cart/%5Bid%5D/page-62409dca21d9cc94.js",
              },
              {
                revision: "cedf6ca4e26d4d15b045c2c1bf4280f5",
                url: "/_next/static/chunks/app/app/cart/%5Bid%5D/page-62409dca21d9cc94.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/app/app/cart/page-894a4f6c48f900e2.js",
              },
              {
                revision: "edc499a642116edb191426a8c04b08f7",
                url: "/_next/static/chunks/app/app/cart/page-894a4f6c48f900e2.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/app/app/config/page-c3933674a7bab0c5.js",
              },
              {
                revision: "f3bbb947f1022f0a522035c3de15ffd9",
                url: "/_next/static/chunks/app/app/config/page-c3933674a7bab0c5.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/app/app/debug/page-083999f66def276b.js",
              },
              {
                revision: "44b967969b83367087361462d6069a6b",
                url: "/_next/static/chunks/app/app/debug/page-083999f66def276b.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/app/app/friends/page-5f5883fc635c1127.js",
              },
              {
                revision: "abe649577913bf557bb5c040b7c2e33e",
                url: "/_next/static/chunks/app/app/friends/page-5f5883fc635c1127.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/app/app/layout-3f6a3f82a5127053.js",
              },
              {
                revision: "0083a9b98b111830e449641335c3ef74",
                url: "/_next/static/chunks/app/app/layout-3f6a3f82a5127053.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/app/app/page-0cf38e197f8aac84.js",
              },
              {
                revision: "e2b610e005adcd5db5e93f94f499fa9a",
                url: "/_next/static/chunks/app/app/page-0cf38e197f8aac84.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/app/global-error-6f52e443d663fc7e.js",
              },
              {
                revision: "58bf530399128f53c65df734840f69ea",
                url: "/_next/static/chunks/app/global-error-6f52e443d663fc7e.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/app/layout-65961d4485b96674.js",
              },
              {
                revision: "a9cf7b6668b03958b46a3078639f5cab",
                url: "/_next/static/chunks/app/layout-65961d4485b96674.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/app/page-5e3242e1bfff8676.js",
              },
              {
                revision: "c6b81ee06c042a5f2b13a69f76352e81",
                url: "/_next/static/chunks/app/page-5e3242e1bfff8676.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/df47c5b5-b6330b8c9420574b.js",
              },
              {
                revision: "1fae1bb623e97f2e92d88cd55fc3e8f0",
                url: "/_next/static/chunks/df47c5b5-b6330b8c9420574b.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/framework-4da88ca730ecc825.js",
              },
              {
                revision: "cf07d7668ddc3d2359ece93bd1d1c8b8",
                url: "/_next/static/chunks/framework-4da88ca730ecc825.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/main-46c84d3a8e3e86c7.js",
              },
              {
                revision: "f2046df5342f19d221da5cc5c31d4c22",
                url: "/_next/static/chunks/main-46c84d3a8e3e86c7.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/main-app-9fea6f4e94629f96.js",
              },
              {
                revision: "a8359c62222dbd04d707badd6026c340",
                url: "/_next/static/chunks/main-app-9fea6f4e94629f96.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/pages/_app-a7ca95eef9d54a58.js",
              },
              {
                revision: "9ca57a7cb1fc9ce05acf50384c5c8731",
                url: "/_next/static/chunks/pages/_app-a7ca95eef9d54a58.js.map",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/pages/_error-829cbdac2fce4517.js",
              },
              {
                revision: "4b23442922e788c0fa76d8c59ee817b8",
                url: "/_next/static/chunks/pages/_error-829cbdac2fce4517.js.map",
              },
              {
                revision: "837c0df77fd5009c9e46d446188ecfd0",
                url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
              },
              {
                revision: "eIerUysiqUIeeCRq2sQwv",
                url: "/_next/static/chunks/webpack-834b39bff274265d.js",
              },
              {
                revision: "c00957bb624a5b8ca77726075256a750",
                url: "/_next/static/chunks/webpack-834b39bff274265d.js.map",
              },
              {
                revision: "034c472e8d2018b4",
                url: "/_next/static/css/034c472e8d2018b4.css",
              },
              {
                revision: "9c51300b081acecf2792dfba5c2c2a12",
                url: "/_next/static/css/034c472e8d2018b4.css.map",
              },
              {
                revision: "160dd1b4b3e659ccba7c282f893bae69",
                url: "/_next/static/eIerUysiqUIeeCRq2sQwv/_buildManifest.js",
              },
              {
                revision: "b6652df95db52feb4daf4eca35380933",
                url: "/_next/static/eIerUysiqUIeeCRq2sQwv/_ssgManifest.js",
              },
              {
                revision: "f1b44860c66554b91f3b1c81556f73ca",
                url: "/_next/static/media/05a31a2ca4975f99-s.woff2",
              },
              {
                revision: "c4eb7f37bc4206c901ab08601f21f0f2",
                url: "/_next/static/media/513657b02c5c193f-s.woff2",
              },
              {
                revision: "bb9d99fb9bbc695be80777ca2c1c2bee",
                url: "/_next/static/media/51ed15f9841b9f9d-s.woff2",
              },
              {
                revision: "74c3556b9dad12fb76f84af53ba69410",
                url: "/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2",
              },
              {
                revision: "dd930bafc6297347be3213f22cc53d3e",
                url: "/_next/static/media/d6b16ce4a6175f26-s.woff2",
              },
              {
                revision: "0e89df9522084290e01e4127495fae99",
                url: "/_next/static/media/ec159349637c90ad-s.woff2",
              },
              {
                revision: "71f3fcaf22131c3368d9ec28ef839831",
                url: "/_next/static/media/fd4db3eb5472fc27-s.woff2",
              },
              {
                revision: "851d715b74a26b3df67842ad65c61672",
                url: "/img/landing/phone-frame.svg",
              },
              {
                revision: "545db43d15f05231b1e9dc8ee029545c",
                url: "/manifest.json",
              },
              { revision: "e37c89a675e50916137f35cd5ce91eb3", url: "/sw.js" },
              {
                revision: "a5c5b0a5bfbc315ac5fc8089fca1732b",
                url: "/sw.js.map",
              },
              {
                revision: "8e3a10e157f75ada21ab742c022d5430",
                url: "/vite.svg",
              },
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
                urlPattern: ({
                  request: e,
                  url: { pathname: t },
                  sameOrigin: a,
                }) =>
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
                urlPattern: ({
                  request: e,
                  url: { pathname: t },
                  sameOrigin: a,
                }) =>
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
})();
