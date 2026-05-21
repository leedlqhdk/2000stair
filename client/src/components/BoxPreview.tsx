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
    <section id="box-preview" className="py-16 md:py-28 bg-white">
      <div className="container max-w-6xl">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
      
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {systems.map((item, index) => (
            <motion.div
              key={item.title}
              className="text-center"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="mx-auto mb-5 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-[1.75rem] border border-blue-100 bg-blue-50/50 text-primary">
                <item.icon className="h-9 w-9 md:h-10 md:w-10" />
              </div>

              <h3 className="text-lg md:text-xl font-extrabold text-foreground mb-1">
                {item.title}
              </h3>

              <p className="text-sm font-semibold text-muted-foreground">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
