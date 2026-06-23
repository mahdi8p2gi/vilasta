"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Star, MessageSquarePlus } from "lucide-react";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitReview } from "@/hooks/use-api";
import { useAppStore } from "@/store/app-store";
import { toPersianDigits } from "@/lib/persian";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  comment: z.string().min(10, "حداقل ۱۰ کاراکتر بنویسید").max(500),
});

type FormData = z.infer<typeof schema>;

const categories = [
  { key: "cleanliness", label: "تمیزی" },
  { key: "communication", label: "ارتباط" },
  { key: "checkIn", label: "ورود" },
  { key: "accuracy", label: "دقت" },
  { key: "location", label: "موقعیت" },
  { key: "value", label: "ارزش" },
] as const;

export function ReviewWriteModal({
  open,
  onClose,
  propertyId,
  propertyTitle,
}: {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
}) {
  const user = useAppStore((s) => s.user);
  const submitReview = useSubmitReview();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [catRatings, setCatRatings] = useState<Record<string, number>>({});

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { comment: "" },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error("ابتدا وارد شوید");
      return;
    }
    if (rating === 0) {
      toast.error("لطفاً امتیاز کلی را انتخاب کنید");
      return;
    }
    try {
      await submitReview.mutateAsync({
        propertyId,
        userId: user.id,
        rating,
        comment: data.comment,
        ...Object.fromEntries(
          categories.map((c) => [c.key, catRatings[c.key] || rating])
        ),
      });
      toast.success("نظر شما با موفقیت ثبت شد 🎉");
      form.reset();
      setRating(0);
      setCatRatings({});
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-lg overflow-hidden p-0 gap-0">
        <DialogTitle className="sr-only">ثبت نظر</DialogTitle>
        <DialogDescription className="sr-only">
          نظر خود را درباره {propertyTitle} بنویسید
        </DialogDescription>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-l from-primary/8 to-transparent px-5 py-4">
          <div>
            <h2 className="text-lg font-bold">ثبت نظر</h2>
            <p className="text-xs text-muted-foreground">{propertyTitle}</p>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent" aria-label="بستن">
              ✕
            </Button>
          </DialogClose>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-5">
          {/* Overall rating */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">امتیاز کلی</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`${toPersianDigits(i)} ستاره`}
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors",
                      (hoverRating || rating) >= i ? "text-gold" : "text-muted-foreground/30"
                    )}
                    fill="currentColor"
                  />
                </button>
              ))}
              <span className="mr-2 text-sm font-medium">
                {rating > 0 ? `${toPersianDigits(rating)} از ۵` : "انتخاب کنید"}
              </span>
            </div>
          </div>

          {/* Category ratings */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">امتیاز جزئیات</Label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div key={cat.key} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                  <span className="text-xs text-muted-foreground">{cat.label}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCatRatings((p) => ({ ...p, [cat.key]: i }))}
                        className="p-0.5"
                      >
                        <Star
                          className={cn(
                            "h-3.5 w-3.5 transition-colors",
                            (catRatings[cat.key] || 0) >= i ? "text-gold" : "text-muted-foreground/30"
                          )}
                          fill="currentColor"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">نظر شما</Label>
            <Textarea
              placeholder="تجربه خود را از این اقامتگاه بنویسید..."
              className="min-h-[120px] resize-none"
              {...form.register("comment")}
            />
            {form.formState.errors.comment && (
              <p className="text-xs text-destructive">{form.formState.errors.comment.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitReview.isPending}
            className="w-full gap-2 rounded-xl"
          >
            {submitReview.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <MessageSquarePlus className="h-4 w-4" />
                ثبت نظر
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
