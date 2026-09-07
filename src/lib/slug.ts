export function createSlug(
  value: string
) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(
      /[^\p{L}\p{N}-]+/gu,
      ""
    )
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}