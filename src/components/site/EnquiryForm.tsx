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
  onSuccess?: () => void;
}

export function EnquiryForm({ compact = false, plotId, projectName, onSuccess }: EnquiryFormProps) {
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
      if (onSuccess) {
        onSuccess();
      }
      
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
          rows={compact ? 2 : 3}
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
          className="flex-1 px-6 py-3.5 rounded-full gold-gradient text-gold-foreground font-semibold font-nav hover:opacity-95 transition disabled:opacity-60 text-sm"
        >
          {loading ? "Sending..." : "Get a Callback"}
        </button>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noreferrer"
          className="flex-1 px-6 py-3.5 rounded-full bg-whatsapp text-white font-semibold font-nav text-center hover:opacity-90 transition text-sm inline-flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </form>
  );
}
