"use client";

import { motion } from "framer-motion";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/shared/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";

const faqs = [
  {
    q: "چگونه می‌توانم اقامتگاه رزرو کنم؟",
    a: "کافی است مقصد و تاریخ مورد نظر خود را جستجو کنید، از بین اقامتگاه‌های موجود انتخاب کنید، اطلاعات رزرو را تکمیل کرده و پرداخت را انجام دهید. بلافاصله تأیید رزرو برای شما ارسال می‌شود.",
  },
  {
    q: "آیا امکان کنسلی رزرو وجود دارد؟",
    a: "بله. بسته به سیاست کنسلی هر اقامتگاه، می‌توانید تا چند روز قبل از تاریخ ورود، رزرو خود را کنسل کرده و مبلغ پرداختی را دریافت کنید. جزئیات سیاست کنسلی در صفحه هر اقامتگاه ذکر شده است.",
  },
  {
    q: "روش‌های پرداخت چیست؟",
    a: "ویلاستا از درگاه‌های بانکی معتبر ایرانی پشتیبانی می‌کند. پرداخت به صورت آنلاین و امن انجام می‌شود. در آینده امکان پرداخت اقساطی نیز فراهم خواهد شد.",
  },
  {
    q: "چگونه میزبان شوم؟",
    a: "برای میزبان شدن، کافی است در ویلاستا ثبت‌نام کنید، حساب کاربری خود را به حالت میزبان ارتقا دهید و اقامتگاه خود را با ارائه عکس‌ها و اطلاعات کامل ثبت کنید. تیم ما پس از بررسی، اقامتگاه شما را تأیید می‌کند.",
  },
  {
    q: "آیا اقامتگاه‌ها استاندارد هستند؟",
    a: "بله. تمام اقامتگاه‌های ویلاستا توسط تیم ما بررسی و تأیید می‌شوند. عکس‌ها واقعی و اطلاعات دقیق هستند. همچنین نظرات مسافران قبلی به شما کمک می‌کند تا انتخاب بهتری داشته باشید.",
  },
  {
    q: "اگر مشکلی پیش بیاید چه کنم؟",
    a: "پشتیبانی ویلاستا به صورت ۲۴ ساعته و ۷ روز هفته آماده پاسخگویی به شماست. می‌توانید از طریق تلفن، ایمیل یا چات آنلاین با ما در ارتباط باشید.",
  },
];

export function Faq() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading subtitle="سوالات متداول" title="هر چه می‌پرسید، پاسخ داریم" align="center" />

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={(e) => { e.preventDefault(); toast.success("سوال شما ثبت شد، به زودی پاسخ می‌دهیم"); }}
          className="mx-auto mt-6 flex max-w-md gap-2"
        >
          <Input placeholder="سوال خود را جستجو کنید..." className="bg-background" />
          <Button type="submit" size="icon" className="shrink-0">
            <Search className="h-4 w-4" />
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card px-5 shadow-sm"
              >
                <AccordionTrigger className="text-right text-sm font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
