import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

function PaginationTest({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  return (<Pagination><PaginationContent>{Array.from({ length: totalPages }, (_, i) => (<PaginationItem key={i}><PaginationLink isActive={i + 1 === currentPage} onClick={() => onPageChange(i + 1)}>{i + 1}</PaginationLink></PaginationItem>))}</PaginationContent></Pagination>);
}

describe("Pagination component", () => {
  it("renders correct number of page links", () => { render(<PaginationTest currentPage={1} totalPages={5} onPageChange={() => {}} />); [1, 2, 3, 4, 5].forEach(n => expect(screen.getByText(String(n))).toBeInTheDocument()); });
  it("highlights the active page", () => { render(<PaginationTest currentPage={3} totalPages={5} onPageChange={() => {}} />); expect(screen.getByText("3").getAttribute("data-active")).toBe("true"); });
  it("marks only the current page as active", () => { const { container } = render(<PaginationTest currentPage={2} totalPages={5} onPageChange={() => {}} />); expect(Array.from(container.querySelectorAll('[data-slot="pagination-link"]')).filter(el => el.getAttribute("data-active") === "true").length).toBe(1); });
  it("calls onPageChange when clicking a page number", async () => { const user = userEvent.setup(); const onPageChange = vi.fn(); render(<PaginationTest currentPage={1} totalPages={5} onPageChange={onPageChange} />); await user.click(screen.getByText("3")); expect(onPageChange).toHaveBeenCalledWith(3); });
  it("renders within a nav element", () => { const { container } = render(<PaginationTest currentPage={1} totalPages={3} onPageChange={() => {}} />); expect(container.querySelector("nav")).toBeInTheDocument(); });
  it("renders page numbers as clickable elements", () => { const { container } = render(<PaginationTest currentPage={1} totalPages={3} onPageChange={() => {}} />); expect(container.querySelectorAll('[data-slot="pagination-link"]').length).toBe(3); });
});
