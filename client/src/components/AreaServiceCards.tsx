import { Camera, MapPin, Users, type LucideIcon } from "lucide-react";

interface AreaServiceCardsProps {
  cards: { title: string; text: string }[];
}

function iconFor(title: string): LucideIcon {
  if (/기록|사진|현장/.test(title)) return Camera;
  if (/부부|직접|진행/.test(title)) return Users;
  return MapPin;
}

export default function AreaServiceCards({ cards }: AreaServiceCardsProps) {
  return (
    <section className="mb-12 md:mb-16">
      <div className="overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white shadow-sm">
        <div className="grid divide-y divide-blue-100 md:grid-cols-3 md:divide-x md:divide-y-0">
          {cards.map((card) => {
            const Icon = iconFor(card.title);
            return (
              <div key={card.title} className="flex items-center gap-5 p-6 md:p-8">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-primary">
                  <Icon className="h-7 w-7" strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-foreground">{card.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {card.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
