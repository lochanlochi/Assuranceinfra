/* Plot location picker: turns every "Location" field into a searchable list of
   Bangalore areas. Visitors can pick an area, search by area name or pincode,
   or keep whatever they typed (a full address) if their area isn't listed.
   Area list: India Post post offices for Bangalore Urban and Rural, plus
   common locality names, each with its official pincode. */
(function () {
  "use strict";
  var AREAS = __AREAS__;

  var norm = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); };
  var index = AREAS.map(function (a) {
    return { name: a[0], pin: a[1], label: a[0] + ", " + a[1], key: norm(a[0]), alias: norm(a[2] || "") };
  });

  function search(q) {
    var t = norm(q);
    if (!t) return index;
    var digits = t.replace(/\D/g, "");
    if (/^\d+$/.test(t.replace(/\s/g, ""))) {
      return index.filter(function (a) { return a.pin.indexOf(digits) === 0; });
    }
    var words = t.split(" ");
    var collect = function (matchWord) {
      var scored = [];
      index.forEach(function (a) {
        if (!words.every(function (w) { return matchWord(a, w); })) return;
        var score = a.key.indexOf(t) === 0 ? 0 : (" " + a.key).indexOf(" " + words[0]) !== -1 ? 1 : 2;
        scored.push([score, a]);
      });
      return scored;
    };
    // Each typed word must start a word of the name or alias ("7" matches "7th"),
    // or start the pincode once 3+ digits are typed; fall back to anywhere-in-name.
    var scored = collect(function (a, w) {
      return (" " + a.key + " " + a.alias).indexOf(" " + w) !== -1 || (w.length >= 3 && /^\d+$/.test(w) && a.pin.indexOf(w) === 0);
    });
    if (!scored.length) scored = collect(function (a, w) { return (a.key + " " + a.alias).indexOf(w) !== -1; });
    scored.sort(function (x, y) { return x[0] - y[0] || x[1].name.localeCompare(y[1].name); });
    return scored.map(function (s) { return s[1]; });
  }

  var uid = 0;
  function enhance(input) {
    if (input.dataset.areaPicker) return;
    input.dataset.areaPicker = "1";
    var id = "area-list-" + (++uid);
    var field = input.closest(".field") || input.parentNode;
    field.classList.add("area-field");

    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", id);
    input.setAttribute("autocomplete", "off");
    input.setAttribute("placeholder", "Search area or pincode");

    var wrap = document.createElement("div");
    wrap.className = "area-wrap";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    var list = document.createElement("ul");
    list.className = "area-list";
    list.id = id;
    list.setAttribute("role", "listbox");
    list.hidden = true;
    wrap.appendChild(list);

    var hint = document.createElement("small");
    hint.className = "area-hint";
    hint.textContent = "Pick your area, or type your pincode or full address.";
    field.appendChild(hint);

    var items = [], active = -1, LIMIT = 60;

    function render() {
      var q = input.value;
      var matches = search(q);
      list.innerHTML = "";
      items = [];
      var shown = matches.slice(0, LIMIT);
      shown.forEach(function (a) {
        var li = document.createElement("li");
        li.setAttribute("role", "option");
        li.id = id + "-" + items.length;
        li.innerHTML = "<span></span><b></b>";
        li.firstChild.textContent = a.name;
        li.lastChild.textContent = a.pin;
        li.dataset.value = a.label;
        items.push(li);
        list.appendChild(li);
      });
      if (matches.length > LIMIT) {
        var more = document.createElement("li");
        more.className = "area-more";
        more.textContent = (matches.length - LIMIT) + " more areas, keep typing to narrow down";
        list.appendChild(more);
      }
      var typed = q.trim();
      var exact = matches.some(function (a) { return norm(a.label) === norm(typed) || norm(a.name) === norm(typed); });
      if (typed && !exact) {
        var own = document.createElement("li");
        own.setAttribute("role", "option");
        own.id = id + "-" + items.length;
        own.className = "area-own";
        own.dataset.value = typed;
        own.textContent = matches.length
          ? "Use “" + typed + "” as typed"
          : "Not listed? Use “" + typed + "” as my address";
        items.push(own);
        list.appendChild(own);
      }
      active = -1;
      list.hidden = items.length === 0;
      input.setAttribute("aria-expanded", String(!list.hidden));
      input.removeAttribute("aria-activedescendant");
    }

    function highlight(i) {
      if (active > -1 && items[active]) items[active].classList.remove("is-active");
      active = i;
      if (i > -1 && items[i]) {
        items[i].classList.add("is-active");
        input.setAttribute("aria-activedescendant", items[i].id);
        items[i].scrollIntoView({ block: "nearest" });
      }
    }

    function close() {
      list.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      active = -1;
    }

    function choose(li) {
      input.value = li.dataset.value;
      close();
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    input.addEventListener("focus", render);
    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (list.hidden) render();
        highlight(Math.min(active + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        highlight(Math.max(active - 1, 0));
      } else if (e.key === "Enter" && !list.hidden && active > -1) {
        e.preventDefault();
        choose(items[active]);
      } else if (e.key === "Escape" || e.key === "Tab") {
        close();
      }
    });
    // mousedown so the choice lands before the input loses focus
    list.addEventListener("mousedown", function (e) {
      var li = e.target.closest("li[role=option]");
      if (!li) return;
      e.preventDefault();
      choose(li);
    });
    input.addEventListener("blur", function () { setTimeout(close, 120); });
  }

  function init() {
    document.querySelectorAll('input[name="Location"]').forEach(enhance);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
