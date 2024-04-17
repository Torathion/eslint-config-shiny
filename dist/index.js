// src/plugins/applyPrettier.ts
import { open } from "node:fs/promises";

// src/constants.ts
var cwd = process.cwd();
var EmptyProfileConfig = {
  apply: {},
  extends: [],
  files: [],
  ignores: [],
  languageOptions: {
    ecmaVersion: "latest",
    globals: {},
    parser: {},
    sourceType: "module"
  },
  linterOptions: {},
  plugins: {},
  rules: [],
  settings: {}
};

// src/plugins/applyPrettier.ts
var prettierRuleDict = {
  arrowParens: "arrow-parens",
  bracketSpacing: "block-spacing",
  endOfLine: "linebreak-style",
  quoteProps: "quote-props",
  semi: "semi",
  singleQuote: "quotes",
  trailingComma: "comma-dangle"
};
var tsOverrides = /* @__PURE__ */ new Set(["block-spacing", "comma-dangle", "quotes", "quote-props"]);
var maxLenDict = {
  printWidth: "code",
  tabWidth: "tabWidth"
};
var numericalRules = /* @__PURE__ */ new Set(["printWidth", "tabWidth"]);
var banWords = /* @__PURE__ */ new Set(["avoid", "false", "none", "preserve"]);
var ignore = /* @__PURE__ */ new Set([
  "plugins",
  "bracketSameLine",
  "parser",
  "editorconfig",
  "embeddedLanguageFormatting",
  "experimentalTernaries",
  "jsxBracketSameLine",
  "jsxSingleQuote",
  "singleAttributePerLine",
  "useTabs",
  "vueIndentScriptAndStyle",
  "htmlWhitespaceSensitivity",
  "proseWrap",
  "insertPragma",
  "requirePragma",
  "filepath",
  "rangeStart",
  "rangeEnd"
]);
var jsPlugin = "@stylistic/js";
var tsPlugin = "@stylistic/ts";
var measureRule = `${jsPlugin}/max-len`;
function handleMeasurements(rules, rule, prettierValue) {
  let value = rules[measureRule];
  if (!value)
    value = rules[measureRule] = [2, {}];
  value[1][maxLenDict[rule]] = prettierValue;
}
function applyAdditionalRules(rules, usedPlugin, rule, isFalseValue) {
  switch (rule) {
    case "semi":
      rules["@stylistic/ts/member-delimiter-style"] = [
        2,
        {
          multiline: { delimiter: isFalseValue ? "none" : "semi" },
          singleline: { delimiter: "semi", requireLast: false }
        }
      ];
      break;
  }
}
function mapToEslint(rules, rule, value) {
  if (typeof value === "boolean")
    value = `${value}`;
  const isFalseValue = banWords.has(value);
  const convertedRule = prettierRuleDict[rule];
  const usedPlugin = tsOverrides.has(convertedRule) ? tsPlugin : jsPlugin;
  let eslintValue = 0;
  switch (convertedRule) {
    case "block-spacing":
      eslintValue = [2, isFalseValue ? "never" : "always"];
      rules[`${usedPlugin}/object-curly-spacing`] = eslintValue;
      break;
    case "arrow-parens":
    case "quote-props":
      eslintValue = isFalseValue ? 0 : [2, value];
      break;
    case "semi":
      eslintValue = [2, isFalseValue ? "never" : "always"];
      break;
    case "quotes":
      eslintValue = [2, isFalseValue ? "double" : "single", { avoidEscape: true }];
      break;
    case "comma-dangle":
      eslintValue = isFalseValue ? [2, "never"] : [2, value === "all" ? "always" : "only-multiline"];
      break;
    case "linebreak-style":
      eslintValue = [2, value === "lf" ? "unix" : "windows"];
      break;
    default:
      throw new Error(`Unknown prettier option ${rule}.`);
  }
  rules[`${usedPlugin}/${convertedRule}`] = eslintValue;
  applyAdditionalRules(rules, usedPlugin, convertedRule, isFalseValue);
}
async function applyPrettier() {
  let file;
  const rules = {};
  try {
    file = await open(`${cwd}/.prettierrc`, "r");
  } catch {
    return rules;
  }
  const json = JSON.parse((await file.readFile()).toString());
  for (const key of Object.keys(json)) {
    if (!ignore.has(key)) {
      if (numericalRules.has(key))
        handleMeasurements(rules, key, json[key]);
      else
        mapToEslint(rules, key, json[key]);
    }
  }
  await file.close();
  return {
    rules: [rules]
  };
}

// src/plugins/findTSConfigs.ts
import { fdir } from "fdir";
async function findTSConfigs() {
  const api = new fdir().withFullPaths().withMaxDepth(1).crawl(cwd);
  const files = await api.withPromise();
  const length = files.length;
  const tsconfigFiles = [];
  let file;
  for (let i = 0; i < length; i++) {
    file = files[i];
    if (file.includes("tsconfig") && file.includes("json"))
      tsconfigFiles.push(file);
  }
  return {
    languageOptions: {
      parserOptions: {
        project: tsconfigFiles
      }
    }
  };
}

// src/plugins/parseGitIgnore.ts
import { open as open2 } from "node:fs/promises";
async function parseGitignore() {
  let file;
  const ignores = [];
  try {
    file = await open2(`${cwd}/.gitignore`, "r");
  } catch {
    return { ignores };
  }
  for await (const pattern of file.readLines()) {
    if (!pattern.length || pattern[0] === "#")
      continue;
    if (pattern[0] === "*" && pattern[1] === ".")
      ignores.push(pattern, `**/${pattern}`);
    else
      ignores.push(pattern, pattern[0] === "!" || pattern[0] === "/" ? `${pattern}/**` : `**/${pattern}/**`);
  }
  await file.close();
  return { ignores: [...new Set(ignores)] };
}

// src/tasks/getConfigs.ts
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// src/utils/isProfile.ts
var Profiles = /* @__PURE__ */ new Set([
  "angular",
  "web",
  "cypress",
  "format",
  "fp",
  "jest",
  "json",
  "node",
  "react",
  "base",
  "test-base",
  "test-angular",
  "test-web",
  "test-react",
  "test-vue",
  "tsdoc",
  "vitest",
  "vue"
]);
function isProfile(value) {
  return Profiles.has(value);
}

// src/utils/ensureArray.ts
function ensureArray(value) {
  if (!value)
    return [];
  return Array.isArray(value) ? value.slice() : [value];
}

// src/utils/mergeArr.ts
function mergeArr(target, source) {
  Array.prototype.push.apply(target, source);
  return target;
}

// src/utils/isEmptyObject.ts
function isEmptyObject(obj) {
  for (const x in obj)
    return false;
  return true;
}

// src/tasks/mergeConfig.ts
function uniqueMerge(arr1, arr2) {
  return [...new Set((arr1 ?? []).slice().concat(arr2 ?? []))];
}
function mergeConfigDeep(o1, o2, directWriteKeys, ignoreKeys = []) {
  const keys = [...new Set(Object.keys(o1).concat(Object.keys(o2)))];
  let o1Prop, o2Prop, value;
  for (const key of keys) {
    if (ignoreKeys.includes(key))
      continue;
    else if (directWriteKeys.includes(key)) {
      o1[key] = o2[key] ?? o1[key];
    } else {
      o1Prop = o1[key];
      o2Prop = o2[key];
      if (Array.isArray(o1Prop))
        value = uniqueMerge(o1Prop, o2Prop);
      else if (typeof o1Prop === "object" && o1Prop !== null)
        value = Object.assign({}, o1Prop, o2Prop);
      else
        value = o2Prop ?? o1Prop;
      o1[key] = value;
    }
  }
}
function mergeLanguageOptions(base, overwriteConfig) {
  if (!overwriteConfig.languageOptions) {
    base.languageOptions = base.languageOptions ?? {};
    return;
  }
  const overwriteLangOpts = overwriteConfig.languageOptions;
  const baseLangOpts = base.languageOptions = base.languageOptions ?? {};
  mergeConfigDeep(baseLangOpts, overwriteLangOpts, ["parser"], ["parserOptions"]);
  if (!overwriteLangOpts.parserOptions) {
    baseLangOpts.parserOptions = baseLangOpts.parserOptions ?? {};
    return;
  }
  mergeConfigDeep(baseLangOpts.parserOptions, overwriteLangOpts.parserOptions, ["parser"]);
}
function removeEmpty(config) {
  const keys = Object.keys(config);
  for (const key of keys) {
    if (Array.isArray(config[key]) && !config[key].length || isEmptyObject(config[key]))
      delete config[key];
  }
}
function mergeConfig(base, overwriteConfig) {
  const newConfig = Object.assign({}, base);
  mergeLanguageOptions(newConfig, overwriteConfig);
  mergeConfigDeep(newConfig, overwriteConfig, ["name"], ["extends", "languageOptions"]);
  removeEmpty(newConfig);
  return newConfig;
}

// src/tasks/getConfigs.ts
var ProfileMap = /* @__PURE__ */ new Map();
async function fetchConfig(c) {
  if (ProfileMap.has(c))
    return ProfileMap.get(c);
  const fetchedConfig = await import(`file://${dirname(fileURLToPath(import.meta.url))}/profiles/${c}.js`);
  ProfileMap.set(c, fetchedConfig.config);
  return fetchedConfig.default ?? fetchedConfig.config;
}
function convertFlatConfig(c) {
  let languageOptions = {};
  if (c.parserOptions)
    languageOptions = { parserOptions: c.parserOptions };
  else if (c.languageOptions)
    languageOptions = c.languageOptions;
  return {
    name: "extended-file",
    files: c.files,
    ignores: c.ignores,
    languageOptions,
    linterOptions: c.linterOptions,
    plugins: c.plugins,
    processor: c.processor ? ensureArray(c.processor) : void 0,
    rules: ensureArray(c.rules),
    settings: c.settings
  };
}
async function handleExtends(extension, fetchedConfigs) {
  let extensionProfile;
  if (typeof extension === "string" && isProfile(extension)) {
    if (ProfileMap.has(extension))
      extensionProfile = ProfileMap.get(extension);
    else {
      const fetchedConfig = await fetchConfig(extension);
      if (Array.isArray(fetchedConfig)) {
        extensionProfile = fetchedConfig.shift();
        mergeArr(fetchedConfigs, fetchedConfig);
      } else
        extensionProfile = fetchedConfig;
    }
  } else if (typeof extension !== "string") {
    extensionProfile = convertFlatConfig(extension);
  }
  return extensionProfile;
}
async function getResolvedConfig(config, allConfigs) {
  if (!config.extends)
    return config;
  const extensions = config.extends.length;
  let mergedConfig = config;
  let extensionProfile;
  for (let i = 0; i < extensions; i++) {
    extensionProfile = await handleExtends(config.extends[i], allConfigs);
    if (!extensionProfile)
      continue;
    if (extensionProfile.extends)
      extensionProfile = await getResolvedConfig(extensionProfile, allConfigs);
    mergedConfig = mergeConfig(extensionProfile, mergedConfig);
    extensionProfile = void 0;
  }
  return mergedConfig;
}
async function resolveExtensions(fetchedConfigs) {
  if (!fetchedConfigs.length)
    return [];
  const resolvedConfigs = [];
  for (let i = 0; i < fetchedConfigs.length; i++) {
    resolvedConfigs.push(await getResolvedConfig(fetchedConfigs[i], fetchedConfigs));
  }
  return resolvedConfigs;
}
async function getConfigs(options) {
  const configs = options.configs;
  const len = configs.length;
  const fetchConfigPromises = new Array(len);
  for (let i = 0; i < len; i++)
    fetchConfigPromises[i] = fetchConfig(configs[i]);
  const fetchedConfigs = await Promise.all(fetchConfigPromises);
  const resolved = await resolveExtensions(fetchedConfigs.flat());
  return resolved;
}

// src/utils/except.ts
function except(array, elementsToRemove) {
  const elLen = elementsToRemove.length;
  if (!elLen || !array.length)
    return array.slice();
  let index;
  for (let i = 0; i < elLen; i++) {
    index = array.indexOf(elementsToRemove[i]);
    if (index > -1)
      array.splice(index, 1);
    if (!array.length)
      return [];
  }
  return array.slice();
}

// src/lists.ts
var VueBanList = ["brace-style", "no-extra-parens", "object-curly-spacing", "quote-props"];
var VueStyleBanList = [
  "array-bracket-newline",
  "array-bracket-spacing",
  "array-element-newline",
  "max-attributes-per-line",
  "singleline-html-element-content-newline"
];
var GeneralBanList = [
  ...VueBanList,
  "arrow-parens",
  "indent",
  "semi",
  "quotes",
  "lines-around-comment",
  "padding-line-between-statements",
  "space-before-function-paren"
];
var EsTsReplaceList = [
  "class-methods-use-this",
  "consistent-return",
  "dot-notation",
  "default-param-last",
  "no-array-constructor",
  "no-loop-func",
  "no-loss-of-precision",
  "no-redeclare",
  "no-throw-literal",
  "no-unused-vars",
  // doesn't understand enums
  "no-unused-expressions",
  "no-use-before-define",
  // confuses type declarations with definitions
  "no-useless-constructor",
  "require-await"
];
var EsStyleReplaceList = [
  "comma-spacing",
  "func-call-spacing",
  "key-spacing",
  "keyword-spacing",
  "lines-between-class-members",
  "no-extra-semi",
  "space-before-blocks",
  "space-infix-ops"
];
var TsStyleReplaceList = ["type-annotation-spacing"];
var StyleVueReplaceList = [
  ...except(EsStyleReplaceList, ["lines-between-class-members", "no-extra-semi", "space-before-blocks"]),
  "block-spacing",
  "func-call-spacing"
];
var DeprecatedStyleList = ["arrow-spacing", "eol-last", "no-trailing-spaces", "space-in-parens"];
var JsxStyleReplaceList = [
  "jsx-closing-bracket-location",
  "jsx-closing-tag-location",
  "jsx-equals-spacing",
  "jsx-indent",
  "jsx-indent-props",
  "jsx-props-no-multi-spaces",
  "jsx-self-closing-comp",
  "jsx-tag-spacing",
  "jsx-wrap-multilines"
];

// src/utils/merge.ts
function merge(...arr) {
  return Object.assign({}, ...arr);
}

// src/utils/hasRecommendedConfig.ts
function hasRecommendedConfig(plugin) {
  return !!plugin.configs.recommended;
}

// src/tasks/apply.ts
function apply(pluginMap) {
  const keys = Object.keys(pluginMap);
  const len = keys.length;
  const config = { plugins: {}, rules: {} };
  let key, plugin;
  for (let i = 0; i < len; i++) {
    key = keys[i];
    plugin = pluginMap[key];
    config.plugins[key] = plugin;
    if (hasRecommendedConfig(plugin))
      config.rules = Object.assign(config.rules, plugin.configs.recommended.rules);
  }
  return config;
}

// src/utils/isConfig.ts
function isConfig(obj) {
  return Object.hasOwn(obj, "rules") || Object.hasOwn(obj, "plugins");
}

// src/tasks/mergeRules.ts
function mergeRules(...rules) {
  const len = rules.length;
  const arr = new Array(len);
  let config;
  for (let i = len - 1; i >= 0; i--) {
    config = rules[i];
    arr[i] = isConfig(config) ? config.rules : config;
  }
  return merge(...arr);
}

// src/utils/handleRuleName.ts
function handleRuleName(pluginTag, rule) {
  return pluginTag === "eslint" ? rule : `${pluginTag}/${rule}`;
}

// src/tasks/ban.ts
function ban(rules, plugins) {
  const ruleLen = rules.length;
  const pluginLen = plugins.length;
  const obj = {};
  let pluginTag, j;
  for (let i = 0; i < pluginLen; i++) {
    pluginTag = plugins[i];
    for (j = 0; j < ruleLen; j++)
      obj[handleRuleName(pluginTag, rules[j])] = 0;
  }
  return obj;
}

// src/tasks/replace.ts
function replace(rules, from, to) {
  const rulesLen = rules.length;
  const fromLen = from.length;
  const toLen = to.length;
  const obj = {};
  let rule, j;
  for (let i = 0; i < rulesLen; i++) {
    rule = rules[i];
    for (j = 0; j < fromLen; j++)
      obj[handleRuleName(from[j], rule)] = 0;
    for (j = 0; j < toLen; j++)
      obj[handleRuleName(to[j], rule)] = 2;
  }
  return obj;
}

// src/tasks/mergeProcessors.ts
function mergeProcessors(processors) {
  const cache = /* @__PURE__ */ new Map();
  const length = processors.length;
  let nameString = `merged-processor:${processors[0].meta?.name ?? "unknown"}`;
  for (let i = 1; i < length; i++) {
    nameString = `${nameString}+${processors[i].meta?.name ?? "unknown"}`;
  }
  return {
    meta: {
      name: nameString
    },
    postprocess(messages, fileName) {
      const counts = cache.get(fileName);
      const newMessages = [];
      cache.delete(fileName);
      let index = 0;
      let msgs;
      for (let i = 0; i < length; i++) {
        msgs = messages.slice(index, index + counts[i]);
        index += counts[i];
        mergeArr(newMessages, processors[i].postprocess?.(msgs, fileName) ?? []);
      }
      return newMessages;
    },
    preprocess(text, fileName) {
      const counts = new Array(length);
      const newProcessors = [];
      cache.set(fileName, counts);
      let res;
      for (let i = 0; i < length; i++) {
        res = processors[i].preprocess?.(text, fileName) ?? [];
        counts[i] = res.length;
        mergeArr(newProcessors, res);
      }
      return newProcessors;
    },
    supportsAutofix: true
  };
}

// src/globs.ts
var ExcludeGlobs = [
  "**/node_modules",
  "**/dist",
  "**/build",
  "**/bin",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",
  "**/bun.lockb",
  "**/output",
  "**/coverage",
  "**/temp",
  "**/.temp",
  "**/tmp",
  "**/.tmp",
  "**/.history",
  "**/.vitepress/cache",
  "**/.nuxt",
  "**/.next",
  "**/.vercel",
  "**/.changeset",
  "**/.idea",
  "**/.vscode",
  "**/.cache",
  "**/.env",
  "**/.output",
  "**/.vite-inspect",
  "**/.yarn",
  "**/CHANGELOG*.md",
  "**/*.min.*",
  "**/LICENSE*",
  "**/__snapshots__",
  "**/*.d.ts"
];
var ExtensionGlob = "?([cm])[jt]s?(x)";
var StyleGlob = "**/*.{c,le,sc,sa}ss";
var SrcGlob = `**/*${ExtensionGlob}`;
var TestGlobs = [
  `**/__tests__/**/*.${ExtensionGlob}`,
  `**/*.spec.${ExtensionGlob}`,
  `**/*.test.${ExtensionGlob}`,
  `**/*.bench.${ExtensionGlob}`,
  `**/*.benchmark.${ExtensionGlob}`
];

// src/tasks/parseProfiles.ts
function isEmptyLanguageOptions(config) {
  const langOpts = config.languageOptions;
  if (!langOpts || isEmptyObject(langOpts))
    return true;
  if (langOpts.parserOptions) {
    const parserOpts = langOpts.parserOptions;
    if (isEmptyObject(parserOpts))
      return true;
    return parserOpts.project && !parserOpts.project.length;
  }
  return isEmptyObject(langOpts.globals);
}
function baseRules() {
  return [
    ban(GeneralBanList, ["eslint", "@typescript-eslint", "@stylistic/ts"]),
    replace(EsTsReplaceList, ["eslint"], ["@typescript-eslint"]),
    replace(EsStyleReplaceList, ["eslint", "@typescript-eslint"], ["@stylistic/ts"]),
    replace(DeprecatedStyleList, ["eslint"], ["@stylistic/js"]),
    replace(TsStyleReplaceList, ["@typescript-eslint"], ["@stylistic/ts"])
  ];
}
function requireArrayProp(config, profile, profiles, prop, hasBase, defaultValue) {
  const profileProp = profile[prop];
  if (profileProp?.length)
    config[prop] = profileProp;
  else if (hasBase)
    config[prop] = profiles[0][prop] ?? defaultValue;
  else
    config[prop] = defaultValue;
}
var defaultFiles = [SrcGlob];
var defaultIgnores = [];
function unique(arr) {
  return Array.isArray(arr) ? [...new Set(arr)] : [];
}
function parseProfiles(profiles, hasBaseConfig2) {
  const length = profiles.length;
  const configs = new Array(length);
  let profile, config, langOpts;
  for (let i = 0; i < length; i++) {
    profile = profiles[i];
    config = profile.apply ? apply(profile.apply) : {};
    requireArrayProp(config, profile, profiles, "files", hasBaseConfig2, defaultFiles);
    requireArrayProp(config, profile, profiles, "ignores", hasBaseConfig2, defaultIgnores);
    if (profile.languageOptions) {
      langOpts = config.languageOptions = profile.languageOptions;
      langOpts.globals = merge(...unique(ensureArray(profile.languageOptions.globals)));
      if (langOpts.parserOptions) {
        langOpts.parserOptions.project = unique(langOpts.parserOptions.project);
      }
    }
    if (isEmptyLanguageOptions(config))
      delete config.languageOptions;
    if (profile.linterOptions)
      config.linterOptions = profile.linterOptions;
    if (profile.settings)
      config.settings = profile.settings;
    if (profile.processor)
      config.processor = mergeProcessors(profile.processor);
    config.plugins = merge(config.plugins ?? {}, profile.plugins ?? {});
    config.rules = mergeRules(config.rules ?? {}, ...profile.rules ?? []);
    if (hasBaseConfig2 && i === 0)
      config.rules = mergeRules(config.rules, ...baseRules());
    configs[i] = config;
  }
  return configs;
}

// src/utils/hasBaseConfig.ts
var baseConfigAndExtensions = /* @__PURE__ */ new Set([
  "base",
  "fp",
  "react",
  "vue",
  "angular",
  "node",
  "test-base",
  "test-angular",
  "test-react",
  "test-vue",
  "test-web"
]);
function hasBaseConfig(opts) {
  let flag = false;
  for (let i = opts.configs.length - 1; i >= 0; i--) {
    if (baseConfigAndExtensions.has(opts.configs[i])) {
      flag = true;
      break;
    }
  }
  return flag;
}

// src/index.ts
var defaults = {
  configs: ["base"],
  eslintignore: true,
  gitignore: true,
  prettier: true
};
async function shiny(options) {
  const opts = Object.assign({}, defaults, options);
  if (!opts.configs.length)
    return [];
  const hasBase = hasBaseConfig(opts);
  const plugins = [getConfigs(opts), findTSConfigs()];
  if (hasBase && opts.prettier)
    plugins.push(applyPrettier());
  if (opts.gitignore)
    plugins.push(parseGitignore());
  const allProfiles = await Promise.all(plugins);
  const profiles = allProfiles.shift();
  profiles.unshift(mergeConfig(profiles.shift(), ...allProfiles));
  return parseProfiles(profiles, hasBase);
}
export {
  DeprecatedStyleList,
  EmptyProfileConfig,
  EsStyleReplaceList,
  EsTsReplaceList,
  ExcludeGlobs,
  ExtensionGlob,
  GeneralBanList,
  JsxStyleReplaceList,
  SrcGlob,
  StyleGlob,
  StyleVueReplaceList,
  TestGlobs,
  TsStyleReplaceList,
  VueBanList,
  VueStyleBanList,
  apply,
  applyPrettier,
  ban,
  cwd,
  shiny as default,
  findTSConfigs,
  merge,
  mergeArr,
  mergeConfig,
  mergeProcessors,
  mergeRules,
  parseGitignore,
  replace
};
//# sourceMappingURL=index.js.map
