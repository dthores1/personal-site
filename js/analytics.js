// PostHog product analytics for the personal site.
//
// Loads the PostHog JS SDK, exposes window.trackEvent(event, properties), and
// wires a delegated click listener so most events can be triggered declaratively
// from HTML via `data-track-event="..."` (with extra `data-track-*` attributes
// becoming event properties — kebab-case → snake_case).
//
// Internal / dev sessions are excluded from analytics:
//   - Visit /internal once to set localStorage.is_internal = "true" (persists).
//   - Or add ?internal=true to any URL (also sets the flag).
//   - localhost / 127.0.0.1 always opt out (does not set localStorage).
//   - Clear with: localStorage.removeItem("is_internal")
//
// The PostHog project key is intentionally committed: it's a client-side
// publishable key, visible to anyone who loads the site.
(function () {
  var INTERNAL_STORAGE_KEY = "is_internal";
  var POSTHOG_KEY = "phc_zZ6nDpqujqH7k9P8h6Q8mZ5QSZRJNK6ErM9mYzqzd2TL";
  var POSTHOG_HOST = "https://us.i.posthog.com";

  function isLocalDev() {
    var host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1";
  }

  function isInternalFromStorage() {
    try {
      return localStorage.getItem(INTERNAL_STORAGE_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  function enableInternalMode() {
    try {
      localStorage.setItem(INTERNAL_STORAGE_KEY, "true");
    } catch (e) {
      // private browsing or blocked storage — still opt out this session
    }
  }

  if (window.location.search.indexOf("internal=true") !== -1) {
    enableInternalMode();
  }

  var isInternal = isLocalDev() || isInternalFromStorage();

  // Standard PostHog snippet — initializes window.posthog with a stub that
  // queues calls until the remote SDK loads asynchronously from PostHog.
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    opt_out_capturing_by_default: isInternal
  });

  if (isInternal && posthog.opt_out_capturing) {
    posthog.opt_out_capturing();
  }

  function trackEvent(event, properties) {
    if (isInternal) return;
    if (!window.posthog || !window.posthog.capture) return;
    var payload = {
      app: "personal-site",
      timestamp: new Date().toISOString()
    };
    if (properties) {
      for (var key in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, key)) {
          payload[key] = properties[key];
        }
      }
    }
    window.posthog.capture(event, payload);
  }
  window.trackEvent = trackEvent;

  // Delegated click tracking. Any element (or ancestor of the click target)
  // with `data-track-event="..."` fires that event. Other `data-track-*`
  // attributes are forwarded as properties — e.g. data-track-tab-name="About"
  // → { tab_name: "About" }.
  document.addEventListener("click", function (e) {
    if (isInternal) return;
    var origin = e.target;
    if (!origin || !origin.closest) return;
    var el = origin.closest("[data-track-event]");
    if (!el) return;
    var event = el.getAttribute("data-track-event");
    if (!event) return;
    var props = {};
    var attrs = el.attributes;
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (
        attr.name.indexOf("data-track-") === 0 &&
        attr.name !== "data-track-event"
      ) {
        var key = attr.name
          .slice("data-track-".length)
          .replace(/-/g, "_");
        props[key] = attr.value;
      }
    }
    trackEvent(event, props);
  });
})();
