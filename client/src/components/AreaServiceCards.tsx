import { Camera, MapPin, Users, type LucideIcon } from "lucide-react";

interface AreaServiceCardsProps {
  cards: { title: string; text: string }[];
}

function iconFor(title: string): LucideIcon {
  if (/기록|사진|현장/.test(title)) return Camera;
  if (/부부|직접/.test(title)) return Users;
  return MapPin;
}

export default function AreaServiceCards({ cards }: AreaServiceCardsProps) {
  return (
    <section className="-mx-4 mb-12 px-4 md:mx-0 md:px-0 md:mb-16">
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0">
        {cards.map((card) => {
          const Icon = iconFor(card.title);
          return (
            <div
              key={card.title}
              className="w-[78%] flex-shrink-0 snap-start px-1 sm:w-[46%] md:w-auto md:px-0"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary md:mb-4 md:h-12 md:w-12">
                <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.2} />
              </div>
              <p className="text-sm font-extrabold text-primary md:text-base">{card.title}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
