import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const mockData = [{ id: 1, name: "ویلا کیش", price: "۴٫۵ میلیون", status: "فعال" }, { id: 2, name: "هتل تهران", price: "۲٫۲ میلیون", status: "فعال" }, { id: 3, name: "اقامتگاه یزد", price: "۱٫۴ میلیون", status: "تعلیق" }];

function TableTest() {
  return (<Table><TableHeader><TableRow><TableHead>نام</TableHead><TableHead>قیمت</TableHead><TableHead>وضعیت</TableHead><TableHead>عملیات</TableHead></TableRow></TableHeader><TableBody>{mockData.map(item => (<TableRow key={item.id}><TableCell>{item.name}</TableCell><TableCell>{item.price}</TableCell><TableCell>{item.status}</TableCell><TableCell><button onClick={() => {}}>ویرایش</button><button onClick={() => {}}>حذف</button></TableCell></TableRow>))}</TableBody></Table>);
}

describe("Table component", () => {
  it("renders all header cells", () => { render(<TableTest />); expect(screen.getByText("نام")).toBeInTheDocument(); expect(screen.getByText("قیمت")).toBeInTheDocument(); expect(screen.getByText("وضعیت")).toBeInTheDocument(); expect(screen.getByText("عملیات")).toBeInTheDocument(); });
  it("renders all data rows", () => { render(<TableTest />); expect(screen.getByText("ویلا کیش")).toBeInTheDocument(); expect(screen.getByText("هتل تهران")).toBeInTheDocument(); expect(screen.getByText("اقامتگاه یزد")).toBeInTheDocument(); });
  it("renders action buttons for each row", () => { render(<TableTest />); expect(screen.getAllByText("ویرایش").length).toBe(3); expect(screen.getAllByText("حذف").length).toBe(3); });
  it("renders prices in Persian format", () => { render(<TableTest />); expect(screen.getByText("۴٫۵ میلیون")).toBeInTheDocument(); });
  it("action buttons are clickable", async () => { const user = userEvent.setup(); render(<TableTest />); await user.click(screen.getAllByText("ویرایش")[0]); expect(screen.getAllByText("ویرایش")[0]).toBeInTheDocument(); });
  it("has proper table semantic structure", () => { const { container } = render(<TableTest />); expect(container.querySelector("table")).toBeInTheDocument(); expect(container.querySelector("thead")).toBeInTheDocument(); expect(container.querySelector("tbody")).toBeInTheDocument(); expect(container.querySelectorAll("tr").length).toBe(4); });
});
