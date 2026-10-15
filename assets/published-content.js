var SalesaidPublished = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // salesaid-admin/publication/runtime.mjs
  var runtime_exports = {};
  __export(runtime_exports, {
    applyHome: () => applyHome,
    applyLanding: () => applyLanding
  });
  var background = (img) => img ? "url(" + img + ")" : void 0;
  function applyHome(base, page, go, published) {
    const out = { ...base, publishedFaqs: [], publishedCases: [], publishedReviews: [], publishedPartners: [], hasPublishedFaqs: false, hasPublishedCases: false, hasPublishedReviews: false, hasPublishedPartners: false, hasPublishedProductTerms: false, publishedProductTerms: [], publishedAbout: false, publishedAboutVision: false, publishedAboutValue: false, originalAboutVision: true, originalAboutValue: true, aboutBackground: "url(assets/img/img-3.png)" };
    if (!published || published.schema_version !== 1) return out;
    const s = published.sections || {}, main = s.main?.[0], about = s.about?.[0];
    if (page === "home" && main) {
      out.hero = { ...base.hero };
      if (main.title) out.hero.lines = main.title.split("\n").map((t, i) => ({ t, c: i ? "#F0414F" : "#fff" }));
      for (const [a, b] of [["desc", "desc"], ["cta", "ctaT"]]) if (main[a]) out.hero[b] = main[a];
      if (main.img) out.hero.bg = background(main.img);
      if (main.link) out.hero.cta = main.link.includes("consult") ? (e) => {
        e?.preventDefault();
        window.location.href = "consult/";
      } : go("home", main.link === "#products" ? "products" : void 0);
    }
    if (s.products) {
      out.svcCards = s.products.map((p, i) => ({ l: p.badge || "PRODUCT " + String(i + 1).padStart(2, "0"), t: p.name, d: p.desc || "", bg: background(p.img) || "none", go: p.route_key === "card" || !p.route_key && p.name === "\uCE74\uB4DC\uB9E4\uCD9C \uC120\uC815\uC0B0" ? go("card") : p.route_key === "fut" || !p.route_key && p.name === "\uC7A5\uB798\uB9E4\uCD9C\uCC44\uAD8C \uC720\uB3D9\uD654" ? go("fut") : (e) => {
        e?.preventDefault();
        window.location.href = "consult/";
      } }));
      const detail = s.products.find((p) => (p.route_key || (p.name === "\uCE74\uB4DC\uB9E4\uCD9C \uC120\uC815\uC0B0" ? "card" : p.name === "\uC7A5\uB798\uB9E4\uCD9C\uCC44\uAD8C \uC720\uB3D9\uD654" ? "fut" : "consult")) === page);
      if (detail) {
        out.publishedProductTerms = [["\uD55C\uB3C4", "limit"], ["\uC218\uC218\uB8CC\xB7\uBE44\uC6A9", "fee"], ["\uC774\uC6A9 \uAE30\uAC04", "term"], ["\uC2EC\uC0AC \uC870\uAC74", "review"]].filter(([, k]) => detail[k]).map(([label, k]) => ({ label, text: detail[k] }));
        out.hasPublishedProductTerms = out.publishedProductTerms.length > 0;
        out.hero = { ...out.hero, desc: detail.desc || out.hero.desc, ...detail.img ? { bg: background(detail.img) } : {} };
        out.pg = { ...base.pg, ...detail.intro ? { defH: detail.name + "\uC774\uB780?", defPs: detail.intro.split("\n").filter(Boolean).map((x) => ({ segs: [{ x, w: "inherit", c: "inherit" }] })) } : {} };
      }
    }
    if (about) {
      out.publishedAbout = true;
      out.aboutPs = about.intro ? about.intro.split("\n").filter(Boolean) : base.aboutPs;
      out.publishedVision = about.vision || "";
      out.publishedValue = about.value || "";
      out.publishedAboutVision = !!about.vision;
      out.originalAboutVision = !about.vision;
      out.publishedAboutValue = !!about.value;
      out.originalAboutValue = !about.value;
      if (about.img) out.aboutBackground = background(about.img);
    }
    for (const section of ["faqs", "cases", "reviews", "partners"]) {
      const title = section[0].toUpperCase() + section.slice(1);
      out["published" + title] = (s[section] || []).map((item) => item.img ? { ...item, bg: background(item.img) } : item);
      out["hasPublished" + title] = page === "home" && Boolean(s[section]?.length);
    }
    return out;
  }
  function applyLanding(base, published) {
    return published?.schema_version === 1 && published.sections?.faqs ? { ...base, t: { ...base.t, faqs: published.sections.faqs } } : base;
  }
  return __toCommonJS(runtime_exports);
})();
