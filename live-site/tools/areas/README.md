# Bangalore area list for the plot location picker

`assets/js/areas.js` is generated; edit the files here, then rebuild.

1. `node fetch.mjs india-post-bangalore.json`: downloads every Bangalore Urban/Rural post office
   (pincodes 560001–560300, 562100–562170) from api.postalpincode.in (India Post data).
2. `node build-areas.mjs india-post-bangalore.json areas.json`: tidies names, drops institutional
   offices, adds common locality names (each checked against an official pincode) and spellings.
3. `node -e "const fs=require('fs');fs.writeFileSync('../../assets/js/areas.js',fs.readFileSync('areas-widget.js','utf8').replace('__AREAS__',fs.readFileSync('areas.json','utf8')))"`

To add a locality, add it to `COMMON` in `build-areas.mjs` with its pincode and rebuild.
