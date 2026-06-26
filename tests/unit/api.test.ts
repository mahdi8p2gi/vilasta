import { describe, it, expect } from "vitest";
import { serializeProperty, serializeReview, serializeBooking, safeParse, json, error } from "@/lib/api";

describe("safeParse", () => {
  it("parses valid JSON strings", () => { expect(safeParse('["wifi","pool"]', [])).toEqual(["wifi", "pool"]); expect(safeParse('{"key":"value"}', {})).toEqual({ key: "value" }); });
  it("returns fallback for null input", () => { expect(safeParse(null, "fallback")).toBe("fallback"); });
  it("returns fallback for undefined input", () => { expect(safeParse(undefined, "fallback")).toBe("fallback"); });
  it("returns fallback for empty string", () => { expect(safeParse("", "fallback")).toBe("fallback"); });
  it("returns fallback for invalid JSON", () => { expect(safeParse("not-json", "fallback")).toBe("fallback"); expect(safeParse("{invalid", {})).toEqual({}); });
  it("preserves the fallback type", () => { const arr = [1, 2, 3]; expect(safeParse("bad", arr)).toBe(arr); });
});

describe("serializeProperty", () => {
  const raw = { id: "prop-1", title: "ویلا کیش", type: "villa", amenities: '["wifi","pool"]', images: '["url1","url2"]', rules: '["no-smoking"]', host: { id: "host-1", name: "مهدی", avatar: "avatar.jpg", bio: "میزبان", role: "host" } };
  it("parses JSON string fields into arrays", () => { const r = serializeProperty(raw); expect(r.amenities).toEqual(["wifi", "pool"]); expect(r.images).toEqual(["url1", "url2"]); expect(r.rules).toEqual(["no-smoking"]); });
  it("serializes host summary", () => { const r = serializeProperty(raw); expect(r.host).toEqual({ id: "host-1", name: "مهدی", avatar: "avatar.jpg", bio: "میزبان", role: "host" }); });
  it("handles missing host gracefully", () => { expect(serializeProperty({ ...raw, host: null }).host).toBeUndefined(); });
  it("preserves non-JSON fields", () => { const r = serializeProperty(raw); expect(r.id).toBe("prop-1"); expect(r.title).toBe("ویلا کیش"); });
});

describe("serializeReview", () => {
  it("serializes review with user", () => { expect(serializeReview({ id: "rev-1", rating: 5, comment: "عالی", user: { id: "u1", name: "علی", avatar: "a.jpg" } }).user).toEqual({ id: "u1", name: "علی", avatar: "a.jpg" }); });
  it("handles missing user", () => { expect(serializeReview({ id: "rev-1", rating: 4, comment: "خوب", user: null }).user).toBeUndefined(); });
});

describe("serializeBooking", () => {
  it("serializes nested property", () => { const r = serializeBooking({ id: "book-1", guests: 2, property: { id: "p1", title: "ویلا", amenities: '["wifi"]', images: '["img"]', rules: "[]" } }); expect(r.property?.amenities).toEqual(["wifi"]); });
  it("handles missing property", () => { expect(serializeBooking({ id: "book-1", guests: 2, property: null }).property).toBeUndefined(); });
});

describe("json helper", () => {
  it("returns a Response with JSON body", async () => { const r = json({ success: true }); expect(r).toBeInstanceOf(Response); expect(r.status).toBe(200); expect(await r.json()).toEqual({ success: true }); });
  it("accepts custom status code", () => { expect(json({ created: true }, 201).status).toBe(201); });
  it("sets content-type to application/json", () => { expect(json({}).headers.get("content-type")).toBe("application/json"); });
});

describe("error helper", () => {
  it("returns a Response with error message", async () => { const r = error("یافت نشد", 404); expect(r.status).toBe(404); expect(await r.json()).toEqual({ error: "یافت نشد" }); });
  it("defaults to 400 status", () => { expect(error("خطا").status).toBe(400); });
});
