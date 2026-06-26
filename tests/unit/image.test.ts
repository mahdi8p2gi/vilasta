import { describe, it, expect } from "vitest";
import { sizedImage, cardImage, detailImage, heroImage, blurImage, solidBlur, SHIMMER_BLUR } from "@/lib/image";

describe("sizedImage", () => {
  it("appends width and quality params to a bare URL", () => { const r = sizedImage("https://images.unsplash.com/photo-123", 640); expect(r).toContain("w=640"); expect(r).toContain("q=75"); expect(r).toContain("auto=format"); expect(r).toContain("fit=crop"); });
  it("uses default quality of 75", () => { expect(sizedImage("https://example.com/img.jpg", 300)).toContain("q=75"); });
  it("accepts custom quality", () => { expect(sizedImage("https://example.com/img.jpg", 300, 50)).toContain("q=50"); });
  it("strips existing query params", () => { expect(sizedImage("https://example.com/img.jpg?w=100&q=10", 640)).toBe("https://example.com/img.jpg?w=640&q=75&auto=format&fit=crop"); });
  it("returns empty string for empty input", () => { expect(sizedImage("", 640)).toBe(""); });
  it("preserves the base URL path", () => { expect(sizedImage("https://cdn.example.com/path/to/image.png", 640).startsWith("https://cdn.example.com/path/to/image.png?")).toBe(true); });
});

describe("cardImage", () => { it("produces 640px width at 70 quality", () => { const r = cardImage("https://example.com/img.jpg"); expect(r).toContain("w=640"); expect(r).toContain("q=70"); }); });
describe("detailImage", () => { it("produces 1200px width at 78 quality", () => { const r = detailImage("https://example.com/img.jpg"); expect(r).toContain("w=1200"); expect(r).toContain("q=78"); }); });
describe("heroImage", () => { it("produces 1920px width at 80 quality", () => { const r = heroImage("https://example.com/img.jpg"); expect(r).toContain("w=1920"); expect(r).toContain("q=80"); }); });
describe("blurImage", () => { it("produces 8px width at 20 quality", () => { const r = blurImage("https://example.com/img.jpg"); expect(r).toContain("w=8"); expect(r).toContain("q=20"); }); });

describe("solidBlur", () => {
  it("returns a data URL with SVG content", () => { expect(solidBlur("e5e7eb").startsWith("data:image/svg+xml;base64,")).toBe(true); });
  it("uses the provided hex color in the SVG", () => { const d = Buffer.from(solidBlur("abcdef").split(",")[1], "base64").toString(); expect(d).toContain("#abcdef"); });
  it("uses default color when no argument", () => { const d = Buffer.from(solidBlur().split(",")[1], "base64").toString(); expect(d).toContain("#e5e7eb"); });
});

describe("SHIMMER_BLUR", () => {
  it("is a valid base64 data URL", () => { expect(SHIMMER_BLUR.startsWith("data:image/svg+xml;base64,")).toBe(true); });
  it("decodes to valid SVG", () => { const d = Buffer.from(SHIMMER_BLUR.split(",")[1], "base64").toString(); expect(d).toContain("<svg"); expect(d).toContain("</svg>"); });
});
