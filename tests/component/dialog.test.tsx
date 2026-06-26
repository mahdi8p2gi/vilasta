import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

function DialogTest({ onClose }: { onClose?: () => void }) {
  return (<Dialog defaultOpen><DialogTrigger asChild><button>باز کردن</button></DialogTrigger><DialogContent showCloseButton={false}><DialogTitle>عنوان مودال</DialogTitle><DialogDescription>توضیحات مودال</DialogDescription><div><p>محتوای مودال</p><DialogClose asChild><button onClick={onClose}>بستن</button></DialogClose></div></DialogContent></Dialog>);
}

describe("Dialog (Modal) component", () => {
  it("renders dialog content when open", () => { render(<DialogTest />); expect(screen.getByText("عنوان مودال")).toBeInTheDocument(); expect(screen.getByText("محتوای مودال")).toBeInTheDocument(); });
  it("renders dialog description", () => { render(<DialogTest />); expect(screen.getByText("توضیحات مودال")).toBeInTheDocument(); });
  it("calls onClose when close button is clicked", async () => { const user = userEvent.setup(); const onClose = vi.fn(); render(<DialogTest onClose={onClose} />); await user.click(screen.getByText("بستن")); expect(onClose).toHaveBeenCalled(); });
  it("has proper ARIA attributes", () => { render(<DialogTest />); expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby"); });
});
