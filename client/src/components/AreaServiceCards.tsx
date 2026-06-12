interface AreaServiceCardsProps {
  cards: { title: string; text: string }[];
}

export default function AreaServiceCards({ cards }: AreaServiceCardsProps) {
  return (
    <section className="-mx-4 mb-12 px-4 md:mx-0 md:px-0 md:mb-16">
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0">
        {cards.map((card) => (
          <div
            key={card.title}
            className="w-[78%] flex-shrink-0 snap-start rounded-[1.5rem] border border-blue-100 bg-white p-5 shadow-sm sm:w-[46%] md:w-auto md:p-6"
          >
            <p className="mb-2 text-sm font-extrabold text-primary md:mb-3">{card.title}</p>
            <p className="text-sm leading-6 text-muted-foreground md:leading-7">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
