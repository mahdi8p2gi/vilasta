import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RatingStars } from "@/components/shared/rating-stars";

describe("RatingStars component", () => {
  it("renders 5 star icons", () => { const { container } = render(<RatingStars rating={4.5} />); expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(5); });
  it("displays the numeric rating value", () => { render(<RatingStars rating={4.7} showValue />); expect(screen.getByText("۴.۷")).toBeInTheDocument(); });
  it("hides the numeric value when showValue is false", () => { render(<RatingStars rating={4.7} showValue={false} />); expect(screen.queryByText("۴.۷")).not.toBeInTheDocument(); });
  it("displays review count when provided", () => { render(<RatingStars rating={4.5} reviewCount={62} />); expect(screen.getByText(/۶۲/)).toBeInTheDocument(); });
  it("displays rating label when showLabel is true", () => { render(<RatingStars rating={4.9} showLabel />); expect(screen.getByText("عالی")).toBeInTheDocument(); });
});
