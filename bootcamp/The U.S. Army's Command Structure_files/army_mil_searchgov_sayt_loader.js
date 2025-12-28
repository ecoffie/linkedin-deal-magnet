/**
 * BEFORE UPLOADING CHANGES TO THIS FILE TO PRODUCION:
 * - open the terminal console
 * - navigate to folder containing this file
 * - run "cat js/rv7/main/army_mil_searchgov_sayt_loader.js | openssl dgst -sha384 -binary | openssl base64 -A"
 * - copy the resulting hash (excluding the "%" at the end)
 * - replace it in the analytics blade on us-army-homepage
 * - merge branches, submit for production review, and wait until pushed live
 * - push this file to production and clear cache
 */
var usasearch_config = { siteHandle:"www.army.mil" };
var script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://search.usa.gov/assets/sayt_loader.js";
document.getElementsByTagName("head")[0].appendChild(script);