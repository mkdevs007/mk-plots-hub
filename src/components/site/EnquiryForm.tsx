import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { whatsappHref } from "./WhatsAppButton";
import { submitEnquiry } from "@/lib/enquiries";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{7,15}$/, "Enter a valid phone"),
  city: z.string().trim().min(2).max(60),
  plotType: z.enum(["Residential", "Commercial", "Agricultural", "Industrial"]),
  message: z.string().trim().max(500).optional(),
});

interface EnquiryFormProps {
  compact?: boolean;
  plotId?: string;
  projectName?: string;
}

export function EnquiryForm({ compact = false, plotId, projectName }: EnquiryFormProps) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const defaultMsg =
    plotId && projectName
      ? `I am interested in Plot ${plotId} at ${projectName}. Please share pricing and details.`
      : "";

  const [message, setMessage] = useState(defaultMsg);

  useEffect(() => {
    setMessage(
      plotId && projectName
        ? `I am interested in Plot ${plotId} at ${projectName}. Please share pricing and details.`
        : "",
    );
  }, [plotId, projectName]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      city: String(fd.get("city") ?? ""),
      plotType: String(fd.get("plotType") ?? "Residential"),
      message: String(fd.get("message") ?? ""),
    };
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const i of result.error.issues) errs[String(i.path[0])] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    sessionStorage.setItem("callback_popup_dismissed", "true");
    
    try {
      await submitEnquiry({
        name: data.name,
        phone: data.phone,
        city: data.city,
        plot_type: data.plotType,
        message: data.message || undefined,
        project_name: projectName,
        plot_id: plotId,
      });
      
      toast.success("Enquiry submitted successfully!");
      
      navigate({
        to: "/thank-you",
        search: {
          name: data.name,
          phone: data.phone,
          city: data.city,
          type: data.plotType,
          message: data.message || undefined,
        },
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit enquiry. Please try again.");
      setLoading(false);
    }
  };

  const fieldCls =
    "w-full px-4 py-3 rounded-md bg-background border border-border focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition text-sm";

  return (
    <form onSubmit={onSubmit} className={`grid gap-3 ${compact ? "" : "md:grid-cols-2"}`}>
      <div className={compact ? "" : "md:col-span-1"}>
        <input name="name" placeholder="Your Name *" className={fieldCls} />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
      </div>
      <div>
        <input name="phone" type="tel" placeholder="Phone Number *" className={fieldCls} />
        {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
      </div>
      <div>
        <input name="city" placeholder="City *" className={fieldCls} />
        {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
      </div>
      <div>
        <select name="plotType" defaultValue="Residential" className={fieldCls}>
          <option>Residential</option>
          <option>Commercial</option>
          <option>Agricultural</option>
          <option>Industrial</option>
        </select>
      </div>
      <div className={compact ? "" : "md:col-span-2"}>
        <textarea
          name="message"
          rows={3}
          placeholder="Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={fieldCls}
        />
        {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
      </div>
      <div className={`flex flex-col sm:flex-row gap-3 ${compact ? "" : "md:col-span-2"}`}>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3.5 rounded-full gold-gradient text-gold-foreground font-semibold hover:opacity-95 transition disabled:opacity-60 text-sm"
        >
          {loading ? "Sending..." : "Get a Callback"}
        </button>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noreferrer"
          className="flex-1 px-6 py-3.5 rounded-full bg-whatsapp text-white font-semibold text-center hover:opacity-90 transition text-sm"
        >
          Chat on WhatsApp
        </a>
      </div>
    </form>
  );
}
