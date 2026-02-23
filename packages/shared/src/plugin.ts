import { z } from "zod";

const contentTypeSchema = z.enum(["anime", "comic"]);
const methodSchema = z.enum(["GET", "POST"]);

const selectorGroupSchema = z.object({
  container: z.string().min(1),
  item: z.string().min(1),
  title: z.string().min(1),
  url: z.string().min(1),
  cover: z.string().min(1).optional(),
  latest: z.string().min(1).optional(),
});

const detailSelectorsSchema = z.object({
  title: z.string().min(1),
  synopsis: z.string().min(1),
  cover: z.string().min(1).optional(),
  genres: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  chapterContainer: z.string().min(1).optional(),
  chapterItem: z.string().min(1).optional(),
  chapterTitle: z.string().min(1).optional(),
  chapterUrl: z.string().min(1).optional(),
});

const searchSchema = z.object({
  endpoint: z.string().min(1),
  method: methodSchema.default("GET"),
  queryParam: z.string().min(1).default("q"),
  selectors: selectorGroupSchema,
});

const rateLimitSchema = z.object({
  requestsPerMinute: z.number().int().min(1).max(240),
});

const parserRulesSchema = z.object({
  list: selectorGroupSchema,
  detail: detailSelectorsSchema,
  search: searchSchema,
  watchRead: z.object({
    container: z.string().min(1),
    item: z.string().min(1),
    label: z.string().min(1),
    url: z.string().min(1),
  }),
});

const pluginManifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(80),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  enabled: z.boolean().default(true),
  baseUrl: z.string().url(),
  contentTypes: z.array(contentTypeSchema).min(1),
  language: z.string().min(2).max(10).default("vi"),
  rateLimit: rateLimitSchema,
  parserRules: parserRulesSchema,
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;
export type ParserRules = z.infer<typeof parserRulesSchema>;
export type SelectorGroup = z.infer<typeof selectorGroupSchema>;

export const pluginManifestValidator = pluginManifestSchema;

export function validatePluginManifest(input: unknown) {
  return pluginManifestSchema.safeParse(input);
}
