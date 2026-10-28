/* Plot location picker: turns every "Location" field into a searchable list of
   Bangalore areas. Visitors can pick an area, search by area name or pincode,
   or keep whatever they typed (a full address) if their area isn't listed.
   Area list: India Post post offices for Bangalore Urban and Rural, plus
   common locality names, each with its official pincode. */
(function () {
  "use strict";
  var AREAS = [["Achitnagar","560107"],["Adugodi","560030"],["Agara","560034"],["Agram","560007"],["Akshayanagar","560068","akshaya nagar"],["Alurduddanahalli","562110"],["Aluru","562162"],["Amruthahalli","560092"],["Anand Nagar","560024"],["Anekal","562106"],["Anjanapura","560108"],["Anneshwara","562110"],["Aradeshanahalli","562110"],["Arakere","562163"],["Arasinakunte","562123"],["Arebommnahalli","562111"],["Arekere","560076"],["Ashok Nagar","560050"],["Attibele","562107"],["Attur","560064"],["Austin Town","560047"],["Avathi","562164"],["Bagalgunte","560073"],["Bagalur","562149"],["Baginigere","562131"],["Banashankari","560050","bsk bsk"],["Banashankari 2nd Stage","560070"],["Banashankari 3rd Stage","560085"],["Banaswadi","560043"],["Banavadi","562127"],["Bandikodigehalli","562149"],["Bangalore City (Majestic)","560002","majestic kempegowda bus stand"],["Bannerghatta","560083"],["Bannerghatta Road","560076"],["Bapagrama","560091"],["Baragenahalli","562111"],["Basavanagudi","560004"],["Basaveshwaranagar","560079"],["Basettihalli","562163"],["Begur","560068"],["Begur","562122"],["Bellandur","560103"],["Bendiganahalli","562129"],["Benson Town","560046"],["Bestamaranahalli","562106"],["Bettahalsur","562157"],["Bettakote","562129"],["Bhattarahalli","560049"],["Bidalur","562164"],["Bidaraguppe","562107"],["Bidrahalli","560049"],["Bijjawara","562164"],["Billanakote","562111"],["Biskur","562131"],["Bolare","560082"],["Bommanahalli","560068"],["Bommasandra","560099"],["Bommasandra Industrial Estate","560099"],["Brookefield","560037"],["BTM Layout 1st Stage","560029","btm"],["BTM Layout 2nd Stage","560076","btm"],["Budigere","562129"],["Budigere Cross","560049"],["Budihal","562123"],["Byagadadenahalli","562106"],["Byatarayanapura","560092"],["Byatha","560089"],["Bylakere","562127"],["Bylanarasapura","562122"],["Carmelram","560035"],["Chamarajasagara","562120"],["Chamarajpet","560018"],["Chandapura","560081"],["Chandapura","560099"],["Chandra Layout","560040"],["Channarayapatna","562135"],["Chickpet","560053"],["Chikkabanavara","560090"],["Chikkabidarkal","560073"],["Chikkajala","562157"],["Chikkalasandra","560061"],["Chikkanahalli","562130"],["Chudenapura","560060"],["Chunchanakuppe","562130"],["Cooke Town","560084"],["Cox Town","560005"],["CV Raman Nagar","560093"],["Dasanapura","562162"],["Dasarahalli (Srinagar)","560050"],["Deepanjalinagar","560026"],["Devanagundi","560067"],["Devanahalli","562110"],["Devarahosahalli","562111"],["Devasandra","560036"],["Dobbespet","562111"],["Doddabele","562132"],["Doddagattiganabbe","562114"],["Doddagubbi","560077"],["Doddajala","562157"],["Doddakallasandra","560062"],["Doddamudigere","562131"],["Doddanallala","562114"],["Doddanekkundi","560037"],["Doddasanne","562110"],["Doddasomanahalli","562131"],["Doddatumkur","562163"],["Domlur","560071"],["Dommasandra","562125"],["Dooravani Nagar","560016"],["Dr. Ambedkar Veedhi","560001"],["Dr. Shivarama Karanth Nagar","560077"],["Ejipura","560047"],["Electronic City","560100"],["Electronic City Phase 1","560100","ecity e-city"],["Electronic City Phase 2","560100","ecity e-city"],["EPIP","560066"],["Fraser Town","560005"],["Frazer Town","560005","fraser town"],["G.K.V.K.","560065"],["Gangonahalli","562131"],["Gaviopuram Extension","560019"],["Gayathrinagar","560021"],["Girinagar","560085"],["Gollahalli","562123"],["Gottigere","560083"],["Guddanahalli","562106"],["Gudemaranahalli","562127"],["Gunjur","560087"],["HAL 2nd Stage","560008"],["Hampinagar","560104"],["Handenahalli","562125"],["Haragadde","560105"],["Haralur Road","560102","harlur"],["Harohalli","562135"],["Hasigala","562114"],["HBR Layout","560043"],["Hebbagodi","560099"],["Hebbal","560024"],["Hebbal Agricultural Farm","560024"],["Hebbal Kempapura","560024"],["Hegde Nagar","560077"],["Hegganahalli","562110"],["Heggunda","562111"],["Hennagara","560105"],["Hennur","560043"],["Herohalli","560091"],["Hessarghatta","560088"],["Hessarghatta Lake","560089"],["Hindaganala","562122"],["HKP Road","560051"],["Hongasandra","560068"],["Honnasandra","562123"],["Hoodi","560048"],["Horamavu","560043"],["Hoskote","562114"],["Hoskote Indl. Area","562114"],["Hosur Road","560068"],["HRBR Layout","560043"],["HSR Layout","560102","hsr sector"],["Hulimangala","560105"],["Hulimavu","560076"],["Hullegowdanahalli","562162"],["Hullenahalli","562131"],["Hunasamaranahalli","562157"],["Huskur","560099"],["Huskur","562162"],["Ibasapura","562129"],["Indalavadi","562106"],["Indiranagar","560038"],["ITPL","560066","whitefield"],["Jadigenahalli","562114"],["Jakkanahalli","562123"],["Jakkur","560064"],["Jalahalli","560013"],["Jalahalli East","560014"],["Jalahalli West","560015"],["Jalige","562110"],["Jayamahal Road","560046"],["Jayanagar","560041"],["Jayanagar 3rd Block","560011"],["Jayanagar 4th Block","560011"],["Jayanagar 9th Block","560069"],["Jayanagar East","560069"],["Jayanagar West","560070"],["JC Nagar","560006"],["Jeevan Bhima Nagar","560075"],["Jigani","560105"],["Jodidasarahalli","562114"],["JP Nagar","560078"],["JP Nagar 1st Phase","560078","jayaprakash nagar"],["JP Nagar 2nd Phase","560078","jayaprakash nagar"],["JP Nagar 3rd Phase","560078"],["JP Nagar 4th Phase","560078","jayaprakash nagar"],["JP Nagar 5th Phase","560078","jayaprakash nagar"],["JP Nagar 6th Phase","560078","jayaprakash nagar"],["JP Nagar 7th Phase","560078","jayaprakash nagar"],["JP Nagar 8th Phase","560076"],["JP Nagar 9th Phase","560062","jayaprakash nagar"],["K.Satyavara","562122"],["Kadabagere","562130"],["Kadugodi","560067"],["Kadugodi Extension","560067"],["Kagalipura","560082"],["Kaggadasapura","560093"],["Kakolu","560089"],["Kalkere","560083"],["Kalkunte","560067"],["Kallubalu","560105"],["Kalyan Nagar","560043"],["Kamakshipalya","560079"],["Kambalu","562111"],["Kammanahalli","560084"],["Kanakapura Road","560062"],["Kannamangala","560067"],["Kannamangala","562110"],["Kannur","562149"],["Karahalli","562164"],["Kasavanahalli","560035"],["Kathriguppe","560085"],["Kattigenahalli","562114"],["Kaval Byrasandra","560032"],["Kembliganahalli","562114"],["Kengeri","560060"],["Kengeri Satellite Town","560060"],["KG Road","560009"],["KHB Colony","560079"],["Kithanahalli","562130"],["Kodigehalli","560091"],["Kodigehalli","560092"],["Kodigehalli","560112"],["Koira","562164"],["Kollalagatta","562132"],["Kollathur","562114"],["Konanakunte","560062"],["Konnagatta","562163"],["Koramangala","560034","kormangala"],["Koramangala 1st Block","560034"],["Koramangala 4th Block","560034"],["Koramangala 5th Block","560095"],["Koramangala 6th Block","560095"],["Koramangala 8th Block","560095"],["Korati","562122"],["Kothanur","560077"],["KR Puram","560036","krishnarajapuram k r puram"],["KR Puram Railway Station","560016"],["Krishnarajapuram","560036","kr puram k r puram"],["Kudlu Gate","560068"],["Kugur","562125"],["Kuluvanahalli","562111"],["Kumaraswamy Layout","560078"],["Kumbalagodu","560074"],["Kumbalahalli","562114"],["Kumbalgodu Gollahalli","560074"],["Kundalahalli","560037"],["Kundana","562110"],["Laggere","560058"],["Lakkenahalli","562127"],["Lakkondanahalli","562114"],["Lakkur","562111"],["Lakshmipura","562162"],["Lingarajapuram","560084"],["Madalakote","562123"],["Madanayakanahalli","562162"],["Madavara","562162"],["Madhavan Park","560011"],["Madigondanahalli","562127"],["Madivala","560068","madiwala"],["Madiwala","560068","madivala"],["Magadi Road","560023"],["Mahadevapura","560048"],["Mahadevapura","562123"],["Mahalakshmi Layout","560086"],["Makali","562162"],["Mallarabanavadi","562123"],["Mallathahalli","560056"],["Malleshwaram","560003","malleswaram"],["Malleswaram","560003","malleshwaram"],["Malleswaram West","560055"],["Mandibele","562135"],["Mandigere","562123"],["Manne","562132"],["Manniganahalli","562127"],["Maralakunte","562111"],["Marathahalli","560037"],["Marathahalli Colony","560037"],["Marikuppe","562127"],["Marsur","562106"],["Maruthi Sevanagar","560033"],["Mathahalli","562162"],["Mathikere","560054"],["Mavalli","560004"],["Mayasandra","562107"],["Medimallasandra","560067"],["MG Road","560001"],["Mico Layout","560076"],["Motagondanahalli","562127"],["Mount St Joseph","560076"],["Mugabala","562114"],["Mullahalli","562119"],["Mundur","560049"],["Murugeshpalya","560017"],["Muthanallur","560099"],["Muthusandra","560087"],["Mylanahalli","562123"],["Mysore Road","560026"],["Naduvathi","560067"],["NAGADENAHALLI","562163"],["Nagarbhavi","560072"],["Nagasandra","560073"],["Nandagudi","562122"],["Nandini Layout","560096"],["Narasandra","562127"],["Narasipura","562111"],["Narayanapura","562135"],["Nayandahalli","560039"],["Nelakadiranahalli","560073"],["Nelamangala","562123"],["Nelavagilu","562122"],["Neralur","562107"],["Neriga","562125"],["New Thippasandra","560075"],["Niduvanda","562132"],["Obalapura","562132"],["Old Airport Road","560017"],["Padmanabhanagar","560070"],["Palace Guttahalli","560003"],["Pampamahakavi Road","560004"],["Panathur","560103"],["Peenya","560058"],["Peenya Dasarahalli","560057"],["Peenya I Stage","560058"],["Peenya Small Industries","560058"],["Ragihalli","560083"],["Rajajinagar","560010"],["Rajajinagar 4th Block","560010"],["Rajanakunte","560064"],["Rajarajeshwari Nagar","560098","rr nagar"],["Ramamurthy Nagar","560016"],["Ramesh Nagar","560037"],["Ramohalli","560074"],["Reddihalli","562129"],["Richmond Town","560025"],["RMV 2nd Stage","560094"],["RT Nagar","560032"],["Sadahalli","562110"],["Sadashivanagar","560080"],["Sahakara Nagar","560092"],["Sakalavara","560083"],["Samandur","562106"],["Samethanahalli","560067"],["Sampangi Rama Nagar","560027"],["Sankighatta","562131"],["Sarjapur Road","560035","sarjapura road"],["Sarjapura","562125","sarjapur"],["Seshadripuram","560020"],["Shanti Nagar","560027"],["Shivagange","562111"],["Shivajinagar","560051"],["Shivakote","560089"],["Shivanapura","562122"],["Shivanapura","562162"],["Shivapura","562163"],["Sidihoskote","562106"],["Silvepura","560090"],["Singanayakanahalli","560064"],["Singasandra","560068"],["Sivan Chetty Gardens","560042"],["Soladevanahalli","562130"],["Solur","562127"],["Somanhalli","560082"],["Sondekoppa","562130"],["Srirampuram","560021"],["St. Thomas Town","560084"],["Subramanyapura","560061"],["Sulebele","562129"],["Sulikere","560060"],["Talaghattapura","560109","thalaghattapura"],["Tarabanahalli","560090"],["Tarahunise","562157"],["Taralu","560082"],["Tavarekere","560029"],["Tavarekere","562122"],["Tavarekere","562130"],["Teppadabeguru","562123"],["Thalaghattapura","560109"],["Thammanayakanahalli","562106"],["Thanisandra","560077"],["Thataguni","560082"],["Thattekuppe","560082"],["Thindlu","560097"],["Thippasandra","562131"],["Thyagaraja Nagar","560004","tyagaraja t nagar"],["Thyagaraja Nagar","560028","tyagaraja t nagar"],["Thyagaraja Nagar","560070","tyagaraja t nagar"],["Tilaknagar","560041"],["Tumkur Road","560022"],["Tyamagondlu","562132"],["Udaypura","560082"],["Udukunte","562127"],["Uganavadi","562110"],["Ullal Upanagar","560110"],["Ulsoor","560008","halasuru"],["Ulsoor (Halasuru)","560008","halasuru ulsoor"],["Uttarahalli","560061"],["Vagata Agrahara","562114"],["Vanakanahalli","562106"],["Varthur","560087","vartur"],["Vartur","560087","varthur"],["Vasanth Nagar","560001"],["Vasanth Nagar","560052"],["Veerapura","562163"],["Venkatagirikote","562164"],["Venkateshapura","560045"],["Vidyanagara","562157"],["Vidyaranyapura","560097"],["Vijayanagar","560040"],["Vijayanagar East","560040"],["Vijayapaura","562135"],["Vimanapura","560017"],["Vishwanathapura","562110"],["Vivek Nagar","560047"],["Vyalikaval Extn","560003"],["West of Chord Road 2nd Stage","560086"],["Whitefield","560066"],["Wilson Garden","560027"],["Yadavanahalli","562107"],["Yelachenahalli","560078"],["Yelahanka","560064"],["Yelahanka New Town","560064"],["Yelahanka Satellite Town","560064"],["Yelekyathanahalli","562111"],["Yeliyur","562110"],["Yennegere","562127"],["Yentiganahalli","562123"],["Yeshwanthpur","560022","yesvantpur yeshwantpur"],["Yeshwanthpur Bazaar","560022"]];

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
