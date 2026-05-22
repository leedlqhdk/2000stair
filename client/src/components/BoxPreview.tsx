import { Building2, Camera, MessageCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const systems = [
  {
    icon: Building2,
    title: "현장 확인",
    label: "Site Check",
  },
  {
    icon: ShieldCheck,
    title: "직접 관리",
    label: "Direct Care",
  },
  {
    icon: Camera,
    title: "사진 기록",
    label: "Photo Record",
  },
  {
    icon: MessageCircle,
    title: "빠른 소통",
    label: "Fast Feedback",
  },
];

export default function BoxPreview() {
  return (
    <section id="box-preview" className="pt-10 pb-12 md:pt-12 md:pb-14 bg-white">
      <div className="container max-w-6xl">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-3 md:mb-4"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
      
        </motion.div>

        <div className="grid grid-cols-4 gap-3 sm:gap-5 md:gap-8">
          {systems.map((item, index) => (
            <motion.div
              key={item.title}
              className="text-center"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="mx-auto mb-2.5 flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50/50 text-primary">
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </div>

              <h3 className="text-[0.65rem] sm:text-xs md:text-sm font-extrabold text-foreground mb-0.5">
                {item.title}
              </h3>

              <p className="text-[0.5rem] sm:text-[0.6rem] md:text-xs font-semibold text-muted-foreground">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
