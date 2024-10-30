(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [185],
    {
      46601: function () {},
      16410: function (e, n, r) {
        Promise.resolve().then(r.bind(r, 18009)),
          Promise.resolve().then(r.t.bind(r, 63385, 23)),
          Promise.resolve().then(r.t.bind(r, 1800, 23)),
          Promise.resolve().then(r.bind(r, 24840)),
          Promise.resolve().then(r.bind(r, 98690));
      },
      24840: function (e, n, r) {
        "use strict";
        r.r(n),
          r.d(n, {
            NextAuthProvider: function () {
              return i;
            },
          });
        var t = r(57437),
          o = r(71126);
        r(2265);
        let i = (e) => {
          let { children: n } = e;
          return (0, t.jsx)(o.SessionProvider, { children: n });
        };
      },
      98690: function (e, n, r) {
        "use strict";
        r.r(n),
          r.d(n, {
            WalletContextProvider: function () {
              return h;
            },
          });
        var t = r(57437),
          o = r(9641),
          i = r(29681),
          s = r(95486),
          l = r(57754),
          u = r(23610),
          c = r(6123),
          d = r(2265);
        let h = (e) => {
          let { children: n } = e,
            r = "https://bren-klco8m-fast-mainnet.helius-rpc.com/",
            h = (0, d.useMemo)(() => [new l.O(), new u.e(), new c.X()], [r]),
            f = (0, d.useCallback)((e) => {
              console.error(e);
            }, []);
          return (0, t.jsx)(o.U, {
            endpoint: r,
            children: (0, t.jsx)(i.n, {
              wallets: h,
              onError: f,
              autoConnect: !0,
              children: (0, t.jsx)(s.s, { children: n }),
            }),
          });
        };
      },
      63385: function () {},
    },
    function (e) {
      e.O(0, [814, 113, 486, 229, 971, 69, 744], function () {
        return e((e.s = 16410));
      }),
        (_N_E = e.O());
    },
  ]);
  