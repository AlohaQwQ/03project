(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [931],
    {
      25286: function (e, t, a) {
        Promise.resolve().then(a.bind(a, 48836));
      },
      48836: function (e, t, a) {
        "use strict";
        a.r(t),
          a.d(t, {
            default: function () {
              return n;
            },
          });
        var r = a(57437),
          i = a(37269),
          s = a(52420);
        function n() {
          return (0, r.jsxs)(r.Fragment, {
            children: [
              (0, r.jsx)(s.Z, { className: "headerNew", pageName: "home" }),
              (0, r.jsx)("div", {
                className: "overflow-hidden",
                children: (0, r.jsxs)(i.W7, {
                  containerStyle: {
                    width: "110vw",
                    height: "100vh",
                    overflow: "none",
                  },
                  className: "parallax",
                  globalFactorX: 0.05,
                  globalFactorY: 0.05,
                  resetOnLeave: !0,
                  children: [
                    (0, r.jsx)(i.JV, {
                      factorX: 1,
                      factorY: 0.25,
                      className: "paraChild",
                      style: { backgroundImage: "url(/images/home/1.png)" },
                    }),
                    (0, r.jsx)(i.JV, {
                      factorX: 1.5,
                      factorY: 0.5,
                      className: "paraChild",
                      style: {
                        backgroundImage: "url(/images/home/2.png)",
                        width: "105%",
                        marginLeft: "-2.5%",
                        height: "108%",
                        top: "-2%",
                      },
                      children: (0, r.jsx)("img", {
                        className: "slerfHome",
                        src: "/images/home/slerf.png",
                      }),
                    }),
                    (0, r.jsx)(i.JV, {
                      factorX: 2,
                      factorY: 1.5,
                      className: "paraChild",
                      style: {
                        backgroundImage: "url(/images/home/text.png)",
                        backgroundPosition: "center 40%",
                        backgroundSize: "54vh",
                      },
                    }),
                    (0, r.jsx)(i.JV, {
                      factorX: 2.5,
                      factorY: 1,
                      className: "paraChild",
                      style: {
                        backgroundImage: "url(/images/home/3.png)",
                        width: "105%",
                        marginLeft: "-2.5%",
                        height: "108%",
                        top: "-4%",
                      },
                    }),
                    (0, r.jsx)(i.JV, {
                      factorX: 3,
                      factorY: 1.5,
                      className: "paraChild",
                      style: {
                        backgroundImage: "url(/images/home/4.png)",
                        width: "105%",
                        marginLeft: "-2.5%",
                        height: "108%",
                        top: "-4%",
                      },
                    }),
                  ],
                }),
              }),
            ],
          });
        }
      },
      52420: function (e, t, a) {
        "use strict";
        a.d(t, {
          Z: function () {
            return o;
          },
        });
        var r = a(57437),
          i = a(8792),
          s = a(2265);
        function n(e) {
          let { className: t, pageName: a } = e;
          function n(e) {
            return a == e ? "active" : "";
          }
          return (
            (function () {
              let [e, t] = (0, s.useState)({ width: void 0, height: void 0 });
              (0, s.useEffect)(() => {
                function e() {
                  t({ width: window.innerWidth, height: window.innerHeight });
                }
                return (
                  window.addEventListener("resize", e),
                  e(),
                  () => window.removeEventListener("resize", e)
                );
              }, []);
            })(),
            (0, r.jsxs)("div", {
              className: t,
              children: [
                (0, r.jsx)(i.default, {
                  href: "/",
                  children: (0, r.jsx)("div", {
                    className: "headerNew-item ".concat(n("home")),
                    children: "HOME",
                  }),
                }),
                (0, r.jsx)(i.default, {
                  href: "/integrations",
                  children: (0, r.jsx)("div", {
                    className: "headerNew-item ".concat(n("integrations")),
                    children: "INTEGRATIONS",
                  }),
                }),
                (0, r.jsx)(i.default, {
                  href: "/slerfdex",
                  children: (0, r.jsx)("div", {
                    className: "headerNew-item ".concat(n("slerfdex")),
                    children: "SLERFDEX",
                  }),
                }),
                (0, r.jsx)(i.default, {
                  href: "/history",
                  children: (0, r.jsx)("div", {
                    className: "headerNew-item ".concat(n("history")),
                    children: "HISTORY",
                  }),
                }),
                (0, r.jsx)(i.default, {
                  href: "/vote",
                  children: (0, r.jsx)("div", {
                    className: "headerNew-item ".concat(n("vote")),
                    children: "VOTE",
                  }),
                }),
                (0, r.jsx)(i.default, {
                  href: "/disclaimer",
                  children: (0, r.jsx)("div", {
                    className: "headerNew-item ".concat(n("vote")),
                    children: "DISCLAIMER",
                  }),
                }),
              ],
            })
          );
        }
        function l(e) {
          let { className: t, pageName: a } = e,
            [n, l] = (0, s.useState)(!1),
            c = (e) => (a === e ? "active" : "");
          return (0, r.jsxs)(r.Fragment, {
            children: [
              "home" !== a &&
                (0, r.jsx)("img", {
                  src: "/images/home/text.png",
                  className: "w-2/5 mt-5",
                }),
              (0, r.jsx)("div", {
                className: "bm-burger-button",
                onClick: () => l((e) => !e),
                children: (0, r.jsxs)("span", {
                  children: [
                    (0, r.jsx)("span", {
                      className:
                        "bm-burger-bars absolute h-1/5 left-0 right-0 opacity-100 bg-current",
                      style: { top: "0%" },
                    }),
                    (0, r.jsx)("span", {
                      className:
                        "bm-burger-bars absolute h-1/5 left-0 right-0 opacity-100 bg-current",
                      style: { top: "40%" },
                    }),
                    (0, r.jsx)("span", {
                      className:
                        "bm-burger-bars absolute h-1/5 left-0 right-0 opacity-100 bg-current",
                      style: { top: "80%" },
                    }),
                  ],
                }),
              }),
              (0, r.jsxs)("div", {
                className:
                  "fixed top-0 right-0 h-full w-full bg-[#ee9436] text-white transform transition-transform duration-300 ease-in-out ".concat(
                    n ? "translate-x-0" : "translate-x-full",
                  ),
                style: { zIndex: 1001 },
                children: [
                  (0, r.jsx)("button", {
                    onClick: () => l(!1),
                    className:
                      "absolute top-4 right-8 text-white text-[50px] font-bold",
                    "aria-label": "Close menu",
                    children: "\xd7",
                  }),
                  (0, r.jsx)("div", {
                    className: "flex flex-col items-center pt-16 h-full",
                    children: [
                      { href: "/", label: "HOME" },
                      { href: "/integrations", label: "INTEGRATIONS" },
                      { href: "/slerfdex", label: "SLERFDEX" },
                      { href: "/history", label: "HISTORY" },
                      { href: "/vote", label: "VOTE" },
                      { href: "/disclaimer", label: "DISCLAIMER" },
                    ].map((e, t) =>
                      (0, r.jsx)(
                        i.default,
                        {
                          href: e.href,
                          children: (0, r.jsx)("div", {
                            className:
                              "headerNew-item p-4 text-center text-2xl ".concat(
                                c(e.href.slice(1) || "home"),
                              ),
                            onClick: () => l(!1),
                            children: e.label,
                          }),
                        },
                        t,
                      ),
                    ),
                  }),
                ],
              }),
              n &&
                (0, r.jsx)("div", {
                  className: "fixed inset-0 bg-black bg-opacity-50",
                  style: { zIndex: 1e3 },
                  onClick: () => l(!1),
                }),
            ],
          });
        }
        var c = a(40135);
        function o(e) {
          let { className: t, pageName: a } = e,
            i = (0, c.i)();
          return (null == i ? void 0 : i.width) &&
            (null == i ? void 0 : i.width) < 800
            ? (0, r.jsx)(l, { className: t, pageName: a })
            : (0, r.jsx)(n, { className: t, pageName: a });
        }
      },
      40135: function (e, t, a) {
        "use strict";
        a.d(t, {
          i: function () {
            return i;
          },
        });
        var r = a(2265);
        function i() {
          let [e, t] = (0, r.useState)({ width: void 0, height: void 0 });
          return (
            (0, r.useEffect)(() => {
              function e() {
                t({ width: window.innerWidth, height: window.innerHeight });
              }
              return (
                window.addEventListener("resize", e),
                e(),
                () => window.removeEventListener("resize", e)
              );
            }, []),
            e
          );
        }
      },
    },
    function (e) {
      e.O(0, [792, 269, 971, 69, 744], function () {
        return e((e.s = 25286));
      }),
        (_N_E = e.O());
    },
  ]);
  