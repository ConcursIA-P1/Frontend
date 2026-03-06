import { Alternativa, resolveQuestionImageUrl } from "@/lib/api-client";

const IMAGE_MARKER_REGEX = /\[IMAGEM:\s*([^\]]+)\]/gi;

export function stripImageMarkers(text?: string): string {
  if (!text) return "";
  return text.replace(IMAGE_MARKER_REGEX, "").replace(/\s{2,}/g, " ").trim();
}

export function extractImagePaths(text?: string): string[] {
  if (!text) return [];
  const matches = Array.from(text.matchAll(IMAGE_MARKER_REGEX));
  return matches.map((m) => m[1]?.trim()).filter((v): v is string => Boolean(v));
}

export function buildQuestionImageUrls(question: {
  enunciado?: string;
  imagem_url?: string;
  alternativas?: Alternativa[];
}): string[] {
  const fromEnunciado = extractImagePaths(question.enunciado);
  const fromAlternativas = (question.alternativas || []).flatMap((alt) => {
    return [...extractImagePaths(alt.texto), ...(alt.imagem_url ? [alt.imagem_url] : [])];
  });
  const fromField = question.imagem_url ? [question.imagem_url] : [];

  const urls = [...fromField, ...fromEnunciado, ...fromAlternativas]
    .map((p) => resolveQuestionImageUrl(p))
    .filter((u): u is string => Boolean(u));

  return Array.from(new Set(urls));
}
